**v3.1.0 highlights:**
- Catch-up/timeshift streams are now fully tracked alongside live and VOD, including active stream counts, client connections, bitrate, and EPG program info (with a "Catchup-" tag so you can tell it apart from live).
- New per-channel metrics: source/stream count, channel group, and catch-up config.
- New plugin health metrics: installed plugins and repo status.
- Fixed a bug where the metrics server could leave database connections open and eventually make Dispatcharr unresponsive under load.
