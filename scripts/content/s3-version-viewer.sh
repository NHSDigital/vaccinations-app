#!/bin/bash
set -euo pipefail

# --- Argument Parsing ---
if [[ $# -ne 3 ]]; then
    echo "Usage: $0 <aws_account_id> <aws_profile_name> <vaccine-json-file-name>"
    echo "Example: $0 825765425922 vita-preprod hpv-vaccine.json"
    exit 1
fi

aws_account="$1"
profile="$2"
object="$3"

bucket="gh-vita-$aws_account-content-cache"

CONFIG_FILE="/tmp/s3_viewer.conf"
trap 'rm -f "$CONFIG_FILE"' EXIT
echo "BUCKET_NAME=\"$bucket\"" > "$CONFIG_FILE"
echo "PROFILE_NAME=\"$profile\"" >> "$CONFIG_FILE"
echo "OBJECT_KEY=\"$object\"" >> "$CONFIG_FILE"

VERSION_LIST=$(aws s3api list-object-versions --bucket "$bucket" --prefix "$object" --profile "$profile" | \
  jq -r '.Versions[] | "\(.IsLatest | tostring)\t\(.Size)\t\(.LastModified)\t\(.VersionId)"')

CHOSEN_LINE=$(echo -e "$VERSION_LIST" | fzf --header="Select a version (live preview on the right)" \
    --preview-window="right:60%:wrap" \
    --preview='scripts/content/preview.sh {4}')

if [[ -z "$CHOSEN_LINE" ]]; then
  echo "No version selected. Exiting."
  exit 0
fi

chosen_version_id=$(echo "$CHOSEN_LINE" | awk '{print $4}')
updated_timestamp=$(echo "$CHOSEN_LINE" | awk '{print $3}')

DOWNLOAD_TMP_FILE=$(mktemp)
trap 'rm -f "$DOWNLOAD_TMP_FILE"' EXIT

aws s3api get-object \
  --bucket "$bucket" \
  --key "$object" \
  --version-id "$chosen_version_id" \
  --profile "$profile" \
  "$DOWNLOAD_TMP_FILE" > /dev/null

output_file_name="$updated_timestamp.$chosen_version_id.json"
cat "$DOWNLOAD_TMP_FILE" | jq . > "$output_file_name"
echo "Wrote $3 => $output_file_name"
