#!/usr/bin/env python3
"""
Build a combined Dispatcharr plugin repo manifest by scanning GitHub Releases
for each plugin repo listed in repos.json.

For each plugin this script:
  - Fetches plugin.json from the repo's default branch for metadata
  - Scans GitHub Releases for stable and dev (pre-release) builds
  - Computes SHA256 checksums and resolves commit SHAs
  - Fetches the plugin logo
  - Writes a per-plugin manifest.json and the combined root manifest.json

Configuration:
  repos.json   - list of plugin repos with per-repo settings
  config.json  - top-level settings (registry_name)

Required environment variables:
  REPO          this aggregator repo, e.g. "sethwv/dispatcharr-plugins-dev"
  GH_TOKEN      GitHub token (used by the `gh` CLI)
  GITHUB_OUTPUT path to the GitHub Actions step-output file
"""

import hashlib
import io
import json
import os
import subprocess
import sys
import urllib.request
import zipfile

REPOS_FILE = "repos.json"
CONFIG_FILE = "config.json"
OUT_DIR = "_manifest_out"

RAW = "https://raw.githubusercontent.com"


def gh(*args):
    result = subprocess.run(
        ["gh", *args],
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout.strip()


def set_output(key, value):
    gho = os.environ.get("GITHUB_OUTPUT", "")
    if gho:
        with open(gho, "a") as f:
            f.write(f"{key}={value}\n")


def fetch_bytes(url):
    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            return resp.read()
    except Exception as exc:
        print(f"  Warning: fetch failed ({url}): {exc}", flush=True)
        return None


def fetch_json(url):
    data = fetch_bytes(url)
    if data is None:
        return None
    try:
        return json.loads(data)
    except Exception as exc:
        print(f"  Warning: JSON parse failed ({url}): {exc}", flush=True)
        return None


def resolve_commit(repo, tag):
    try:
        raw = gh("api", f"repos/{repo}/git/refs/tags/{tag}", "--jq", ".object | {sha, type}")
        obj = json.loads(raw)
        sha = obj["sha"]
        if obj["type"] == "tag":
            sha = gh("api", f"repos/{repo}/git/tags/{sha}", "--jq", ".object.sha")
        return sha, sha[:8]
    except Exception as exc:
        print(f"  Warning: could not resolve commit for {tag}: {exc}", flush=True)
        return None, None


def plugin_json_from_zip(data):
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as zf:
            matches = [n for n in zf.namelist() if n.endswith("plugin.json")]
            if matches:
                return json.loads(zf.read(matches[0]))
    except Exception as exc:
        print(f"  Warning: could not read plugin.json from zip: {exc}", flush=True)
    return {}


def process_plugin(repo_entry):
    """
    Scan a plugin repo's releases and return (slug, meta, versions, dev_entry, logo_bytes).
    Returns None on fatal failure.
    """
    repo = repo_entry["repo"]
    plugin_json_path = repo_entry.get("plugin_json", "src/plugin.json")
    logo_path = repo_entry.get("logo", "src/logo.png")
    dev_tag = repo_entry.get("dev_tag")

    print(f"\n{'='*60}", flush=True)
    print(f"Processing {repo}", flush=True)

    # Fetch plugin.json from default branch
    default_branch = "main"
    meta_url = f"{RAW}/{repo}/{default_branch}/{plugin_json_path}"
    meta = fetch_json(meta_url)
    if meta is None:
        # Try dev branch
        meta_url = f"{RAW}/{repo}/dev/{plugin_json_path}"
        meta = fetch_json(meta_url)
    if meta is None:
        print(f"  ERROR: could not fetch plugin.json – skipping {repo}", flush=True)
        return None

    name = meta.get("name", repo.split("/")[-1])
    slug = name.lower().replace(" ", "_")
    print(f"  slug: {slug}  name: {name}", flush=True)

    # Fetch logo
    logo_url = f"{RAW}/{repo}/{default_branch}/{logo_path}"
    logo_bytes = fetch_bytes(logo_url)
    if logo_bytes is None:
        logo_url = f"{RAW}/{repo}/dev/{logo_path}"
        logo_bytes = fetch_bytes(logo_url)

    # Fetch all releases
    releases = json.loads(gh("api", "--paginate", f"repos/{repo}/releases"))

    # Stable releases
    versions = []
    for rel in sorted(releases, key=lambda r: r["published_at"], reverse=True):
        if rel["draft"] or rel["prerelease"]:
            continue

        tag = rel["tag_name"]
        version = tag.lstrip("v")

        asset = next(
            (a for a in rel["assets"] if a["name"].endswith(".zip") and "-pre" not in a["name"]),
            None,
        )
        if not asset:
            print(f"  {tag}: no zip asset – skipping", flush=True)
            continue

        url = asset["browser_download_url"]
        print(f"  {version}: {url}", flush=True)
        data = fetch_bytes(url)
        if data is None:
            continue

        sha256 = hashlib.sha256(data).hexdigest()
        pj = plugin_json_from_zip(data)
        min_ver = pj.get("min_dispatcharr_version")
        commit_sha, commit_short = resolve_commit(repo, tag)

        entry = {
            "version": version,
            "url": url,
            "checksum_sha256": sha256,
            "build_timestamp": rel["published_at"],
        }
        if commit_sha:
            entry["commit_sha"] = commit_sha
            entry["commit_sha_short"] = commit_short
        if min_ver:
            entry["min_dispatcharr_version"] = min_ver

        versions.append(entry)
        print(f"    -> ok  sha256={sha256[:16]}...", flush=True)

    # Dev pre-release
    dev_entry = None
    if dev_tag:
        print(f"\n  Looking for dev pre-release '{dev_tag}'...", flush=True)
        try:
            dev_rel = json.loads(gh("api", f"repos/{repo}/releases/tags/{dev_tag}"))
        except subprocess.CalledProcessError:
            dev_rel = None

        if dev_rel and dev_rel.get("prerelease"):
            dev_asset = next(
                (a for a in dev_rel["assets"] if a["name"].endswith(".zip")),
                None,
            )
            if dev_asset:
                dev_url = dev_asset["browser_download_url"]
                print(f"  Found: {dev_url}", flush=True)
                dev_data = fetch_bytes(dev_url)
                if dev_data:
                    dev_sha256 = hashlib.sha256(dev_data).hexdigest()
                    dev_pj = plugin_json_from_zip(dev_data)
                    dev_ver_str = dev_pj.get("version") or dev_rel["tag_name"]
                    dev_min_ver = dev_pj.get("min_dispatcharr_version")
                    dev_commit_sha, dev_commit_short = resolve_commit(repo, dev_rel["tag_name"])
                    dev_entry = {
                        "version": dev_ver_str,
                        "url": dev_url,
                        "checksum_sha256": dev_sha256,
                        "build_timestamp": dev_rel["published_at"],
                        "prerelease": True,
                    }
                    if dev_commit_sha:
                        dev_entry["commit_sha"] = dev_commit_sha
                        dev_entry["commit_sha_short"] = dev_commit_short
                    if dev_min_ver:
                        dev_entry["min_dispatcharr_version"] = dev_min_ver
                    print(f"    -> ok  sha256={dev_sha256[:16]}...", flush=True)
        else:
            print(f"  No dev pre-release found.", flush=True)

    return slug, meta, versions, dev_entry, logo_bytes


def main():
    this_repo = os.environ["REPO"]

    with open(REPOS_FILE) as f:
        repos = json.load(f)

    with open(CONFIG_FILE) as f:
        config = json.load(f)

    registry_name = config.get("registry_name", "Dev Plugins")
    registry_url = f"https://github.com/{this_repo}"
    root_url = f"https://raw.githubusercontent.com/{this_repo}/manifest"

    os.makedirs(OUT_DIR, exist_ok=True)

    all_plugin_entries = []
    any_output = False

    for repo_entry in repos:
        result = process_plugin(repo_entry)
        if result is None:
            continue

        slug, meta, versions, dev_entry, logo_bytes = result

        if not versions and not dev_entry:
            print(f"  No releases found for {repo_entry['repo']} – skipping.", flush=True)
            continue

        any_output = True

        # Latest stable only
        latest = versions[0] if versions else None
        latest_ver = latest["version"] if latest else None

        plugin_root_url = f"{root_url}/plugins/{slug}"

        # Root manifest plugin entry (stable fields only)
        plugin_entry = {
            "slug": slug,
            "name": meta.get("name", slug),
            "description": meta.get("description", ""),
            "author": meta.get("author", ""),
            "license": meta.get("license", "MIT"),
            "latest_version": latest_ver,
            "last_updated": latest.get("build_timestamp") if latest else None,
            "manifest_url": f"plugins/{slug}/manifest.json",
            "latest_url": latest["url"] if latest else None,
            "latest_sha256": latest["checksum_sha256"] if latest else None,
            "icon_url": f"plugins/{slug}/logo.png",
            "min_dispatcharr_version": latest.get("min_dispatcharr_version") if latest else None,
            "discord_thread": meta.get("discord_thread"),
            "help_url": meta.get("help_url"),
        }
        plugin_entry = {k: v for k, v in plugin_entry.items() if v is not None}
        all_plugin_entries.append(plugin_entry)

        # Per-plugin manifest
        per_plugin = {
            "slug": slug,
            "name": meta.get("name", slug),
            "description": meta.get("description", ""),
            "author": meta.get("author", ""),
            "license": meta.get("license", "MIT"),
            "latest_version": latest_ver,
            "versions": versions + ([dev_entry] if dev_entry else []),
            "latest": {**latest} if latest else None,
        }
        per_plugin = {k: v for k, v in per_plugin.items() if v is not None}

        plugin_out = os.path.join(OUT_DIR, "plugins", slug)
        os.makedirs(plugin_out, exist_ok=True)

        with open(os.path.join(plugin_out, "manifest.json"), "w") as f:
            json.dump(per_plugin, f, indent=2)
            f.write("\n")

        if logo_bytes:
            with open(os.path.join(plugin_out, "logo.png"), "wb") as f:
                f.write(logo_bytes)
            print(f"  Logo saved ({len(logo_bytes)} bytes)", flush=True)
        else:
            print(f"  Warning: no logo found for {slug}", flush=True)

        stable_count = len(versions)
        print(f"  Done: {stable_count} stable{', 1 dev' if dev_entry else ''}", flush=True)

    if not any_output:
        print("\nNo plugins produced output – nothing to publish.")
        set_output("has_plugins", "false")
        sys.exit(0)

    root_manifest = {
        "registry_name": registry_name,
        "registry_url": registry_url,
        "root_url": root_url,
        "plugins": all_plugin_entries,
    }

    with open(os.path.join(OUT_DIR, "manifest.json"), "w") as f:
        json.dump(root_manifest, f, indent=2)
        f.write("\n")

    print(f"\nDone – {len(all_plugin_entries)} plugin(s) in combined manifest.", flush=True)
    set_output("has_plugins", "true")


if __name__ == "__main__":
    main()
