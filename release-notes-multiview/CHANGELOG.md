## [Unreleased]

### Added

- Web dashboard: a mobile-friendly PWA served at `http://<host>:9292/dash/` for editing plugin settings and managing active streams without opening the Dispatcharr admin UI. Settings auto-save as you change them; an "Active Multiviews" view shows running streams with per-layout reload and per-channel reconnect; a Refresh action regenerates the M3U/EPG and triggers a Dispatcharr sync. Disabled by default, enable it via the Web Dashboard setting on the plugin settings page (requires a plugin/Dispatcharr reload to take effect). May require adding `9292:9292` to your `docker-compose.yml` ports.
- Plugin settings page now warns when Dispatcharr's Proxy "Channel Initialization Timeout" is set below 8 seconds, which can cause multiview tiles to fail on startup before channels finish initializing.
- After the first manual "Install PyAV" run, the plugin remembers consent and automatically reinstalls PyAV in the background if it's ever found missing or outdated (e.g. after a plugin update resets the vendored copy), with no need to click it again.

### Changed

- Plugin settings reorganized into a Global Settings section (Web Dashboard, Auto-Refresh Interval, Number of Multiview Layouts) above the existing Video Settings section.

### Fixed

- Closed the seam gap between stacked side tiles in the Featured layout, without cropping tile content.
- Audio drift resync on unstable streams.
- Dashboard API is now served under `/dash/api/` so it works correctly behind a reverse proxy.
