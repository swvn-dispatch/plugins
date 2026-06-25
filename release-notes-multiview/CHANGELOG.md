## [0.2.2] - 2026-06-25

### Added

- Per-layout EPG source mode: each layout can now forward real EPG data from one of its source channels instead of showing a built-in placeholder entry. When "Forward from channel" is selected, a channel picker appears and the layout's EPG shows actual programme titles, subtitles, and descriptions. Falls back to placeholder if the selected channel has no EPG data.

### Fixed

- Fixed an intermittent plugin load failure that occurred during Dispatcharr reload cycles. Relative `importlib.import_module` calls would fail with `KeyError` or `ModuleNotFoundError` if the parent package was absent from `sys.modules` at reload time. Replaced with a file-path-based loader that bypasses the package registry lookup.