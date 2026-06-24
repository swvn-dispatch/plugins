**v0.2.0 - Compositor rebuild**

- Streaming core rebuilt on PyAV: each tile decodes in its own thread; a slow or disconnected channel no longer stalls the rest of the grid
- Install PyAV from the plugin settings page (one-time, needs internet); both amd64 and arm64 hosts supported
- CBR encoding keeps bitrate constant regardless of content - fixes fast-forward on IPTV players caused by near-zero bitrate on static or logo content
- A/V sync fixed: audio is PTS-aligned at startup and flushed on reconnect
- Configurable output frame rate (24/25/30/50/60 fps)
- Requires Dispatcharr v0.27.0+
- Note: hardware encoding (NVENC/QSV/VA-API) is temporarily unavailable while the compositor is rebuilt; it will return in a future update
