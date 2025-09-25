#!/usr/bin/env bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

# Only allow build for main
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
  echo "✅ - Branch is main, build will proceed"
  exit 1    # exit code 1 = build proceeds (in Vercel's ignored-build logic) :contentReference[oaicite:1]{index=1}
else
  echo "⛔ - Not main branch, cancelling build"
  exit 0    # exit code 0 = skip build :contentReference[oaicite:2]{index=2}
fi
