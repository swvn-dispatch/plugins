## [Unreleased]

### Added

- Schedule Auto Match and catalog refresh independently using hourly intervals or UTC cron expressions. Both schedules are disabled by default.
- Choose a preference for HD logo variants when matching.
- Show candidate logos for ambiguous and below-threshold Auto Match results, including similarity scores for fuzzy matches.

### Changed

- Prefer standard logo variants and allow generic network logos for unmatched stations by default. Both settings can be changed in advanced options.
- Group downloadable Auto Match results into successful, skipped, and failed channels, sorted by channel number. This changes the `channels` field from a list to an object in new reports.

### Fixed

- Prefer HD logos with fewer additional variant attributes when multiple HD variants are available.
- Display automatic assignment group guidance as separate, readable lines.
