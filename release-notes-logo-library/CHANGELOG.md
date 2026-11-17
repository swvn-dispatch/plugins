## [Unreleased]

### Added

- Configure ordered prefix, suffix, or regex cleanup rules for channel names before Auto Match. The first matching rule applies; existing prefix settings are preserved.
- Create blank manual mapping rows for skipped and failed channels from the latest Auto Match. Existing mappings are preserved; blank rows block Auto Match until completed or removed.

### Changed

- Improve TV Logos matching across more regions, including local station call signs, generic network fallbacks, and numbered channel names.
- Refresh available choices after catalog updates and refresh settings after bulk mapping or ignore actions.
- Clarify advanced Auto Match settings and show cleanup rules in Auto Match results.

### Fixed

- Include catalog filters in Manual Match results.
