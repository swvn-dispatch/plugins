# Changelog

All notable changes to `@swvn-dispatch/dispatch-ui-kit` are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Releases are published by the `Publish UI Kit` GitHub Actions workflow
(`.github/workflows/publish-ui-kit.yml` in the parent `sethwv-plugins-dev`
repo), triggered automatically on any push to `main` that bumps
`package.json`'s version (also runnable manually via `workflow_dispatch`).
Tagged `ui-kit-X.Y.Z` (no `v` — this naming scheme is meant to generalize
to future packages built the same way, each with its own
`<package>-X.Y.Z` tag prefix).

## [Unreleased]

## [0.1.12] - 2026-07-13

### Internal

- No functional change (re-publish; no `src/` diff vs 0.1.11).

## [0.1.11] - 2026-07-13

### Added

- `AppHeader` action entries accept per-item `variant` and `color`
  overrides (Mantine `Button` props, desktop only), in addition to the
  existing `active` teal-highlight flag.

## [0.1.10] - 2026-07-13

### Added

- `AppHeader` gained an `extra` prop: a render-prop slot for header
  content rendered after `actions` and before the logout block, for
  cases `actions[]` can't express (e.g. an unlabeled icon button or a
  dropdown trigger).

## [0.1.9] - 2026-07-08

### Changed

- `AppHeader`'s `onLogout` is now optional. The trailing
  username/logout block only renders when `onLogout` is passed.

## [0.1.8] - 2026-07-07

### Internal

- No user-facing change; comment rewording in `apiClient.js` and
  `theme.js` only.

## [0.1.7] - 2026-07-07

### Changed

- `AppHeader`'s logout control restyled from a `Button` to a plain
  text link (`UnstyledButton`).

## [0.1.6] - 2026-07-07

### Added

- `AppHeader` gained a `username` prop, displayed above the logout
  link.
- `createApiClient` gained `getUsername()` and a `usernameKey` option;
  the active username is persisted on login and cleared on logout or
  refresh failure, independent of `LoginScreen`'s "remember me" key.

## [0.1.5] - 2026-07-07

### Added

- `FieldRenderer` renders a `PasswordInput` instead of `TextInput`
  when `field.input_type === 'password'`.

## [0.1.4] - 2026-07-07

### Added

- Silent access-token refresh in `createApiClient`: new
  `refreshTokenKey` (default `` `${tokenKey}_refresh` ``) and
  `refreshPath` (default `/auth/refresh`) options. Concurrent 401s
  share one in-flight refresh call; refresh is attempted at most once
  per failed request before falling back to `onUnauthorized`. Requires
  a matching backend `/auth/refresh` route per consumer — silently
  no-ops back to prior behavior if absent.
- `LoginScreen` "Remember me" checkbox — persists only the username
  (`localStorage`, key `dispatch_ui_kit_last_username`), never the
  password.

## [0.1.3] - 2026-07-07

### Changed

- `AppHeader` logo dropdown menu widened from 200px to 300px.

## [0.1.2] - 2026-07-07

### Changed

- `AppHeader` dropdown menu item labels: "GitHub" → "{appName} on
  GitHub", "Support on Ko-fi" → "Buy me a Coffee".

## [0.1.1] - 2026-07-07

### Added

- `AppHeader` logo click-menu with links to a GitHub repo and Ko-fi
  page, via new `githubUrl`/`kofiUrl` props (`kofiUrl` defaults to
  `https://ko-fi.com/sethwv`). Menu is omitted and the logo renders
  plain if both end up falsy.
- `AppHeader` gained an `appName` prop, rendered as a line above the
  version text.

## [0.1.0] - 2026-07-07

### Added

- Initial extraction and release: `AppProviders`, `AppHeader`,
  `LoginScreen`, `ConfirmModal`, `createApiClient`, `resolveStatusColor`
  / `DEFAULT_STATUS_COLORS`, `FieldRenderer` / `FieldLabel`,
  `useDebouncedFieldSave`, `CollapsiblePanel`, `SettingsPanel`, and the
  shared `theme` / `BRAND_COLOR` / `BACKGROUND_COLOR` constants.
