**v2.0.0**

- Athlete thumbnails for tennis, MMA, and boxing - use the `+` separator for doubles
- Badge overlays (`badge=ALT`, `badge=4K`, `badge=HD`, etc.) on all image types and all route variants
- New image styles: styles 5 and 6 (grid layout), style 98 (3D embossed)
- `winner=` parameter renders the winning team in color and the losing team in greyscale
- Generic event overlays (`title=`, `subtitle=`, `iconurl=`) for non-matchup league images
- Custom font registry with Saira Stencil as the default; bring your own fonts per league
- Persistent disk-based image cache (replaces in-memory)
- Custom team support via `teams.json` for teams not in any provider
- 10 new rugby leagues including NRL, Top 14, Super Rugby Pacific, and British & Irish Lions Tour
- KBO, all four MiLB levels, Winter Leagues, and Independent Leagues via MLBStats
- Canadian Baseball League, IIHF, Unrivaled Basketball, US Open Cup, USL Championship
- AHL now uses HockeyTech; WHL/OHL/QMJHL team resolution fixed
- English Premiership key is now `prem`; European Rugby Challenge Cup key is now `epcr`
- SVG league logos supported (fixes MiLB and others)
- Opt-in SOCKS5 proxy for HockeyTech requests
- League logos for NRL, rugby competitions, and CBL bundled locally - no more Wikimedia 429 errors

If this has saved you some headaches, tips are appreciated: https://ko-fi.com/sethwv
