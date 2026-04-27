## [Unreleased]

### Added
- CIDR notation support for media server identifiers - specify a subnet (e.g. `10.0.0.0/24`) to match any client IP within that range, useful for clustered or multi-address setups

### Fixed
- Leading and trailing whitespace in IP and username inputs is now stripped before matching, preventing missed connections from accidental spaces in configuration
