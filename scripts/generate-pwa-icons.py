#!/usr/bin/env python3
"""Generate a plugin dashboard's PWA icons from its source logo.

Standardizes what force-fallback and multiview were already doing by hand:
the favicon (`logo.png`) keeps the source's transparency as-is, but the PWA
install icons (`icon-192.png`, `icon-512.png`) get the logo flattened onto
an opaque background color first -- a transparent PNG left as-is for those
looks broken once the OS applies its own icon mask/crop (mobile home
screens, taskbars, etc. don't render transparency the way a browser tab
favicon does).

No safe-zone/maskable padding is added -- matching the existing icons in
force-fallback/multiview exactly (both fill the full canvas edge-to-edge),
not "fixing" them to be more purist-PWA-maskable-compliant.

Usage:
    python3 scripts/generate-pwa-icons.py <source-logo.png> <dest-public-dir> [--bg '#1a1b1e'] [--scale 1.0]

Example (from repo root):
    python3 scripts/generate-pwa-icons.py \\
        ../emby-stream-cleanup/src/logo.png \\
        ../emby-stream-cleanup/src/dash/ui/public

--scale shrinks the logo within the icon canvas (1.0 = logo's own natural
size, no extra shrink -- this is what force-fallback/multiview's existing
icons use). Lower it (e.g. 0.75) if a given source logo's artwork reads as
visually heavier/bulkier than the others at the same bounding-box size and
needs more background breathing room to match. Doesn't affect the favicon
(logo.png), only the flattened icon-192/512 files.

Requires Pillow (``pip install pillow``).
"""

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("error: Pillow is required — pip install pillow", file=sys.stderr)
    sys.exit(1)

# Matches @swvn-dispatch/dispatch-ui-kit's theme.js BACKGROUND_COLOR constant.
# Keep these in sync by hand if the kit's brand colors ever change.
DEFAULT_BG = "#1a1b1e"
ICON_SIZES = (192, 512)


def generate(source: Path, dest_dir: Path, bg: str, scale: float) -> None:
    if not source.is_file():
        print(f"error: source logo not found: {source}", file=sys.stderr)
        sys.exit(1)
    dest_dir.mkdir(parents=True, exist_ok=True)

    logo = Image.open(source).convert("RGBA")

    # 1. Favicon: copy the source as-is, transparency preserved, unaffected by --scale.
    logo.save(dest_dir / "logo.png")

    # 2. PWA install icons: flatten onto the background color.
    background = Image.new("RGBA", logo.size, bg)

    if scale < 1.0:
        # Shrink the logo and center it on a full-size transparent canvas
        # before flattening, so the background shows through as a border.
        w, h = logo.size
        shrunk = logo.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
        canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        canvas.paste(shrunk, ((w - shrunk.width) // 2, (h - shrunk.height) // 2), shrunk)
        logo_for_icons = canvas
    else:
        logo_for_icons = logo

    flattened = Image.alpha_composite(background, logo_for_icons).convert("RGB")

    for size in ICON_SIZES:
        resized = flattened.resize((size, size), Image.LANCZOS)
        out_path = dest_dir / f"icon-{size}.png"
        resized.save(out_path)
        print(f"wrote {out_path} ({size}x{size}, flattened on {bg}, scale={scale})")

    print(f"wrote {dest_dir / 'logo.png'} ({logo.size[0]}x{logo.size[1]}, transparent)")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("source", type=Path, help="Path to the source logo (transparent PNG)")
    parser.add_argument("dest_dir", type=Path, help="Plugin's dash/ui/public/ directory")
    parser.add_argument("--bg", default=DEFAULT_BG, help=f"Background color for icon flattening (default: {DEFAULT_BG})")
    parser.add_argument("--scale", type=float, default=1.0, help="Shrink factor for the logo within the icon canvas (default: 1.0, no extra shrink)")
    args = parser.parse_args()
    generate(args.source, args.dest_dir, args.bg, args.scale)


if __name__ == "__main__":
    main()
