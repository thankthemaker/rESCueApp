# rESCueApp

This is a hybrid progressive web app to configure the rESCue firmware.
This app is meant to support the enrollment of new rESCue devices and also replace the Blynk app for all configuration tasks.

## Capacitor

This project is based on Capacitor to build the Android and iOS apps

### Install dependencies
```npm install```

### Add platforms
```npx cap add android```

This will create a android subfolder within the project root

```npx cap add ios```

This will create a ios subfolder within the project root

### Generate Ressources
```npm install capacitor-resources -g```

```capacitor-resources```

### Run Project
```npm run start```

This will start the web app

```npx run start:mobile```

This will run the mobile app on either Android or iOS

