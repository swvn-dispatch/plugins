## [Unreleased] - v3.0.0

### Added
- User metrics: `dispatcharr_user_info`, `dispatcharr_user_date_joined_timestamp`, `dispatcharr_user_stream_limit`, and `dispatcharr_user_active_streams` (opt-in via new `Include User Statistics` setting)
- `dispatcharr_m3u_account_info` gauge providing metadata for each M3U account
- Per-type breakdown on `dispatcharr_active_streams` with `type="live"` and `type="vod"` labels
- `type` label added to `dispatcharr_stream_fps`, `dispatcharr_stream_video_bitrate_bps`, `dispatcharr_stream_transcode_bitrate_bps`, `dispatcharr_stream_current_bitrate_bps`, `dispatcharr_stream_channel_number`, `dispatcharr_stream_index`, and `dispatcharr_stream_available_streams`
- `user_id` and `username` labels on `dispatcharr_client_info`
- Manual stop flag - stopping the server now prevents auto-start from restarting it until explicitly started again

### Changed
- Minimum Dispatcharr version raised to v0.22.0
- "Start Server" and "Restart Server" action buttons merged into a single "Start / Restart Metrics Server" button

### Removed
- Legacy metrics (`dispatcharr_stream_info`, legacy `dispatcharr_m3u_account_info` with `stream_count` label, legacy `dispatcharr_epg_source_info` with `priority` label) and the `Include Legacy Metric Formats` setting
- `Disable Update Notifications` setting and the `Check for Updates` action button
