# @swvn-dispatch/dispatch-ui-kit

Shared Mantine theme, layout patterns, and small utilities for the Dispatcharr
plugin dashboard SPAs (`source-switch`, `multiview`, and future ones).
Extracted so the identical `ConfirmModal`, login screen, and `AppShell`
header-bar pattern stop being hand-copied between repos.

Scope: theme + layout/Mantine-usage patterns. Not a design-token system —
neither consumer app has one today, and this package doesn't invent one.

See `CHANGELOG.md` for release history.

## Install

Distributed via GitHub Packages under the `@swvn-dispatch` scope, as a normal
versioned dependency (not a git dependency).

Add to the consuming app's `package.json`, **pinned exactly (no `^`)** —
see "Bumping consumer apps after a release" below for why:

```json
"dependencies": {
  "@swvn-dispatch/dispatch-ui-kit": "0.1.0"
}
```

And an `.npmrc` next to it (safe to commit — no literal secret, the token
comes from the environment):

```
@swvn-dispatch:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

**CI**: export `NODE_AUTH_TOKEN` (backed by the `SETH_PAT` org secret) on any
step that runs `npm install` for a consumer app.

**GitHub Packages always requires a token, even for public packages.**
Unlike the public npmjs.org registry, `npm.pkg.github.com` rejects
unauthenticated `npm install` for every package regardless of visibility —
making this package public does *not* remove the need for a PAT. There is no
registry-side way around this.

**Local dev (manual, one-time, per machine)**: this package is not automated
for local installs. Two things are required, and **both** matter:

1. A personal PAT with `read:packages` scope, exported as an environment
   variable in your shell profile (`~/.zshrc` / `~/.zprofile`):
   ```
   export NODE_AUTH_TOKEN=<your-personal-token>
   ```
2. This works *because* each consumer's committed `.npmrc` reads
   `${NODE_AUTH_TOKEN}` from the environment (see below) — the same file CI
   uses. **A token dropped directly into `~/.npmrc` is not enough on its
   own**: the consumer app's project-level `.npmrc` takes precedence over
   your global `~/.npmrc` for the same registry host, and since it's written
   as `${NODE_AUTH_TOKEN}`, an unset env var resolves to an empty string —
   silently sending an empty bearer token and failing with a 401 that looks
   identical to "bad token." If `npm install` 401s in a consumer app, check
   `NODE_AUTH_TOKEN` is actually exported in *that* shell before suspecting
   the token itself.

## Usage

```jsx
// main.jsx
import { createRoot } from 'react-dom/client';
import { AppProviders } from '@swvn-dispatch/dispatch-ui-kit';
import '@swvn-dispatch/dispatch-ui-kit/styles.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
```

```js
// api.js
import { createApiClient } from '@swvn-dispatch/dispatch-ui-kit';

const client = createApiClient({
  tokenKey: 'myapp_token',
  onUnauthorized: () => { /* bounce to login */ },
});

export const login = client.login;
export const logout = client.logout;
export const isAuthenticated = client.isAuthenticated;
```

See exported members in `src/index.js`: `AppProviders`, `AppHeader`,
`LoginScreen`, `ConfirmModal`, `createApiClient`, `resolveStatusColor` /
`DEFAULT_STATUS_COLORS`, `FieldLabel`, `FieldRenderer`, `useDebouncedFieldSave`,
`CollapsiblePanel`, `SettingsPanel`, and the shared `theme` / `BRAND_COLOR` /
`BACKGROUND_COLOR` constants.

### `AppHeader` logo menu

Clicking the logo opens a dropdown with links to the plugin's GitHub repo and
Ko-fi support page — pass per-app values:

```jsx
<AppHeader
  logoUrl={logoUrl}
  appName="Multiview"                 // rendered above the version, non-muted, tight line-height
  version={__APP_VERSION__}
  githubUrl="https://github.com/swvn-dispatch/dispatcharr-multiview"
  // kofiUrl defaults to https://ko-fi.com/sethwv — override or pass null to omit
  username={currentUsername}          // optional, shown above the logout link
  onLogout={onLoggedOut}              // optional — omit to hide the trailing username/logout block entirely
  actions={[
    { key: 'refresh', label: 'Refresh', icon: IconRefresh, onClick: doRefresh, loading, active, count,
      variant: 'light', color: 'teal' },   // both optional — override the desktop Button style per action
  ]}
  extra={<SomeCustomHeaderControl />}  // optional — rendered after actions, before the logout block;
                                        // escape hatch for header content actions[] can't express
                                        // (e.g. an unlabeled icon button, a dropdown trigger)
