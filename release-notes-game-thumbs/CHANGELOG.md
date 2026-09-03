## [Unreleased]

### Added
- Stadium-background matchup styles 10 through 13, with venue details and optional team records (#144 by @dexdeadly).
- Eredivisie, Eerste Divisie, and Greater Ontario Hockey League support.
- NASCAR Cup and NASCAR Cup Series league aliases.
- Opt-in Prometheus metrics at `/metrics` when `METRICS_ENABLED=true`.
- Built-in Teamarr league overlays, including configured light and dark league artwork.

### Changed
- Updated UEFA Europa Conference League resolution to use ESPN's current slug and added `UECL` aliases (#151 by @DatGuy1).

### Fixed
- Removed detected white backgrounds from team and league logos across image endpoints. Set `DISABLE_LOGO_BACKGROUND_REMOVAL=true` to disable this processing.
- Resolved AFL club names that include a trailing `Football Club` suffix.
