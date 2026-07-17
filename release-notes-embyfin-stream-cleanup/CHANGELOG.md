## [1.3.0] - 2026-07-17

### Changed

- Replaced the debug dashboard with a login-gated, mobile-friendly PWA dashboard. Log in with your Dispatcharr credentials to view live channel/client status, media server health, and recent terminations, and to edit plugin settings without going through the Dispatcharr admin UI.
- The dashboard's mount path is now configurable (**Dashboard Mount Path**, default `/dash`), alongside existing port and bind host settings.
- Renamed and reorganized dashboard-related settings: **Enable Debug Server** is now **Web Dashboard** (disabled by default), **Mask Sensitive Data in Debug Page** is now **Mask Sensitive Data on Dashboard**, and **Debug Server Port/Host** are now **Dashboard Port/Bind Host**. Settings are now grouped under "Global Settings" and "Dashboard Settings" headers for clarity.
- Plugin action messages and status output now refer to "Dashboard" instead of "Debug server".

### Fixed

- The dashboard now reliably starts in the same worker process as the stream monitor, and self-heals if its first startup attempt fails (e.g. port not free yet), retrying automatically on each poll cycle instead of requiring a manual restart.
- Reduced log noise from repeated messages about shared client identifiers across media servers.