/>
```

If both `githubUrl` and `kofiUrl` end up falsy, the logo renders plain (no
empty dropdown). `githubUrl` has no default — pull it from that app's
`plugin.json` `repo_url` at the call site, it's not something this package
can know.

### Session persistence: silent token refresh + "Remember me"

**The password is never stored anywhere by this package.** Two separate,
safe mechanisms cover "I don't want to log in constantly":

1. **Silent access-token refresh.** `createApiClient` accepts the refresh
   token both consumer backends already issue on login (`RefreshToken.for_user`
   via `rest_framework_simplejwt`, previously generated but discarded — see
   each app's `handle_auth_token` / new `handle_auth_refresh` in
   `src/dash/api.py`) and uses it to silently obtain a new access token on a
   401, instead of immediately forcing a full re-login. Dispatcharr's access
   tokens are short-lived (`ACCESS_TOKEN_LIFETIME = 30 minutes` as of this
   writing); the refresh token lasts a day (`REFRESH_TOKEN_LIFETIME`), so this
   takes effective session length from 30 minutes to up to 24 hours.
   - New `createApiClient` options: `refreshTokenKey` (default
     `` `${tokenKey}_refresh` ``) and `refreshPath` (default `/auth/refresh`).
   - Concurrent 401s (e.g. several polling intervals firing near-simultaneously)
     share one in-flight refresh call rather than each triggering their own.
   - Refresh is attempted **at most once** per failed request — if the refresh
     itself fails, or the retried request 401s again, it falls through to the
     normal `onUnauthorized` flow exactly as before. No infinite loop risk.
   - Requires a matching backend route — see "Consumer backend requirements"
     below. Without it, this silently no-ops back to today's behavior (fetch
     to `refreshPath` 404s, refresh "fails", falls through to logout) — not a
     hard dependency, but the whole point of adding it.

2. **`LoginScreen`'s "Remember me" checkbox** — persists only the
   *username* (`localStorage`, key `dispatch_ui_kit_last_username`) when
   checked, prefilling it on return visits; unchecking actively clears any
   previously saved value. Password fill/save is still entirely the
   browser's own password manager, via the existing
   `autoComplete="current-password"` on the form — nothing to configure.

#### Consumer backend requirements for silent refresh

Each consumer's own backend needs a `/auth/refresh` route (mirrors
`handle_auth_token` exactly, see `source-switch/src/dash/api.py` or
`multiview/src/dash/api.py` for the reference implementation): accepts
`{refresh: "<token>"}`, validates it in-process with
`rest_framework_simplejwt.tokens.RefreshToken(refresh_str)` (no proxy to
Dispatcharr core's own `token/refresh/` needed — the plugin already runs
in-process with Django and can validate directly, same pattern already used
for issuing the initial token pair), and returns `{access: "<new token>"}` or
a 401 on `TokenError`. No `_verify_token` gate on this route — recovering
from an invalid access token is the entire point of it.

## Important caveats

- **`index.html` / `manifest.json` theme colors are not wired to `theme.js`.**
  `<meta name="theme-color">` and `manifest.json`'s `theme_color` /
  `background_color` are static files parsed by the browser/OS before any JS
  runs — they can't import this package. Keep them in sync with
  `BRAND_COLOR` (`#1971c2`) / `BACKGROUND_COLOR` (`#1a1b1e`) by hand.
- **One shared React/Mantine instance.** `react`, `react-dom`,
  `@mantine/core`, `@mantine/hooks`, `@mantine/notifications`, and
  `@tabler/icons-react` are peer dependencies, externalized in this build —
  the consuming app supplies them.

## Local development (test before publishing)

Don't publish a throwaway version just to try a change in a real app. Link
the local checkout into a consumer instead:

