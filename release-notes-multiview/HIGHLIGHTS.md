**v0.3.0**

- **Web dashboard** - A mobile-friendly PWA at `http://<host>:9292/dash/` for editing settings and managing active streams (reload a layout, reconnect a channel, refresh M3U/EPG) without the Dispatcharr admin UI. Off by default, enable it in plugin settings.
- **PyAV auto-reinstall** - After you install PyAV once, the plugin automatically reinstalls it in the background if it ever goes missing, no more repeated manual clicks.
- **Timeout warning** - Settings page now warns if Dispatcharr's Channel Initialization Timeout is set too low, which can cause tiles to fail on startup.
- **Featured layout gap fix** - Closed the seam gap between stacked side tiles, without cropping content.
- **Audio drift fix** - Resyncs audio on unstable streams.
- **Settings reorganized** - Global settings (dashboard, refresh interval, layout count) now grouped above video settings.
