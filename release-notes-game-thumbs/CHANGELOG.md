## [2.1.0] - Unreleased

### Added

- Pseudo-team resolution via ESPN's All-Star group discovery, enabling leagues with permanent conference/All-Star teams (e.g. MLB's AL/NL, NFL's AFC/NFC Pro Bowl) to resolve those teams without per-league configuration

### Fixed

- Team color cache is now scoped per league, preventing a cached color from one league's team from being applied to a different league's team that happens to share the same ESPN team ID
