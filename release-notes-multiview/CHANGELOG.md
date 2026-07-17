## [0.4.0]

### Added

- Style Builder: a visual, drag-and-drop editor for creating custom multiview layouts, selectable alongside the built-in Auto Grid and Featured layouts. Supports static tiles, dynamic rows/grids with per-element caps, and live preview.
- Background images for custom layouts, shown through any gaps or letterboxing left by the layout.
- Drag-to-reorder layouts in the dashboard.
- Backup and restore: export all layouts and settings to a JSON file, and re-import them (including from an older backup format).
- Configurable dashboard mount path (default `/dash`), changeable without a restart.
- Plugin and Dispatcharr version shown in the dashboard header.
- "Remember me" username and silent session refresh, so the dashboard stays logged in without re-entering credentials.
- Searchable channel select in the dashboard's channel pickers.
- Dashboard logo links to the project repo and Ko-fi support page.

### Changed

- Layouts now use stable internal IDs instead of position numbers, so reordering or deleting a layout no longer changes another layout's stream URL or causes a viewer's stream to swap on reconnect. As part of this, the M3U `tvg-id`, stream URL, and EPG channel id format changed from `multiview_N` / `/stream/N` to `mv-<id>` / `/stream/<id>`. Existing multiview channels in Dispatcharr will likely be re-created (not renamed) on the next M3U/EPG refresh, so re-check channel numbering, groups, and any manual EPG mapping afterward.
- M3U refresh no longer silently skips when EPG refresh fails; it now always runs once EPG finishes.

### Fixed

- Layout count desync between the native settings page and the dashboard that could break "Add Layout" or delete existing multiviews.
- Audio desync on unstable streams now resyncs automatically.
- 1-2px gaps between touching tiles in Auto Row layouts on non-round coordinates.
- Gaps at the seam between stacked side tiles in the Featured layout.
- Style Builder guide-line placement for centered/aligned Auto Row blocks.
- Style Builder aspect-ratio lock now uses pixel-space ratio instead of raw fractions, so resizing no longer snaps to square and typing Width/Height while locked updates the other field correctly.
