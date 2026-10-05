#!/bin/bash
# Double-click this file in Finder to open the live preview of the site.
# It fetches the latest changes, then keeps the page at http://localhost:3000 up to date by itself.
# Close this window (or press Control+C) to stop it.
cd "$(dirname "$0")" || exit 1
git pull --ff-only
npm install --no-audit --no-fund
(sleep 6 && open "http://localhost:3000") &
npm run live
