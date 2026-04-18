## [Unreleased] - v1.0.0

### Added
- Automatic detection and termination of idle Emby/Jellyfin connections in Dispatcharr
- Orphan detection - terminates connections whose channel is no longer in the media server's active session pool
- Support for multiple Emby/Jellyfin media servers with independent URL, API key, and client identifier settings
- Configurable timeout (default 30s) and poll interval (default 10s)
- Automatic timer pause during stream failover and buffering
- Client identifier matching by IP address, hostname (auto-resolved), or XC username, with comma-separated multi-value support
- Duplicate identifier detection across servers with logged warnings
- Optional HTTP debug dashboard showing active channels, matched clients, media server pool status, and recent terminations
- Plugin actions: Restart Monitor, Check Status, Reset All Settings
