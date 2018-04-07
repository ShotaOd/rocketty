#!/usr/bin/env bash

cd `dirname $0`

echo '=================================================='
echo 'copy image files (test: [*.png, *.jpg, *.jpeg, *.svg])'
echo '=================================================='

find ../src -type f \
\( -name '*.png' \
-o -name '*.jpg' \
-o -name '*.jpeg' \
-o -name '*.svg' \) |
tee /dev/tty |
sed -e 's/\.\/src\/typescript//' |
xargs -I $ cp ../src/typescript/$ ../lib/$
