# rESCueApp

This is a hybrid progressive web app to configure the rESCue firmware.
This app is meant to support the enrollment of new rESCue devices and also replace the Blynk app for all configuration tasks.

## Capacitor

This project is based on Capacitor to build the Androis and iOS apps

### Install dependencies
```npm install @capacitor/android```

```npm install @capacitor/ios```

### Add platforms
```npx cap add android```

This will create a android subfolder within the project root

```npx cap add ios```

This will create a ios subfolder within the project root

### Generate Ressources
```npm install capacitor-resources -g```

```capacitor-resources```