```bash
# 1. build once, then register the local package
cd ui-kit
npm install
npm run build
npm link

# 2. point a consumer at the local link instead of the registry
cd ../../source-switch/src/dash/ui   # or multiview/src/dash/ui
npm link @swvn-dispatch/dispatch-ui-kit

# 3. iterate — rebuild on save, run the consumer's dev server
cd ../../../sethwv-plugins-dev/ui-kit && npm run build:watch   # terminal A
cd ../../source-switch/src/dash/ui && npm run dev              # terminal B

# 4. when done, restore the registry version
cd source-switch/src/dash/ui
npm unlink @swvn-dispatch/dispatch-ui-kit
npm install
```

**Consumer `vite.config.js` needs `resolve.dedupe`** (already set in both
source-switch and multiview) listing `react`, `react-dom`, and the three
`@mantine/*` peers. Without it, a linked package can resolve React/Mantine
from *its own* `node_modules` (it has copies there for its own build) instead
of the consumer's, causing "Invalid hook call" or broken Mantine context —
this only bites with `npm link`/`file:` deps, not registry installs, but it's
harmless to leave in permanently.

When close to actually publishing, `npm pack` in `ui-kit/` produces the exact
tarball that would ship — installing that instead of using the link catches
packaging mistakes (e.g. a file missing from `"files"` in `package.json`)
that linking the whole working directory can't.

## Publishing

`workflow_dispatch`-triggered via `.github/workflows/publish-ui-kit.yml` in
this repo (`sethwv-plugins-dev`). Pick a version bump (`patch`/`minor`/
`major`); the workflow builds and validates first, then bumps, tags
(`ui-kit-vX.Y.Z`), and publishes — a failed build produces no tag, no commit,
no publish.

### Bumping consumer apps after a release

**This never happens automatically, for any bump size — on purpose.** Both
consumer apps pin this package to an **exact version** (no `^` range). That
was a deliberate fix, not the original design: with a caret range like
`^0.1.0`, patch bumps (`0.1.0` → `0.1.1`) are technically in-range but only
get picked up by a fresh install if there's no committed lockfile pinning
the old resolved version, while minor/major bumps are never picked up
regardless of lockfile (npm's caret range treats the minor digit like a
major-version boundary for pre-1.0 packages). That meant the two apps here
could silently behave *differently* from each other on the exact same patch
release, depending on which one happened to have a lockfile checked in at
the time. An exact pin makes the answer the same for every app, every bump
size, always: nothing changes until something explicitly bumps it.

Neither consumer commits `package-lock.json` (both gitignore
`src/dash/ui/package-lock.json`) — with everything pinned exactly, a
lockfile doesn't add reproducibility for *this* dependency, and not tracking
it avoids the two apps' lockfiles drifting out of sync with each other or
with `package.json` as a separate maintenance chore.

Run, from this directory:

```bash
./bump-consumers.sh
```

(Needs `NODE_AUTH_TOKEN` exported in your shell, same as any other local
install.) This runs `npm install @swvn-dispatch/dispatch-ui-kit@latest --save-exact`
in every consumer app in one shot — rewriting each one's exact pin in
`package.json` and installing. Review and commit the `package.json` change
in each consumer repo (the regenerated local `package-lock.json` is
gitignored, nothing to commit there). Add a new
consumer to the `CONSUMERS` array in the script when one exists.

(Equivalent by hand, per app, if you'd rather:
`cd <app>/src/dash/ui && npm install @swvn-dispatch/dispatch-ui-kit@latest --save-exact`.)

**Gotcha already hit once, fixed, worth knowing if you touch this workflow
again:** `npm version <type>`'s *own* built-in git commit does not reliably
land on `main` in this setup — the "Bump version" step appeared to succeed,
`npm publish` used the right new version, but the version-bump commit itself
silently never got pushed (`git push` reported "Everything up-to-date" with
nothing actually new to push), leaving `package.json` in the repo permanently
one version behind what's actually published. Root cause was never fully
pinned down. The workflow now sidesteps npm's git integration entirely:
`npm version --no-git-tag-version` only bumps the file, then the workflow
does `git add`/`git commit`/`git push origin HEAD:main` itself explicitly
(the explicit `HEAD:main` also protects against `actions/checkout` leaving
the workspace on a detached HEAD, where a bare `git push` no-ops). If
`ui-kit/package.json`'s committed version ever looks stale compared to what's
on the registry (`npm view @swvn-dispatch/dispatch-ui-kit version`), that's
this bug resurfacing — fix the version file by hand to match the registry
before the next publish run, or the next bump will collide with an
already-published version and fail outright.
