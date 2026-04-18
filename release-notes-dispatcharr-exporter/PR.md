v3.0.0: User metrics, expanded type labels, legacy metric removal

Adds opt-in user metrics (info, stream limits, active streams), a dedicated M3U account info gauge, and `type` labels to additional stream metrics for consistent filtering. Client metrics now carry `user_id` and `username` labels. Removes all legacy metric formats and the update-check action. The manual stop flag now prevents auto-start from overriding a deliberate stop. Minimum Dispatcharr version raised to v0.22.0.
