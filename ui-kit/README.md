# @swvn-dispatch/dispatch-ui-kit

Shared Mantine theme, layout patterns, and small utilities for the Dispatcharr
plugin dashboard SPAs (`force-fallback`, `multiview`, and future ones).
Extracted so the identical `ConfirmModal`, login screen, and `AppShell`
header-bar pattern stop being hand-copied between repos.

Scope: theme + layout/Mantine-usage patterns. Not a design-token system —
neither consumer app has one today, and this package doesn't invent one.

## Install

Distributed via GitHub Packages under the `@swvn-dispatch` scope, as a normal
versioned dependency (not a git dependency).

Add to the consuming app's `package.json`:

```json
"dependencies": {
  "@swvn-dispatch/dispatch-ui-kit": "^0.1.0"
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

**Local dev (manual, one-time, per machine)**: this package is not automated
for local installs. Add a personal PAT with `read:packages` scope to your
global `~/.npmrc`:

```
//npm.pkg.github.com/:_authToken=<your-personal-token>
```

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

## Publishing

`workflow_dispatch`-triggered via `.github/workflows/publish-ui-kit.yml` in
this repo (`sethwv-plugins-dev`). Pick a version bump (`patch`/`minor`/
`major`); the workflow builds and validates first, then bumps, tags
(`ui-kit-vX.Y.Z`), and publishes — a failed build produces no tag, no commit,
no publish.
