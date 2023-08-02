# rESCueApp

This is a hybrid progressive web app to configure the rESCue firmware.
This app is meant to support the enrollment of new rESCue devices and also replace the Blynk app for all configuration tasks.

## Get the App:

|<a href="https://apps.apple.com/us/app/rescue-app/id1572076731?itsct=apps_box_badge&amp;itscg=30200" style="display: inline-block; overflow: hidden; border-radius: 13px; width: 250px; height: 83px;"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1625097600" alt="Download on the App Store" style="border-radius: 13px; width: 250px; height: 83px;"></a>|<a href='https://play.google.com/store/apps/details?id=org.thankthemaker.rescueapp&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' style="border-radius: 13px; height: 120px;"/></a>|
|---|---|

## Build the App

### Capacitor

This project is based on Capacitor to build the Android and iOS apps

#### Install dependencies
```npm install```

#### Add platforms
```npx cap add android```

This will create a android subfolder within the project root

```npx cap add ios```

This will create a ios subfolder within the project root

#### Generate Ressources
```npm install capacitor-resources -g```

```capacitor-resources```

#### Run Project
```npm run start```

This will start the web app

```npx run start:mobile```

This will run the mobile app on either Android or iOS

