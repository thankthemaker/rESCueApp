#!/bin/bash

os=$1
type=$2

if [[ "x${os}x" == "xx" ]]; then
  echo "missing os, either android or ios"
  exit -1
fi

ionic build --prod --aot --output-hashing=all && npx cap sync

if [[ "$os" == "android" ]]; then
 cd android/
 fastlane internal
 cd -
fi

if [[ "$os" == "ios" ]]; then
  export FASTLANE_ITUNES_TRANSPORTER_USE_SHELL_SCRIPT=1
  export FASTLANE_ITUNES_TRANSPORTER_PATH=/Applications/Transporter.app/Contents/itms
 cd ios/App/fastlane
 fastlane beta
 cd -
fi

