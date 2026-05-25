fix: detect in-progress Jellyfin recordings via LiveTv/Timers

Jellyfin does not populate LiveTv/Recordings for active recordings, so the existing Emby-style check always returned empty results. Jellyfin in-progress recordings are now detected via LiveTv/Timers?IsActive=true, with the channel number read from ProgramInfo.ChannelNumber on each timer. Emby continues to use LiveTv/Recordings as before. Without this fix, any channel being recorded by Jellyfin DVR had no session in the media server pool and was terminated as an orphan.
