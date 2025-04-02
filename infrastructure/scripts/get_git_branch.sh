#!/bin/bash

RAW_BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
BRANCH_NAME=$(echo "$RAW_BRANCH_NAME" | sed 's|/|-|g' | tr '[:upper:]' '[:lower:]')
echo "{\"output\": \"${BRANCH_NAME:0:8}\"}"
