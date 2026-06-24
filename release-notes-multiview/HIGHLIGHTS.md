**v0.2.1**

- NVIDIA NVENC hardware encoding is back - select it in plugin settings (requires NVIDIA GPU + driver) (More hardware support coming later)
- Channel reconnects now use exponential backoff (up to 60s) and give up cleanly after ~8 minutes of failures instead of retrying forever
- Logos now load in the background (no startup delay), preserve aspect ratio, and render transparency correctly
- Logos can now load from HTTP URLs, not just local file paths
- Keepalive connection keeps channels warm in Dispatcharr between viewer connections, reducing cold-start delays
- Fixed file descriptor leaks on worker shutdown
- Fixed 503 response when a channel is not yet ready (was 200 with empty body, causing confusing errors)
