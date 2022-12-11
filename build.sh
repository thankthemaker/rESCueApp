#!/bin/bash

os=$1
type=$2

#npm install
npx cap add android
#npx cap add ios

npx trapeze run trapeze-config.yaml -y
#npx capacitor-assets generate --iconBackgroundColor '#000000' --iconBackgroundColorDark '#000000' --splashBackgroundColor '#000000' --splashBackgroundColorDark '#000000' --logoSplashTargetWidth 256

ionic build --prod --aot --output-hashing=all && npx cap sync

ln -snf ~/.fastlane_env fastlane/.env.default

if [[ "x${os}x" == "xx" ]]; then
  echo "missing os, either android or ios is required to build an app"
  exit -1
fi


if [[ "$os" == "android" ]]; then
 find node_modules -type f -name '*.gradle' -exec sed -i '' 's/compile /implementation /g' {} \;
 mkdir -p /var/tmp/android/
 cp /Users/dgey/Desktop/Zertifikate/PlayStoreAppDev /var/tmp/android/PlayStoreAppDev.jks
 fastlane android internal
 rm -rf /var/tmp/android
fi

if [[ "$os" == "ios" ]]; then
  export FASTLANE_ITUNES_TRANSPORTER_USE_SHELL_SCRIPT=1
  export FASTLANE_ITUNES_TRANSPORTER_PATH=/Applications/Transporter.app/Contents/itms
  fastlane ios beta
fi

