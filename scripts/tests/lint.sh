#!/bin/bash

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

yarn run lint

yarn run check

echo "Lint run complete."