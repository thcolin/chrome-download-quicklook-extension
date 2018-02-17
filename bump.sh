#!env bash

bold=$(tput bold)
endbold=$(tput sgr0)

[[ '' == $1 ]] && echo "Please provide version argument: x.x.x" && exit 1

read -p "Did you update ${bold}manifest.json${endbold} version to ${bold}$1${endbold} ? [y/n] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  git add manifest.json
  git commit -m "Prepare manifest.json for $1"
  git stash
  npm run test
  npm run build
  npm run bundle
  npm --no-git-tag-version version $1
  git add -f dist chrome-download-quicklook-extension.crx package.json
  git commit -m $1
  git tag v$1
  git push --tags
  git reset --hard HEAD~1
  npm --no-git-tag-version version $1
  git add package.json
  git add package-lock.json
  git commit -m $1
  git push
  git stash pop
fi
