#!/usr/bin/env sh

# abort on errors
set -e

git push

# build
npm run build

# navigate into the build output directory
cd 'Pokemon-CP-list'

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:rplus/Pokemon-CP-list.git master:gh-pages

cd -
