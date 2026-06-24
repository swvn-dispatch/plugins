## [Unreleased] - v0.2.0

### Added
- PyAV compositor worker: decoding, compositing, and encoding now run in a dedicated subprocess using PyAV (Python FFmpeg bindings). Each tile decodes in its own thread; the compositor blits the latest frame per tile onto a shared canvas and encodes it continuously. A slow or disconnected channel never stalls the grid.
- "Install PyAV" actions in plugin settings to download and install the PyAV media dependency at runtime, for both amd64/x86_64 and arm64/aarch64 hosts. Internet access is required for the one-time install.
- PyAV installation status indicator in plugin settings showing whether the media engine is installed and ready for this host's architecture.
- Configurable output frame rate: 24, 25, 30, 50, or 60 fps (default 30).
- CBR (constant bitrate) encoding: output bitrate is now a true constant-rate target, not a ceiling. The encoder pads with filler NAL units so the data rate stays flat regardless of content complexity, preventing IPTV player buffer drain and fast-forward on low-motion content.
- PTS rate limiter: the compositor paces output to 1x realtime using PTS timestamps, preventing fast-forward playback on fast machines where Dispatcharr's live proxy delivers frames faster than realtime.

### Changed
- Minimum required Dispatcharr version raised from v0.22.0 to v0.27.0.
- M3U and EPG refresh after "Regenerate M3U" are now serialized (M3U first, then EPG) using a Celery task chain. Previously both tasks fired simultaneously, which caused a Dispatcharr DB collision.
- Output bitrate field label changed from "Max Output Bitrate" to "Output Bitrate" to reflect CBR behaviour.

### Fixed
- A/V sync: audio is now PTS-aligned to video at stream startup. The audio buffer is also flushed on channel reconnect, preventing audio lag from accumulating.
- M3U + EPG simultaneous refresh could cause "INSERT 0 N" DB errors in Dispatcharr when both tasks hit the shared celery connection at the same time.

### Removed
- Hardware encoder options (NVIDIA h264_nvenc, Intel QuickSync h264_qsv, AMD/Intel VA-API h264_vaapi) are temporarily removed while the compositor is rebuilt on PyAV. Only libx264 (software) is available in this release. Hardware encoders will return as an opt-in mode in a future update.
- CRF/CQ quality mode removed. Encoding is CBR-only in this release.
