## [Unreleased]

### Added

- Render Device setting for QSV and VAAPI encoders. Auto (the default) keeps the current behavior of using the first detected `/dev/dri/render*` node. On systems with more than one GPU, you can now pin a specific render node so encoding runs on the intended device. Available options are populated from the render nodes detected on the host and appear in both the native Dispatcharr settings page and the web dashboard.
