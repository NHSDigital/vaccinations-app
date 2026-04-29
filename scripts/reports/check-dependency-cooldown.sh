#!/bin/bash

set -euo pipefail

# Checks that changed npm dependencies (direct and transitive) meet the
# required cooldown period. By default, diffs package-lock.json against a base
# ref to only check packages whose versions changed — i.e. the ones Dependabot
# is proposing to update. Falls back to checking all dependencies when no base
# ref is available.
#
# Usage:
#   $ [options] ./check-dependency-cooldown.sh [cooldown_days] [base_ref]
#
# Options:
#   cooldown_days  Number of days since publication required (default: 4)
#   base_ref       Git ref to diff against (default: origin/main)
#                  Set to "--all" to check every dependency
#   VERBOSE=true   Show all the executed commands, default is 'false'

# ==============================================================================

function main() {

  cd "$(git rev-parse --show-toplevel)"

  local cooldown_days="${1:-4}"
  local base_ref="${2:-origin/main}"

  local now_epoch
  now_epoch=$(date +%s)
  local cooldown_seconds=$((cooldown_days * 86400))
  local threshold_epoch=$((now_epoch - cooldown_seconds))

  local packages
  packages=$(determine-packages "$cooldown_days" "$base_ref")

  if [[ -z "$packages" ]]; then
    echo "No dependencies found. Run 'npm install' first."
    exit 1
  fi

  check-cooldown "$packages" "$cooldown_days" "$now_epoch" "$threshold_epoch"
}

# ==============================================================================

function determine-packages() {

  local cooldown_days="$1"
  local base_ref="$2"

  if [[ "$base_ref" == "--all" ]]; then
    echo "Dependency Cooldown Check — ALL dependencies (minimum ${cooldown_days} days)" >&2
    echo "=========================================================================" >&2
    echo "" >&2
    get-all-packages
  else
    echo "Dependency Cooldown Check — CHANGED dependencies vs ${base_ref} (minimum ${cooldown_days} days)" >&2
    echo "=========================================================================" >&2
    echo "" >&2

    if ! git rev-parse --verify "${base_ref}" >/dev/null 2>&1; then
      echo "WARNING: Base ref '${base_ref}' not found. Falling back to checking all dependencies." >&2
      echo "" >&2
      get-all-packages
    else
      local changed
      changed=$(get-changed-packages "$base_ref")

      if [[ -z "$changed" ]]; then
        echo "No dependency version changes detected against ${base_ref}. Nothing to check." >&2
        exit 0
      fi

      echo "$changed"
    fi
  fi
}

function get-all-packages() {

  local deps_json
  deps_json=$(npm ls --all --json 2>/dev/null || echo '{}')
  echo "$deps_json" | jq -r '
    [recurse(.dependencies // {} | to_entries[] | .value) | .dependencies // {} | to_entries[] | "\(.key)|\(.value.version // "unknown")"]
    | unique[]
  ' 2>/dev/null || echo ""
}

function get-changed-packages() {

  local base_ref="$1"

  # Extract changed packages from the lockfile diff.
  # Lockfile v3 keys look like "node_modules/pkg" or "node_modules/scope/pkg".
  # We look for lines adding a new "version" under a node_modules entry.
  git diff "${base_ref}" -- package-lock.json \
    | node -e '
      const fs = require("fs");
      const diff = fs.readFileSync(0, "utf8");
      const lockfile = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
      const pkgs = lockfile.packages || {};
      // Collect every node_modules path mentioned in added lines of the diff
      const changedPaths = new Set();
      for (const line of diff.split("\n")) {
        // Hunk headers in the diff reference keys like "node_modules/foo"
        const keyMatch = line.match(/^[+]\s*"(node_modules\/.+?)":\s*\{/);
        if (keyMatch) changedPaths.add(keyMatch[1]);
      }
      // Also detect version-line changes and map them back
      let currentPath = null;
      for (const line of diff.split("\n")) {
        const pathMatch = line.match(/^[\s+"]*"?(node_modules\/.+?)"?\s*:\s*\{/);
        if (pathMatch) currentPath = pathMatch[1];
        if (currentPath && /^\+.*"version"/.test(line)) changedPaths.add(currentPath);
      }
      const seen = new Set();
      for (const p of changedPaths) {
        const entry = pkgs[p];
        if (!entry || !entry.version) continue;
        // Derive package name from the path (handles scoped packages)
        const name = p.replace(/^.*node_modules\//, "");
        const key = name + "|" + entry.version;
        if (!seen.has(key)) { seen.add(key); console.log(key); }
      }
    ' 2>/dev/null || echo ""
}

function check-cooldown() {

  local packages="$1"
  local cooldown_days="$2"
  local now_epoch="$3"
  local threshold_epoch="$4"
  local exit_code=0
  local pass_count=0
  local fail_count=0
  local skip_count=0

  local count
  count=$(echo "$packages" | wc -l | tr -d ' ')
  echo "Checking ${count} package(s)..."
  echo ""

  printf "%-45s %-15s %-12s %s\n" "Package" "Version" "Days ago" "Status"
  printf "%-45s %-15s %-12s %s\n" "-------" "-------" "--------" "------"

  while IFS='|' read -r name version; do
    [[ -z "$name" ]] && continue

    if [[ "$version" == "unknown" || -z "$version" ]]; then
      printf "%-45s %-15s %-12s %s\n" "$name" "$version" "-" "SKIP"
      ((skip_count += 1))
      continue
    fi

    # Query npm registry for the publish date of this specific version
    local time_json
    time_json=$(npm view "${name}" time --json 2>/dev/null || echo "{}")
    local publish_date
    publish_date=$(echo "$time_json" | jq -r '."'"${version}"'" // empty' 2>/dev/null || echo "")

    if [[ -z "$publish_date" ]]; then
      printf "%-45s %-15s %-12s %s\n" "$name" "$version" "-" "SKIP"
      ((skip_count += 1))
      continue
    fi

    # Use node for portable date parsing (works on both macOS and Linux)
    local publish_epoch
    publish_epoch=$(node -e "console.log(Math.floor(new Date(process.argv[1]).getTime()/1000))" "$publish_date")

    local days_ago=$(( (now_epoch - publish_epoch) / 86400 ))

    if [[ "$publish_epoch" -gt "$threshold_epoch" ]]; then
      printf "%-45s %-15s %-12s %s\n" "$name" "$version" "${days_ago}d" "FAIL"
      ((fail_count += 1))
      exit_code=1
    else
      printf "%-45s %-15s %-12s %s\n" "$name" "$version" "${days_ago}d" "PASS"
      ((pass_count += 1))
    fi
  done <<< "$packages"

  echo ""
  echo "Results: ${pass_count} passed, ${fail_count} failed, ${skip_count} skipped"
  echo "Cooldown period: ${cooldown_days} days"

  if [[ "$exit_code" -ne 0 ]]; then
    echo ""
    echo "ERROR: Some dependencies do not meet the ${cooldown_days}-day cooldown period."
    echo "These versions were published too recently and may not be stable."
  fi

  exit "$exit_code"
}

# ==============================================================================

function is-arg-true() {

  if [[ "$1" =~ ^(true|yes|y|on|1|TRUE|YES|Y|ON)$ ]]; then
    return 0
  else
    return 1
  fi
}

# ==============================================================================

is-arg-true "${VERBOSE:-false}" && set -x

main "$@"

exit 0
