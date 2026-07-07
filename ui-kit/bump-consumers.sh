#!/bin/bash
# Bumps @swvn-dispatch/dispatch-ui-kit to the latest published version in
# every consumer app, so you don't have to remember to repeat this per app.
# Pins with --save-exact (no ^ range) — every consumer app pins this package
# to an exact version, on purpose, so nothing is ever picked up implicitly;
# see README.md's "Bumping consumer apps after a release". Run this after
# every `Publish UI Kit` workflow run, for every bump size, patch included.
#
# Requires NODE_AUTH_TOKEN (a personal GitHub Packages PAT with read:packages)
# exported in this shell — see README.md's "Local dev" section.
#
# Assumes the sibling-checkout layout used elsewhere in this workflow:
# ~/Development/{sethwv-plugins-dev,force-fallback,multiview,emby-stream-cleanup}/.
# Add a new consumer to CONSUMERS below when one exists.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CONSUMERS=(
  "$SCRIPT_DIR/../../force-fallback/src/dash/ui"
  "$SCRIPT_DIR/../../multiview/src/dash/ui"
  "$SCRIPT_DIR/../../emby-stream-cleanup/src/dash/ui"
)

if [ -z "${NODE_AUTH_TOKEN:-}" ]; then
  echo "error: NODE_AUTH_TOKEN is not set in this shell — see ui-kit/README.md's 'Local dev' section." >&2
  exit 1
fi

for dir in "${CONSUMERS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "skip: $dir not found"
    continue
  fi
  echo "=== $dir ==="
  (cd "$dir" && npm install @swvn-dispatch/dispatch-ui-kit@latest --save-exact)
  echo
done

echo "Done. Review and commit the package.json change in each consumer repo (package-lock.json is gitignored, nothing to commit there)."
