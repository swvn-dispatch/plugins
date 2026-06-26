## [2.0.0] - Unreleased

### Added

- Badge overlays via `badge=` parameter (ALT, 4K, HD, FHD, UHD) on `/logo`, `/thumb`, and `/cover` for matchup, league, and single-team routes
- Athlete support via ESPN Athlete provider for tennis and MMA; doubles and team composites use the `+` separator (e.g. `sinner+medvedev`)
- Adaptive request queue to rate-limit and pace external API calls during startup
- NCAA sports provider
- Image styles 5 and 6 (grid layout) for thumbnails, covers, and logos
- Style 98 (3D embossed) for thumbnails, covers, and logos
- Custom team support via `teams.json`: define teams not in any provider, bypassing provider lookups entirely
- `winner=` parameter on `/logo`, `/thumb`, and `/cover`: highlights the winning team in color and renders the losing team in greyscale
- Generic event overlay parameters `title=`, `subtitle=`, and `iconurl=` for generating non-matchup league images (requires `ALLOW_EVENT_OVERLAYS=true`)
- Custom font registry; Saira Stencil bundled as the default title/subtitle font
- Filesystem-backed image caching with configurable path (replaces in-memory cache)
- `ROOT_REDIRECT_URL` environment variable to redirect the root path to a documentation site
- Boxing support via TheSportsDB athlete provider (`box` key)
- SVG league logo support, fixing leagues such as MiLB where logos are SVG-only
- Opt-in SOCKS5 proxy for HockeyTech requests via `SOCKS_PROXY`, `HOCKEYTECH_PROXY_EXTRACT`, and `HOCKEYTECH_PROXY_FEED` environment variables
- New leagues and sports:
  - IIHF
  - Unrivaled Basketball (UBL)
  - Scottish Premiership and domestic cup competitions; additional EFL Cup variants
  - Junior hockey expansions
  - US Open Cup, USL Championship
  - KBO (Korean Baseball Organization)
  - MiLB (Triple-A, Double-A, High-A, Single-A), Winter Leagues, and Independent Leagues via MLBStats provider
  - Canadian Baseball League (CBL) via Supabase provider
  - 10 rugby leagues: NRL, Top 14, Super Rugby Pacific (#131 by @lpukatch), The Rugby Championship, European Rugby Champions Cup, Currie Cup, National Provincial Championship, URBA Primera A, International Test Match, British & Irish Lions Tour
  - Boxing
- ESPN added as an additional data source for 7 existing rugby leagues: Six Nations, English Premiership, United Rugby Championship, European Rugby Challenge Cup, Rugby World Cup, Women's Rugby World Cup, Major League Rugby
- League logos for NRL, The Rugby Championship, Super Rugby Pacific, Top 14, European Rugby Champions Cup, Currie Cup, National Provincial Championship, URBA Primera A, British & Irish Lions, World Rugby/ITM, and Canadian Baseball League are now bundled as static assets

### Changed

- English Premiership league key renamed from `epr` to `prem`
- European Rugby Challenge Cup league key renamed from `ercc` to `epcr`
- AHL switched to HockeyTech as its data source
- Missing team fallback in matchup images now shows a greyscale league logo placeholder instead of the full league image
- Style 1 logo redesigned with a compact thumbnail layout

### Fixed

- WHL, OHL, and QMJHL team resolution now uses pinned HockeyTech client codes instead of scraping chl.ca
- Regular-weight custom league fonts now apply correctly in event overlays
- Single team logo contrast corrected for style 1
- Consecutive slash URL paths now collapse correctly
- HockeyTech provider now skips playoff bracket seasons with TBD teams when resolving roster data
- Country flag matching improved to prevent false positives on short or generic country names
- Various rugby and CBL league logos bundled locally, eliminating intermittent Wikimedia 429 errors

### Removed

- `/xcproxy` route removed
