## [Unreleased]

### Added
- New `llb` (Little League Baseball) league.
- `mode` leagues.json field (and matching `?mode=` query param): set to
  `"name"` to render each team's name as text instead of its logo, on
  matchup and single-team thumb/cover/logo endpoints.
- `teamColors` leagues.json field: an optional hex color palette that
  deterministically assigns each team a stable color/alternate color,
  for leagues where every team otherwise shares the same provider color.

### Changed
- ATP and WTA league logos now use bundled local assets instead of
  remote thesportsdb URLs.

### Fixed
- Fixed requests failing with 403 errors on public/VPS-hosted instances
  due to ESPN's Akamai WAF blocking browser-style User-Agent strings
  from datacenter IPs (#149).
- Fixed MLB All-Star team resolution failing due to stale cached team
  data after a data shape change.
- Fixed ESPN all-star pseudo-team resolution for MLS and Liga MX.
- Fixed a crash ("JavaScript heap out of memory") that could occur
  under concurrent requests to tennis/athlete-based logo routes,
  caused by repeatedly re-parsing the full ESPN roster cache from disk
  on every request (#141).
