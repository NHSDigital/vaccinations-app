#!/bin/bash

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

npm run lint

echo "Lint run complete."
