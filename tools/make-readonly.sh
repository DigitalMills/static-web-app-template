#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FILES=(
  "src/index.html"
  "src/pages"
  "src/css"
  "src/js"
  "content/site.json"
  "content/pages"
  "admin/config.yml"
  ".github/workflows/deploy.yml"
)

readonly_mode=true
if [[ "${1-}" == "--revert" ]]; then
  readonly_mode=false
fi

for relative in "${FILES[@]}"; do
  file="$ROOT_DIR/$relative"
  if [[ ! -e "$file" ]]; then
    echo "Skipping missing file: $relative" >&2
    continue
  fi

  if [[ "$readonly_mode" == true ]]; then
    if [[ -d "$file" ]]; then
      chmod -R a-w "$file"
    else
      chmod a-w "$file"
    fi
    echo "Locked $relative"
  else
    if [[ -d "$file" ]]; then
      chmod -R u+w "$file"
    else
      chmod u+w "$file"
    fi
    echo "Unlocked $relative"
  fi
done

if [[ "$readonly_mode" == true ]]; then
  cat <<MSG
Files locked. To allow edits again, run:
  ./tools/make-readonly.sh --revert
MSG
else
  echo "Files unlocked."
fi
