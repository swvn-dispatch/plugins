## [Unreleased]

### Fixed
- Channels with an active in-progress DVR recording are now protected from pool-absent termination. The recording backend connects to Dispatcharr as a client but does not appear as a regular playback session, so previously its channel would be considered absent from the pool and stopped. The plugin now queries each media server for in-progress recordings and adds those channels to the pool before evaluating termination candidates.

### Changed
- The dashboard now shows recording sessions alongside live sessions in the media server pool count, with per-server breakdowns indicating live vs. DVR counts. Channel cards display a DVR badge when an active recording is in progress on that channel.
