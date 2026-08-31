## [Unreleased]

### Fixed

- Reduced microstutter in layouts that combine channels with different frame rates by timing each tile to its source video.
- Preserved broadcast MPEG-2 B-frames so tiles keep their intended source cadence.
- Removed stale EPG entries for deleted or legacy layouts when refreshing programme data.
- Corrected audio buffer timestamps to improve audio and video synchronization.
