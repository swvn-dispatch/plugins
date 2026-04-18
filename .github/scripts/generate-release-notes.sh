#!/usr/bin/env bash
# generate-release-notes.sh
#
# Calls GitHub Models API (gpt-4o) to generate release notes from the diff
# between the previous and new release tags.
#
# Required env:
#   REPO        - owner/repo (e.g. sethwv/dispatcharr-exporter)
#   TAG         - new release tag (e.g. v3.0.0)
#   VERSION     - version string without leading v (e.g. 3.0.0)
#   RELEASE_URL - HTML URL of the GitHub release
#   SETH_PAT    - GitHub PAT with Models access
#
# Outputs (written to /tmp/release-notes/):
#   HIGHLIGHTS.md  - bullet-point summary for PR body / Discord
#   PR.md          - line 1: title, line 3+: paragraph body

set -euo pipefail

NOTES_DIR="/tmp/release-notes"
mkdir -p "$NOTES_DIR"

# ---------------------------------------------------------------------------
# 1. Find the previous stable release tag
# ---------------------------------------------------------------------------
echo "Fetching release list for $REPO..."

RELEASES=$(gh api "repos/$REPO/releases" --paginate --jq '[.[] | select(.prerelease == false and .draft == false) | .tag_name]')
RELEASE_COUNT=$(echo "$RELEASES" | jq 'length')

NEW_TAG="$TAG"

if [ "$RELEASE_COUNT" -lt 2 ]; then
  # First-ever release - compare against the initial commit
  echo "Only one release found; comparing against initial commit."
  OLD_TAG=$(gh api "repos/$REPO/commits?per_page=1&sha=main" --jq '.[0].sha' 2>/dev/null || \
            gh api "repos/$REPO/commits?per_page=1" --jq '.[0].sha')
  IS_FIRST_RELEASE=true
else
  # Second entry in the sorted list is the previous stable release
  OLD_TAG=$(echo "$RELEASES" | jq -r '.[1]')
  IS_FIRST_RELEASE=false
fi

echo "Comparing $OLD_TAG ... $NEW_TAG"

# ---------------------------------------------------------------------------
# 2. Fetch and split the diff by file
# ---------------------------------------------------------------------------
RAW_DIFF=$(gh api \
  -H "Accept: application/vnd.github.diff" \
  "repos/$REPO/compare/${OLD_TAG}...${NEW_TAG}" \
  2>/dev/null || true)

if [ -z "$RAW_DIFF" ]; then
  echo "::warning::Could not fetch diff. Using fallback release notes."
  RAW_DIFF=""
fi

echo "::notice::Raw diff size: ${#RAW_DIFF} bytes."

# Use Python to split into per-file chunks, sorted by priority
cat > /tmp/split_diff.py << 'PYEOF'
import sys, re, json

raw = sys.stdin.read()
sections = re.split(r'(?=^diff --git )', raw, flags=re.MULTILINE)

SKIP = re.compile(
    r'\.(lock|min\.js|map|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|pyc)$'
    r'|package-lock|yarn\.lock|poetry\.lock|__pycache__'
)
HIGH  = re.compile(r'plugin\.json|CHANGELOG|\.md$', re.IGNORECASE)
MED   = re.compile(r'\.py$')
SKIP_MED = re.compile(r'__init__|migration')

out = []
for s in sections:
    m = re.match(r'diff --git a/(\S+)', s)
    if not m or not s.strip():
        continue
    f = m.group(1)
    if SKIP.search(f):
        continue
    if HIGH.search(f):
        p = 0
    elif MED.search(f) and not SKIP_MED.search(f):
        p = 1
    else:
        p = 2
    out.append({"p": p, "f": f, "patch": s.strip()})

out.sort(key=lambda x: x["p"])
json.dump(out, sys.stdout)
PYEOF

FILE_SECTIONS=$(echo "$RAW_DIFF" | python3 /tmp/split_diff.py 2>/dev/null || echo "[]")
FILE_COUNT=$(echo "$FILE_SECTIONS" | jq 'length')
echo "::notice::${FILE_COUNT} relevant files to process."

# ---------------------------------------------------------------------------
# 3. Helper: call GitHub Models API
# ---------------------------------------------------------------------------
call_model() {
  local system_msg="$1"
  local user_msg="$2"
  local max_tokens="${3:-800}"

  local body
  body=$(jq -n \
    --arg s "$system_msg" \
    --arg u "$user_msg" \
    --argjson t "$max_tokens" \
    '{model:"gpt-4o", messages:[{role:"system",content:$s},{role:"user",content:$u}],
      response_format:{type:"json_object"}, max_tokens: $t}')

  local resp
  resp=$(curl -s -w "\n__STATUS__:%{http_code}" \
    -H "Authorization: Bearer $SETH_PAT" \
    -H "Content-Type: application/json" \
    -d "$body" \
    "https://models.inference.ai.azure.com/chat/completions")

  local status content
  status=$(echo "$resp" | tail -1 | sed 's/__STATUS__://')
  resp=$(echo "$resp" | sed '$d')

  if [ "$status" != "200" ]; then
    echo "::warning::Models API returned HTTP $status: $(echo "$resp" | jq -r '.error.message // empty' 2>/dev/null)" >&2
    echo ""
    return
  fi

  echo "$resp" | jq -r '.choices[0].message.content // empty' 2>/dev/null || true
}

