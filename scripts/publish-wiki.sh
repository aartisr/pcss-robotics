#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
origin="$(git -C "$project_root" remote get-url origin)"

case "$origin" in
  https://github.com/*|git@github.com:*|ssh://git@github.com/*) ;;
  *) echo "The origin remote must be on github.com." >&2; exit 1 ;;
esac

wiki_remote="${origin%.git}.wiki.git"
work_dir="$(mktemp -d)"
trap 'rm -rf "$work_dir"' EXIT

if ! git clone --quiet "$wiki_remote" "$work_dir/wiki"; then
  echo "Enable Wikis in repository Settings and create the first Home page on GitHub, then retry." >&2
  exit 1
fi

cp "$project_root"/wiki/*.md "$work_dir/wiki/"
git -C "$work_dir/wiki" add -- '*.md'

if git -C "$work_dir/wiki" diff --cached --quiet; then
  echo "Wiki is already up to date."
  exit 0
fi

git -C "$work_dir/wiki" commit -m "Update PCSS II Robotics wiki"
git -C "$work_dir/wiki" push origin HEAD
echo "Wiki pages published."
