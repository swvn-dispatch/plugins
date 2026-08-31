Fix multiview video cadence, EPG cleanup, and audio timing

Times each multiview tile to its source video so mixed frame rates play smoothly, retains MPEG-2 B-frames to preserve source cadence, clears EPG data for retired layouts during refreshes, and corrects audio buffer timestamps used for A/V synchronization.
