**game-thumbs v2.2.0**

- Added Little League Baseball support
- New `mode: "name"` option lets leagues render team names as text
  instead of logos, useful for leagues without good logo art
- New `teamColors` option for assigning consistent per-team colors in
  leagues that don't have per-team color data
- Fixed 403 errors on some publicly hosted instances
- Fixed a crash that could happen under heavy load on tennis logo
  requests
- Fixed stale MLB All-Star team data and tennis logo issues
