## [0.2.1] - 2026-06-24

### Added
- NVIDIA NVENC hardware encoding (`h264_nvenc`) as an optional encoder, selectable in plugin settings. Requires an NVIDIA GPU with driver support. Startup exits with a clear error if NVENC is selected but unavailable.
- Encoder preset selection for NVENC (p1-p7, default p4 balanced).
- Channel logos now load from HTTP URLs in addition to local file paths.
- Keepalive client: multiview registers a background connection with Dispatcharr's live_proxy so channels stay warm between viewer connections, preventing cold-start delays on reconnect.
- RSS memory usage logged in the worker heartbeat alongside per-channel frame rates. (Log level will be changed in a later release)

### Changed
- Channel reconnect now uses exponential backoff (2s, 4s, 8s... up to 60s) instead of a fixed 2s delay. Channels give up after 12 consecutive failures (roughly 8 minutes total).
- Logo rendering preserves aspect ratio and correctly composites transparency over black. Previously logos were cropped to a square and transparent areas were not handled.
- Logo loading moved to a background thread so startup is not blocked waiting for logo decode.

### Fixed
- Server returns 503 when a channel's live_proxy is not yet ready, instead of 200 with an empty body. This lets the compositor worker retry cleanly via its backoff rather than failing with a cryptic "Invalid data found" error.
- Audio resampler, audio write pipe FDs, and encoder output pipe FD are now properly closed on worker shutdown, eliminating file descriptor leaks.
