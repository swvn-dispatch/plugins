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


# [v1.1.0](https://github.com/sethwv/embyfin-stream-cleanup/releases/tag/v1.1.0)

- Media server identifiers now accept CIDR blocks (e.g. `10.0.0.0/24`) to match entire subnets - useful for clustered or multi-address setups where the server may connect from different IPs
- IP and username inputs are trimmed of surrounding whitespace before matching, preventing missed connections from accidental spaces in configuration

**Installing**: This plugin is available in the "Get Plugins" section of your Dispatcharr installation.
**Changelog**: https://github.com/sethwv/embyfin-stream-cleanup/releases/latest