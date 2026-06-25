## [Unreleased]

### Added

- Intel QSV (`h264_qsv`) and VAAPI (`h264_vaapi`) hardware encoder options alongside the existing NVENC option. GPU device is auto-detected from `/dev/dri` with no manual configuration required.
- EPG forward mode now emits all programme metadata from Dispatcharr's EPG data: categories, episode numbers (xmltv_ns, onscreen, and external IDs), ratings, poster icons, live/premiere/new flags, runtime, country, language, and more. Previously only title, subtitle, and description were forwarded.
- EPG forward mode appends the layout's channel list to each programme description.
- Dynamic Warnings section in plugin settings that surfaces common configuration issues: missing PyAV installation, audio copy stream profile that will silently drop multi-track audio, and software encoding (`libx264`) with 4+ streams.

### Fixed

- Audio desync after channel reconnects and live_proxy fallback resets.
- Audio track language codes for channels with mixed-case multi-word names (e.g. "Rogers TV" was producing an incorrect language tag).
- Reduced startup log noise: port race condition demoted to INFO level; warmup retry added for initial channel connections to reduce false error messages.
