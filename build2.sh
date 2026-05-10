#!/bin/bash
cd /Users/mac/english-kids
./node_modules/.bin/vite build 2>&1
echo "BUILD_EXIT=$?"
