## [Unreleased]

### Added

- Added automatic GPU tile composition for NVENC, QSV, and VAAPI encoders when the installed FFmpeg and GPU support it. Streams fall back to CPU composition when unavailable.
- Added regex channel ordering by channel number, reverse channel number, or the order of top-level regex alternatives.

### Changed

- Layout reordering now immediately regenerates the M3U playlist so channel numbers follow the dashboard order.
- Regex channel patterns now use a multi-line editor that wraps long expressions.

### Fixed

- Improved audio and video synchronization, including recovery when audio timestamp gating would otherwise remain silent.
- Improved video cadence for sources with frame rates that differ from the output frame rate.
- Restored automatic PyAV installation on Python 3.13.