# ---------------------------------------------------------------------------
# 4. Phase 1 — per-file summaries (non-doc files first, up to 6 files)
# ---------------------------------------------------------------------------
FILE_SYSTEM="You are a concise changelog assistant. Given a git diff for a single file, \
return a JSON object with one field: \"summary\" — a single sentence describing what \
changed from a user perspective. Focus on behaviour, new features, or bug fixes. \
Ignore formatting/comment-only changes. If nothing user-facing changed, set summary to null."

MAX_FILE_CALLS=6
MAX_PATCH_BYTES=6000

SUMMARIES=""
CALLS=0

# Process non-doc files first (p=1,2), then docs (p=0) if budget remains
for PRIORITY in 1 2 0; do
  while IFS= read -r entry; do
    [ -z "$entry" ] && continue
    [ "$CALLS" -ge "$MAX_FILE_CALLS" ] && break 2

    FNAME=$(echo "$entry" | jq -r '.f')
    PATCH=$(echo "$entry" | jq -r '.patch')

    # Truncate patch if needed
    if (( ${#PATCH} > MAX_PATCH_BYTES )); then
      PATCH="${PATCH:0:$MAX_PATCH_BYTES}
... (truncated)"
    fi

    echo "  Summarising $FNAME..."
    RESULT=$(call_model "$FILE_SYSTEM" "File: ${FNAME}

${PATCH}" 150)

    SUMMARY=$(echo "$RESULT" | jq -r '.summary // empty' 2>/dev/null || true)
    if [ -n "$SUMMARY" ] && [ "$SUMMARY" != "null" ]; then
      SUMMARIES="${SUMMARIES}- **${FNAME}**: ${SUMMARY}
"
      CALLS=$(( CALLS + 1 ))
    fi
  done < <(echo "$FILE_SECTIONS" | jq -c --argjson p "$PRIORITY" '.[] | select(.p == $p)')
done

echo "::notice::Per-file summaries complete ($CALLS files summarised)."

if [ -z "$SUMMARIES" ]; then
  echo "::warning::No file summaries generated. Using fallback."
  SUMMARIES="(no diff summary available)"
fi

# ---------------------------------------------------------------------------
# 5. Phase 2 — aggregate summaries into final release notes
# ---------------------------------------------------------------------------
echo "Calling GitHub Models API (aggregation)..."

AGENT_PROMPT=$(sed '/^---$/,/^---$/d' .github/scripts/Changelog.agent.md | sed '/^$/{ N; /^\n$/d; }')

AGG_SYSTEM="${AGENT_PROMPT}

IMPORTANT - CI OUTPUT FORMAT:
You are running in a CI environment. Do NOT create files.
Return a JSON object with exactly these three fields:
  - \"highlights\": bullet-point list (each line starts with \"- \"), user-facing changes only, max 6 bullets
  - \"pr_title\": short imperative phrase under 60 chars (no version prefix, no plugin name, no square brackets)
  - \"pr_body\": one paragraph describing what changed and why

The commit subject will be \"v{VERSION}: {pr_title}\", e.g.:
  \"v3.0.0: Unify live and VOD stream metrics\"
  \"v1.0.0: Initial release\"

Do not include any text outside the JSON object."

AGG_USER="Summarise release v${VERSION} of ${REPO} (${OLD_TAG} → ${NEW_TAG}).

Per-file change summaries:
${SUMMARIES}"

CONTENT=$(call_model "$AGG_SYSTEM" "$AGG_USER" 600)

if [ -z "$CONTENT" ]; then
  echo "::warning::Could not parse model response. Using fallback release notes."
  cat > "$NOTES_DIR/HIGHLIGHTS.md" <<EOF
- Updated to v${VERSION}
EOF
  cat > "$NOTES_DIR/PR.md" <<EOF
v${VERSION}: Plugin update

Updates plugin to v${VERSION}. See release: ${RELEASE_URL}
EOF
  exit 0
fi

# ---------------------------------------------------------------------------
# 6. Extract fields and write output files
# ---------------------------------------------------------------------------
HIGHLIGHTS=$(echo "$CONTENT" | jq -r '.highlights // empty')
PR_TITLE=$(echo "$CONTENT"   | jq -r '.pr_title   // empty')
PR_BODY=$(echo "$CONTENT"    | jq -r '.pr_body     // empty')

if [ -z "$HIGHLIGHTS" ] || [ -z "$PR_TITLE" ] || [ -z "$PR_BODY" ]; then
  echo "::warning::Model response missing expected fields. Using fallback."
  HIGHLIGHTS="- Updated to v${VERSION}"
  PR_TITLE="v${VERSION}: Plugin update"
  PR_BODY="Updates plugin to v${VERSION}. See release: ${RELEASE_URL}"
else
  PR_TITLE="v${VERSION}: ${PR_TITLE}"
fi

printf '%s\n' "$HIGHLIGHTS" > "$NOTES_DIR/HIGHLIGHTS.md"
printf '%s\n\n%s\n' "$PR_TITLE" "$PR_BODY" > "$NOTES_DIR/PR.md"

echo "Release notes written to $NOTES_DIR/"
echo "  PR title  : $PR_TITLE"
echo "  Highlights: $(echo "$HIGHLIGHTS" | wc -l) lines"
