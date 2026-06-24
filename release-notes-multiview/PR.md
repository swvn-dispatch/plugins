Rebuild compositor on PyAV, fix A/V sync and CBR encoding (v0.2.0)

The streaming core is rebuilt on a PyAV-based worker process that decodes each tile in its own thread and composites frames onto a shared canvas. CBR encoding with a PTS rate limiter fixes fast-forward playback on fast machines and on low-motion/logo content. A/V sync is corrected at startup and on reconnect. PyAV is installed on demand from the plugin settings page. Hardware encoders (NVENC/QSV/VA-API) are temporarily removed and will return in a later update. Requires Dispatcharr v0.27.0+.
