#!/bin/bash

set -xe

function main() {
  echo "@cermati:registry=http://registry.npmjs.org/" > $HOME/.npmrc
  echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" >> $HOME/.npmrc

  # use nodejs 12
  . /root/.nvm/nvm.sh
  nvm install "12.14.1"
  nvm use "12.14.1"
  node --version

  # if there's string 'SKIPDEPLOY' inside the commit message then skip auto deploy
  export SKIP_DEPLOY=`git log --format=%s -n 1 $COMMIT | grep -q SKIPDEPLOY ; echo $?`

  # if there's string 'SKIPDEPLOY' then SKIP_DEPLOY will be 0 otherwise 1
  echo $SKIP_DEPLOY

  # if there's string 'SKIPTEST' inside the commit message then skip integration test
  export SKIP_TEST=`git log --format=%s -n 1 $COMMIT | grep -q SKIPTEST ; echo $?`

  # if there's string 'SKIPTEST' then SKIP_TEST will be 0 otherwise 1
  echo $SKIP_TEST
  export IS_SHIPPABLE_BUILD=`git log --format=email -n 1 | grep -q 'Shippable Build' ; echo $?`

  # if the committer is Shippable Build then IS_SHIPPABLE_BUILD will be 0 otherwise 1
  echo $IS_SHIPPABLE_BUILD

  if [[ "$SKIP_DEPLOY" == 0 || "$IS_SHIPPABLE_BUILD" == 0 ]]; then export SHOULD_DEPLOY_IF_SUCCESS=0; else export SHOULD_DEPLOY_IF_SUCCESS=1; fi
  echo $SHOULD_DEPLOY_IF_SUCCESS

  if [[ "$SKIP_TEST" == 1 && "$IS_SHIPPABLE_BUILD" == 1 ]]; then export SHOULD_REVERT_IF_FAIL=1; else export SHOULD_REVERT_IF_FAIL=0; fi
  echo $SHOULD_REVERT_IF_FAIL

  rm /etc/apt/sources.list.d/basho_riak.list
  sudo apt-get update
  sudo apt-get install -y build-essential g++

  # Explicitly set NODE_ENV=development to force npm to install all dependencies
  NODE_ENV=development npm install --unsafe-perm
  npm test
}

# This is the fuction that will be executed if the main() function ran
# successfully.
function on_success() {
  echo "Success"
}

# This is the fuction that will be executed if the main() function DID NOT run
# successfully.
function on_failure() {
  echo "Failure"
}
