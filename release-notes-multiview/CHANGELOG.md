## [Unreleased]

### Fixed

- Selecting the same channel in more than one slot of a layout with EPG forwarding enabled could crash both the plugin's settings page and the web dashboard with a "Duplicate options" error.
- The plugin's dashboard server could leak database connections over time, eventually causing the dashboard (and sometimes the plugin's settings page) to stop responding until Dispatcharr was restarted.
- Auto Grid layout: content in stacked rows no longer doubles up its letterboxing gap at the seam between rows. Mismatched-aspect-ratio video now collects its padding at the outer top and bottom edges instead of gapping where the rows meet.
