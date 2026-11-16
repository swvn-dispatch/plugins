#!/usr/bin/env python3
"""Stage an external release and validate SARIF paths for pluginctl."""

import json
import shutil
import sys
from pathlib import Path


def stage(extracted: Path, catalog: Path, root: Path, slug: str) -> None:
    if not slug or any(c not in "abcdefghijklmnopqrstuvwxyz0123456789-" for c in slug):
        raise ValueError("Invalid plugin slug")
    manifest = extracted / "plugin.json"
    if any(path.is_symlink() for path in extracted.rglob("*")):
        raise ValueError("Release ZIP must not contain symbolic links")
    destination = root / "plugins" / slug
    destination.mkdir(parents=True, exist_ok=False)
    shutil.copytree(extracted, destination, dirs_exist_ok=True)
    if manifest.is_file():
        shutil.copyfile(manifest, destination / ".dispatcharr-runtime-manifest.json")
    shutil.copyfile(catalog, destination / "plugin.json")


def check_sarif(directory: Path, slug: str, found: str, outcome: str) -> None:
    # Import the same trusted parser and rule identifiers used for classification.
    from pluginctl.validate import sarif

    files = list(directory.glob("*.sarif")) + list(directory.glob("*.sarif.gz"))
    if found == "true" and outcome == "success" and not files:
        raise ValueError("CodeQL reported success but produced no SARIF files")
    for obj in sarif.load_sarif_dir(str(directory)):
        for run in obj.get("runs", []):
            for result in run.get("results") or []:
                rule = sarif._rule_id(result)
                if sarif.is_sandbox_bypass_rule(rule) or sarif.is_capability_contract_rule(rule):
                    uri, _ = sarif._location(result)
                    if not uri.startswith(f"plugins/{slug}/"):
                        raise ValueError(f"Custom finding has an unresolvable plugin URI: {uri}")


def main() -> None:
    if len(sys.argv) == 6 and sys.argv[1] == "stage":
        stage(Path(sys.argv[2]), Path(sys.argv[3]), Path(sys.argv[4]), sys.argv[5])
    elif len(sys.argv) == 6 and sys.argv[1] == "check-sarif":
        check_sarif(Path(sys.argv[2]), sys.argv[3], sys.argv[4], sys.argv[5])
    else:
        raise SystemExit("Usage: codeql_preflight.py stage EXTRACTED CATALOG ROOT SLUG | check-sarif DIRECTORY SLUG FOUND OUTCOME")


if __name__ == "__main__":
    main()
