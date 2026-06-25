Add QSV/VAAPI hardware encode, full EPG forwarding, and settings warnings (v0.2.3)

Adds Intel QSV and VAAPI hardware encoder support alongside the existing NVENC option, with GPU device auto-detected from `/dev/dri`. EPG forward mode now passes through all programme metadata stored in Dispatcharr's EPG data rather than only title, subtitle, and description. A dynamic Warnings section in plugin settings surfaces common configuration problems. Also fixes audio desync after reconnects, language code generation for multi-word channel names, and startup log noise.
