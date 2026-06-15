## [Unreleased]

### Added

- Canadian Baseball League (CBL) support via a new Supabase provider that auto-discovers API credentials from the league website's JS bundle
- 10 new rugby leagues: NRL, Top 14, Super Rugby Pacific (#131 by @lpukatch), The Rugby Championship, European Rugby Champions Cup, Currie Cup, National Provincial Championship, URBA Primera A, International Test Match, British and Irish Lions Tour
- ESPN as an additional data source for seven existing rugby leagues: Six Nations, English Premiership, United Rugby Championship, European Rugby Challenge Cup, Rugby World Cup, Women's Rugby World Cup, Major League Rugby

### Changed

- English Premiership Rugby league key renamed from `epr` to `prem`
- European Rugby Challenge Cup league key renamed from `ercc` to `epcr`

### Fixed

- Requests with consecutive slashes in the URL path (e.g. `nfl//logo`) now return a 444 error instead of matching unknown routes
- Team cover logos using SVG URLs now render correctly
- Logo map lookups now use the correct ALL_CAPS key structure, improving reliability across leagues

