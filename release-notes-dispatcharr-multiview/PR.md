Add configurable render device override for QSV/VAAPI

Adds a Render Device setting for the QSV and VAAPI hardware encoders so users can pin encoding to a specific `/dev/dri/render*` node. The default, Auto, preserves the existing behavior of selecting the first detected node. On hosts with multiple render nodes (common in VMs and containers), the first node can be the wrong GPU, so this lets the user override it. The available nodes are globbed on the host when the field is built, so the real options appear in both the native Dispatcharr settings page and the web dashboard.
