**Dispatcharr Multiview v0.4.0**

- **Style Builder** - a new visual, drag-and-drop editor for building your own custom multiview layouts, right alongside the built-in Auto Grid and Featured options. Add static tiles or dynamic rows/grids, set a background image, and preview live as you go.
- **Drag-to-reorder layouts** and a **backup/restore** button (export/import all your layouts and settings as a JSON file) in the dashboard.
- **Configurable dashboard path** - change where the dashboard is served from without restarting.
- **Stay logged in** - the dashboard now remembers your username and refreshes your session silently, so you don't get kicked back to the login screen.
- **Searchable channel picker** in the dashboard.
- Plugin and Dispatcharr versions now shown in the dashboard header.
- **Safer reordering** - layouts now keep their own stream identity, so reordering or deleting one no longer swaps what a viewer is watching on reconnect. Note: stream/EPG IDs changed format as part of this, so after updating your existing multiview channels will likely be re-created in Dispatcharr on the next M3U/EPG refresh. Double-check channel numbering, groups, and any manual EPG mapping afterward.
- Fixed a bug where a mismatch between the settings page and dashboard could delete existing multiviews.
- Fixed audio drift on unstable streams, small tile-gap rendering glitches, and Style Builder guide-line/aspect-lock quirks.
- M3U refresh no longer gets silently skipped when an EPG refresh fails.
