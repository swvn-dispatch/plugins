## [2.0.0] - Unreleased

### Added

- Boxing support: athlete thumbnails via TheSportsDB provider (`box` alias supported)
- `badge=` parameter now works on league and single-team routes for `/thumb`, `/cover`, and `/logo` (previously only available on matchup routes)
- SVG league logos now supported, fixing leagues like MiLB where logos are SVG-only
- Opt-in SOCKS5 proxy for HockeyTech requests via `SOCKS_PROXY`, `HOCKEYTECH_PROXY_EXTRACT`, and `HOCKEYTECH_PROXY_FEED` environment variables
- League logos for NRL, The Rugby Championship, Super Rugby Pacific, Top 14, European Rugby Champions Cup, Currie Cup, National Provincial Championship, URBA Primera A, British & Irish Lions, World Rugby/ITM, and Canadian Baseball League are now bundled as static assets, eliminating intermittent 429 errors from Wikimedia

### Fixed

- WHL, OHL, and QMJHL team resolution now uses pinned HockeyTech client codes instead of scraping chl.ca, which was unreliable
- Regular-weight custom league fonts now apply correctly in event overlays
- Single team logo contrast corrected for style 1
- Double-slash URL paths now collapse correctly

### Removed

- `/xcproxy` route removed
