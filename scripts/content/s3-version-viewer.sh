#!/bin/bash
set -euo pipefail

# --- Argument Parsing ---
if [[ $# -ne 2 ]]; then
    echo "Usage: $0 <aws_account_id> <aws_profile_name>"
    echo "Example: $0 825765425922 vita-preprod"
    exit 1
fi

aws_account="$1"
profile="$2"

bucket="gh-vita-$aws_account-content-cache"
object="rsv-vaccine.json"

CONFIG_FILE="/tmp/s3_viewer.conf"
trap 'rm -f "$CONFIG_FILE"' EXIT
echo "BUCKET_NAME=\"$bucket\"" > "$CONFIG_FILE"
echo "PROFILE_NAME=\"$profile\"" >> "$CONFIG_FILE"
echo "OBJECT_KEY=\"$object\"" >> "$CONFIG_FILE"

VERSION_LIST=$(aws s3api list-object-versions --bucket "$bucket" --prefix "$object" --profile "$profile" | \
  jq -r '.Versions[] | "\(.IsLatest | tostring)\t\(.LastModified)\t\(.VersionId)"')

CHOSEN_LINE=$(echo -e "$VERSION_LIST" | fzf --header="Select a version (live preview on the right)" \
    --preview-window="right:60%:wrap" \
    --preview='scripts/content/preview.sh {3}')

if [[ -z "$CHOSEN_LINE" ]]; then
  echo "No version selected. Exiting."
  exit 0
fi

chosen_version_id=$(echo "$CHOSEN_LINE" | awk '{print $3}')

DOWNLOAD_TMP_FILE=$(mktemp)
trap 'rm -f "$DOWNLOAD_TMP_FILE"' EXIT

aws s3api get-object \
  --bucket "$bucket" \
  --key "$object" \
  --version-id "$chosen_version_id" \
  --profile "$profile" \
  "$DOWNLOAD_TMP_FILE" > /dev/null

cat "$DOWNLOAD_TMP_FILE" | jq . > before.temp.json
