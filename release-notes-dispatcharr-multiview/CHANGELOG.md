## [Unreleased]

### Added

- Added a 4K (3840x2160) output resolution preset.
- Added optional automatic reloads for active multiviews when matching channels or stream settings change. Reloads briefly interrupt playback.
- Added a plugin settings button to reload all active multiviews.
- Added a setting to enable or disable generated audio track labels.

### Fixed

- Improved tile recovery when sources stall, switch formats, reconnect, or experience timestamp jumps, while keeping unaffected tiles playing.
- Improved live playback recovery when a tile falls behind the available stream buffer.
- Improved audio synchronization with the video being displayed, including after source recovery.
