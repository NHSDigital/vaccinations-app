#!/bin/bash
set -euo pipefail

source /tmp/s3_viewer.conf

VERSION_ID="$1"

TMP_FILE=$(mktemp)
trap 'rm -f "$TMP_FILE"' EXIT

aws s3api get-object \
    --bucket "$BUCKET_NAME" \
    --key "$OBJECT_KEY" \
    --version-id "$VERSION_ID" \
    --profile "$PROFILE_NAME" \
    "$TMP_FILE" >/dev/null

cat "$TMP_FILE" | jq . | head -n 100
