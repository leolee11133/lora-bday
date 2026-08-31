#!/usr/bin/env bash
# Builds the site for GitHub Pages and pushes it to the gh-pages branch.
# Run from the project root:  npm run deploy
set -euo pipefail

REPO="leolee11133/lora-bday"
BASE="/lora-bday/"

VITE_BASE="$BASE" npm run build

# SPA fallback: GitHub Pages serves 404.html for unknown paths,
# so direct links like /person/siri keep working.
cp dist/index.html dist/404.html

# Opt out of Jekyll processing on Pages.
touch dist/.nojekyll

cd dist
rm -rf .git
git init -q
git checkout -qb gh-pages
git add -A
git commit -qm "deploy $(date '+%Y-%m-%d %H:%M')"
git push -f "https://github.com/${REPO}.git" gh-pages
rm -rf .git
echo "deployed → https://leolee11133.github.io/lora-bday/"
