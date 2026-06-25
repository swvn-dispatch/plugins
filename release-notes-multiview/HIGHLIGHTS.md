**Dispatcharr Multiview v0.2.3**

- **Intel hardware encoding** - QSV and VAAPI encoder options are now available alongside NVENC. GPU device is auto-detected; no configuration needed.
- **Full EPG forwarding** - Forward mode now passes through all programme metadata: categories, series/episode info, ratings, poster artwork, and live/premiere/new badges. Previously only title and description came through.
- **Settings warnings** - The plugin settings page now shows alerts for common problems: PyAV not installed, audio copy stream profile that drops multi-track audio, and software encoding with 4+ streams.
- **Audio desync fix** - Fixed audio falling out of sync after a channel reconnect or live_proxy fallback.
- **Language code fix** - Fixed incorrect audio track language codes for channels with multi-word names (e.g. "Rogers TV").
