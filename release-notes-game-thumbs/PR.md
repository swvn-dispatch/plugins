Release v2.0.0: boxing support, badge= on all routes, bundled league logos, HockeyTech fixes

Adds boxing via TheSportsDB athlete provider, extends `badge=` to league and single-team routes (previously matchup-only), enables SVG league logos, bundles 11 league logos locally to fix Wikimedia 429 errors, fixes WHL/OHL/QMJHL team resolution by switching to pinned HockeyTech client codes, fixes Regular-weight custom font rendering in event overlays, adds opt-in SOCKS5 proxy support for HockeyTech, and removes the `/xcproxy` route.
