#!/bin/bash

if [[ -z "${GITHUB_ACTIONS}" ]]; then
  DEPLOY_SOURCE="lo" # local
else
  DEPLOY_SOURCE="gh" # github
fi

echo "{\"output\": \"$DEPLOY_SOURCE\"}"
