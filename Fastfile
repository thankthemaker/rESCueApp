# This file contains the fastlane.tools configuration
# You can find the documentation at https://docs.fastlane.tools
#
# For a list of all available actions, check out
#
#     https://docs.fastlane.tools/actions
#
# For a list of all available plugins, check out
#
#     https://docs.fastlane.tools/plugins/available-plugins
#

# Uncomment the line if you want fastlane to automatically update itself
# update_fastlane

default_platform(:ios)

platform :ios do
  desc "Generate iconset"
  lane :icons do
    appicon(
      appicon_image_file: 'fastlane/metadata/app_icon.png',
      appicon_devices: %i[ipad iphone ios_marketing],
      appicon_path: 'App/Assets.xcassets'
    )
  end
  desc "Generate new localized screenshots"
  lane :screenshots do
    capture_screenshots(workspace: "App.xcworkspace", scheme: "App")
    frame_screenshots()
    upload_to_app_store(skip_binary_upload: true, skip_metadata: true)
  end
  desc "Build a new beta release"
  lane :beta do
    app_store_connect_api_key(
      key_id: "VPSVKN97VS",
      issuer_id: "69a6de84-3f1a-47e3-e053-5b8c7c11a4d1",
      key_filepath: "/Users/dgey/Desktop/AuthKey_VPSVKN97VS.p8",
      duration: 1200, # optional (maximum 1200)
      in_house: false # optional but may be required if using match/sigh
    )
    update_info_plist( # Advanced processing: find URL scheme for particular key and replace value
      plist_path: "App/Info.plist",
      block: proc do |plist|
        plist["NSLocationWhenInUseUsageDescription"] = "This App uses your location to allow tracking your route on a map."
        plist["NSBluetoothPeripheralUsageDescription"] = "This App uses Bluetooth to connect to your rESCue device via BLE."
        plist["NSBluetoothAlwaysUsageDescription"] = "This App uses Bluetooth / BLE even when the App is in background to keep connected to your rESCue device."
      end
    )
    increment_build_number
    build_app(scheme: "App", xcargs: "-allowProvisioningUpdates")
    upload_to_testflight
  end
end

platform :android do
  desc "Runs all the tests"
  lane :test do
    gradle(task: "test")
  end

  desc "Submit a new internal Build"
  lane :internal do
    gradle(
          task: "assemble",
          build_type: "Release",
          print_command: false,
          properties: {
            "android.injected.signing.store.file" => "/Users/dgey/Desktop/Zertifikate/PlayStoreAppDev",
            "android.injected.signing.store.password" => "ux8nXZ1t2dg0jP",
            "android.injected.signing.key.alias" => "development",
            "android.injected.signing.key.password" => "ux8nXZ1t2dg0jP",
            })
    upload_to_play_store(track: "internal",
                         #version_code: 16,
                         #version_name: "2.3.0",
                         release_status: "draft",
                         #apk: "path/to/apk.apk",
                         skip_upload_metadata: true,
                         skip_upload_images: true,
                         skip_upload_screenshots: true
                         )
  end

  desc "Submit a new Beta Build to Crashlytics Beta"
  lane :beta do
    gradle(task: "clean assembleRelease")
    crashlytics

    # sh "your_script.sh"
    # You can also use other beta testing services here
  end

  desc "Deploy a new version to the Google Play"
  lane :deploy do
    gradle(task: "clean assembleRelease")
    upload_to_play_store
  end
end
