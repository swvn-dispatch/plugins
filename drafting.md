# [v3.0.0](https://github.com/sethwv/dispatcharr-exporter/releases/tag/v3.0.0)

This release includes a major refactor of the plugin's structure and metrics, as well as several new features and improvements:

- New user metrics - track user info, stream limits, and active stream counts per user (opt-in via settings)
- M3U account info metric for account metadata
- `dispatcharr_active_streams` now breaks down by `type="live"` and `type="vod"`
- `type` label added to several stream metrics (fps, bitrates, channel number, stream index, available streams)
- Client metrics now include `user_id` and `username` labels
- Stopping the server now prevents auto-start from restarting it
- Legacy metrics and the `Include Legacy Metric Formats` setting have been removed
- `Check for Updates` action and `Disable Update Notifications` setting removed
- Requires Dispatcharr v0.22.0 or later

**Installing**: This plugin is available in the "Get Plugins" section of your Dispatcharr installation.
**Changelog**: https://github.com/sethwv/dispatcharr-exporter/releases/latest


---


# [v1.0.0](https://github.com/sethwv/embyfin-stream-cleanup/releases/tag/v1.0.0)

Initial Release!

- Dispatcharr plugin that automatically cleans up stale Emby/Jellyfin connections
- Terminates idle connections and orphaned sessions that are no longer playing on the media server
- Supports multiple media servers with per-server identifiers (IP, hostname, or XC username)
- Timers pause automatically during stream failover and buffering
- Optional debug dashboard for monitoring active channels, matched clients, and recent terminations
- Requires Dispatcharr v0.22.0 or later

**Installing**: This plugin is available in the "Get Plugins" section of your Dispatcharr installation.
**Changelog**: https://github.com/sethwv/embyfin-stream-cleanup/releases/latest