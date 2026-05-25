## [v1.2.0] - 2026-05-15

### Fixed

- Jellyfin DVR recording sessions were incorrectly flagged as orphans and terminated. The plugin now detects in-progress Jellyfin recordings via `LiveTv/Timers?IsActive=true` and reads the channel number from `ProgramInfo.ChannelNumber`, since Jellyfin does not populate `LiveTv/Recordings` for active recordings the way Emby does.
