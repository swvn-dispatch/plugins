## [Unreleased]

### Added
- Catch-up (timeshift) streams now show up alongside live and VOD everywhere: `dispatcharr_active_streams{type="timeshift"}`, `dispatcharr_stream_metadata`, `dispatcharr_stream_active_clients`, `dispatcharr_stream_uptime_seconds`, `dispatcharr_stream_avg_bitrate_bps`, and per-viewer `dispatcharr_client_*` connection metrics (client stats setting).
- Catch-up sessions report EPG program info just like live TV, anchored to the position being watched rather than real time; the current program title is prefixed `Catchup-MM-DD-HH:MM:` to distinguish it from a live view.
- Active M3U provider and profile (`provider`, `provider_type`, `profile_id`, `profile_name`) and connection limits are now reported for catch-up streams, matching live.
- New per-channel info metrics (`dispatcharr_channel_info`, `dispatcharr_channel_source_count`, `dispatcharr_channel_catchup_days`) covering channel group, source/stream count, and catch-up configuration, behind a new "Include Channel Info Statistics" setting.
- New plugin health metrics (`dispatcharr_plugins`, `dispatcharr_plugin_info`, `dispatcharr_plugin_repos`, `dispatcharr_plugin_repo_info`, `dispatcharr_plugin_repo_last_fetch_timestamp`) behind a new "Include Plugin Statistics" setting.

### Fixed
- The metrics server now releases its database connection after every scrape. Previously it could leave connections open indefinitely, which under sustained load could exhaust the database's connection limit and make Dispatcharr unresponsive.
