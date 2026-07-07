# sethwv Dev Plugins

A Dispatcharr plugin repository aggregator. This repo collects release metadata from multiple plugin repos and publishes a combined manifest that Dispatcharr can consume via the Plugin Hub.

The published manifest URL (add this to Dispatcharr → Plugins → Repositories):

```
https://raw.githubusercontent.com/sethwv/my-plugins/manifest/manifest.json
```

---

## UI Kit

`ui-kit/` is a separate package, `@swvn-dispatch/dispatch-ui-kit` — shared
Mantine theme, layout components (header bar, login screen, confirm modal,
settings panel), and small utilities for the plugin dashboard SPAs
(`force-fallback`, `multiview`, and future ones). Published independently to
GitHub Packages via its own `workflow_dispatch` workflow
(`.github/workflows/publish-ui-kit.yml`), unrelated to the manifest-aggregator
machinery below. See `ui-kit/README.md` for install, usage, versioning, and
local-testing instructions.

---

## Scripts

`scripts/generate-pwa-icons.py` — standardizes generating a plugin
dashboard's PWA icons from its source logo (`pip install pillow` required).
The favicon (`logo.png`) keeps the source's transparency; the install icons
(`icon-192.png`, `icon-512.png`) get the logo flattened onto an opaque
background (default `#1a1b1e`, matching the ui-kit's `BACKGROUND_COLOR`) —
a transparent PNG left as-is looks broken once the OS applies its own
icon mask/crop outside a browser tab. No maskable safe-zone padding is
added, matching the existing icons in `force-fallback`/`multiview` exactly.

```bash
python3 scripts/generate-pwa-icons.py <source-logo.png> <plugin>/src/dash/ui/public
```

---

## How it works

### Layout

```
sethwv-plugins-dev/
├── repos.json                              # List of plugin repos to aggregate
├── config.json                             # Registry-level settings
└── .github/
    ├── scripts/
    │   └── build_combined_manifest.py      # Manifest builder
    └── workflows/
        └── update-manifest.yml             # CI workflow
```

The published output lives on the **`manifest` branch** (orphan, no source history):

```
manifest branch/
├── manifest.json                   # Combined root manifest
└── plugins/
    ├── dispatcharr_exporter/
    │   ├── manifest.json           # Per-plugin manifest (all versions)
    │   └── logo.png
    └── emby_stream_cleanup/
        ├── manifest.json
        └── logo.png
```

### Trigger sources

The manifest is rebuilt in three situations:

| Trigger | When |
|---|---|
| `repository_dispatch` (`plugin-updated`) | A plugin repo finishes publishing a release or dev pre-release |
| `workflow_dispatch` | Manually triggered from the Actions tab |
| Schedule | Every 6 hours (catches any missed dispatches) |

Plugin repos fire the dispatch at the end of their `release.yml` and `dev-prerelease.yml` workflows using a fine-grained PAT stored as the `PLUGINS_DISPATCH_PAT` secret.

### What `build_combined_manifest.py` does

For each entry in `repos.json` the script:

1. Fetches `plugin.json` from the repo's `main` branch via `raw.githubusercontent.com` to get name, description, author, license, help URL, etc.
2. Derives the plugin `slug` from the name (`lowercase`, `spaces → _`).
3. Uses the `gh` CLI to paginate all GitHub Releases for the repo.
4. Processes **stable releases** (not draft, not pre-release):
   - Finds the `.zip` asset
   - Downloads it and computes a SHA-256 checksum
   - Reads `min_dispatcharr_version` from the bundled `plugin.json`
   - Resolves the commit SHA from the release tag
5. Processes the **dev pre-release** (looked up by the fixed `dev_tag`, e.g. `dev-latest`):
   - Same as above but marked `prerelease: true` in the per-plugin manifest
   - Never appears as `latest_version` in the root manifest
6. Fetches the plugin logo from `main`.
7. Writes output to `_manifest_out/`:
   - `manifest.json` — combined root manifest (all plugins, stable metadata only)
   - `plugins/{slug}/manifest.json` — full version history including dev build
   - `plugins/{slug}/logo.png`

If a plugin has no stable releases yet, all `latest_*` fields are omitted from the root manifest entry — only the dev build appears in the per-plugin manifest.

### Configuration files

**`repos.json`** — one entry per plugin repo:

```json
[
  {
    "repo": "sethwv/dispatcharr-exporter",
    "plugin_json": "src/plugin.json",
    "logo": "src/logo.png",
    "dev_tag": "dev-latest"
  }
]
```

| Field | Description |
|---|---|
| `repo` | GitHub `owner/repo` slug |
| `plugin_json` | Path to `plugin.json` inside the repo |
| `logo` | Path to the logo image inside the repo |
| `dev_tag` | Fixed Git tag name used for the dev pre-release |

**`config.json`** — registry-level settings:

```json
{
  "registry_name": "sethwv Dev Plugins",
  "aggregator_repo": "sethwv/my-plugins"
}
```

| Field | Description |
|---|---|
| `registry_name` | Display name shown in the Dispatcharr Plugin Hub |
| `aggregator_repo` | This repo (`owner/repo`), used to build absolute manifest URLs |

---

## Adding a new plugin

1. Add an entry to `repos.json`.
2. Ensure the plugin repo has `PLUGINS_DISPATCH_PAT` set as a secret (see below).
3. Trigger the workflow manually, or wait for the next schedule run or a dispatch from the plugin repo.

---

## Required secrets

| Secret | Where set | Purpose |
|---|---|---|
| `PLUGINS_DISPATCH_PAT` | Each **plugin repo** | Fine-grained PAT scoped to this aggregator repo with `contents: write`; allows plugin repos to trigger `repository_dispatch` here |

The aggregator itself uses only the default `GITHUB_TOKEN` (reads public release APIs and writes to the `manifest` branch).
