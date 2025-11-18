# Setup Guide

## Step-by-Step Installation

### 1. Environment Setup

#### Install Node.js
Download and install Node.js 18+ from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

#### Install React Native CLI
```bash
npm install -g react-native-cli
```

#### Install Android Studio
1. Download from [developer.android.com](https://developer.android.com/studio)
2. Install Android SDK (API 33 or higher)
3. Set up Android environment variables:

**Windows:**
```bash
ANDROID_HOME = C:\Users\[YourUsername]\AppData\Local\Android\Sdk
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

**Mac/Linux:**
Add to `~/.bash_profile` or `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 2. Project Setup

#### Clone/Navigate to Project
```bash
cd wa
```

#### Install Dependencies
```bash
npm install
```

#### Install CocoaPods (iOS only - Mac)
```bash
cd ios
pod install
cd ..
```

### 3. Running the App

#### Start Metro Bundler
```bash
npm start
```

#### Run on Android

**Using USB Device:**
1. Enable Developer Options on your phone
2. Enable USB Debugging
3. Connect phone via USB
4. Run:
```bash
npm run android
```

**Using Emulator:**
1. Open Android Studio
2. Start an AVD (Android Virtual Device)
3. Run:
```bash
npm run android
```

### 4. First Launch

When you first launch the app:

1. **Grant Permissions**: App will request storage permissions
2. **Android 11+ Users**: 
   - Go to Settings → Apps → Status Downloader → Permissions
   - Enable "All files access" or "Files and media"
3. **Verify WhatsApp**: Ensure WhatsApp is installed and you've viewed some statuses
4. **Refresh**: Pull down on the home screen to load statuses

## Common Issues

### Metro Bundler Issues

**Clear cache and restart:**
```bash
npm start -- --reset-cache
```

**Or:**
```bash
watchman watch-del-all
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### Build Errors

**Clean Android build:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Permission Errors

If permissions aren't working:

1. Uninstall the app
2. Reinstall: `npm run android`
3. Grant all permissions when prompted
4. For Android 11+: Manually enable in Settings

### No Statuses Found

1. Open WhatsApp and view some statuses
2. Close WhatsApp
3. Open Status Downloader app
4. Pull down to refresh

## Development

### Running in Development Mode

```bash
npm start
```

In a new terminal:
```bash
npm run android
```

### Debugging

**Enable Debug Mode:**
- Shake device or press Cmd+M (Mac) / Ctrl+M (Windows)
- Select "Debug"

**View Logs:**
```bash
npx react-native log-android
```

### Hot Reload

- Fast Refresh is enabled by default
- Changes to code will automatically reload
- Press "r" in Metro to manually reload

## Building for Production

### Create Release Build

```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Install Release APK

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

## Testing

### Test on Device

1. Install the app
2. Open WhatsApp and view statuses
3. Open Status Downloader
4. Verify statuses appear
5. Test download functionality
6. Test auto-save feature
7. Test dark mode
8. Test downloads screen

### Verify Permissions

```bash
adb shell dumpsys package com.whatsappstatusdownloader | grep permission
```

## Updates

### Update Dependencies

```bash
npm update
```

### Update React Native

```bash
npx react-native upgrade
```

## Need Help?

- Check README.md for detailed documentation
- Review troubleshooting section
- Check React Native documentation
- Create an issue on GitHub
