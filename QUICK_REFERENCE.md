# Quick Reference

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development
npm start

# Run on Android (in new terminal)
npm run android
```

## 📱 App Controls

| Action              | Gesture                    |
| ------------------- | -------------------------- |
| **Preview status**  | Tap on status              |
| **Select multiple** | Long-press any status      |
| **Deselect all**    | Tap "Clear" in header      |
| **Refresh list**    | Pull down to refresh       |
| **Open settings**   | Tap ⚙️ icon                |
| **View downloads**  | Tap 📥 icon                |
| **Toggle video**    | Tap screen during playback |
| **Share status**    | Tap 📤 in preview          |
| **Download status** | Tap ⬇ in preview           |

## 🎨 Features Quick Access

### Home Screen

- **Grid View**: All available WhatsApp statuses
- **Settings Panel**: Dark mode, Auto-save toggle
- **Batch Selection**: Select multiple for download
- **Status Count**: Shows total available statuses

### Downloads Screen

- **Saved Statuses**: All previously downloaded items
- **Delete Function**: Remove unwanted downloads
- **Persistent Storage**: Files saved permanently

### Preview Screen

- **Full Screen**: Immersive viewing experience
- **Video Controls**: Play/pause, time display
- **Metadata**: File size, date, duration
- **Actions**: Share, download, or delete

## ⚡ Keyboard Shortcuts (Development)

| Key              | Action        |
| ---------------- | ------------- |
| **R**            | Reload app    |
| **D**            | Open dev menu |
| **Cmd/Ctrl + M** | Show dev menu |
| **Cmd/Ctrl + D** | Debug mode    |

## 📂 File Locations

### WhatsApp Status Directories

```
/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses
/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses
```

### Download Directory

```
/storage/emulated/0/Download/WhatsAppDownloader/
```

## 🔧 npm Scripts

```bash
npm start          # Start Metro bundler
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS (if configured)
npm test           # Run tests
npm run lint       # Run linter
```

## 🎯 Common Tasks

### Install New Package

```bash
npm install <package-name>
cd android && ./gradlew clean
cd .. && npm run android
```

### Clear Cache

```bash
npm start -- --reset-cache
```

### View Logs

```bash
npx react-native log-android  # Android logs
npx react-native log-ios       # iOS logs
```

### Clean Build

```bash
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
npm run android
```

## 🐛 Quick Fixes

### App Won't Start

```bash
watchman watch-del-all
rm -rf node_modules package-lock.json
npm install
npm start -- --reset-cache
```

### Permission Issues

```bash
# Uninstall and reinstall
adb uninstall com.whatsappstatusdownloader
npm run android
```

### Build Errors

```bash
cd android
./gradlew clean
./gradlew assembleDebug --info
```

## 📊 File Types Supported

### Images

- `.jpg`, `.jpeg` - JPEG images
- `.png` - PNG images
- `.gif` - Animated GIFs
- `.webp` - WebP format

### Videos

- `.mp4` - MP4 videos
- `.mkv` - Matroska videos
- `.avi` - AVI videos
- `.mov` - QuickTime videos
- `.3gp` - 3GPP videos

## 🎨 Theme Colors

### Light Mode

- Primary: `#25D366` (WhatsApp Green)
- Background: `#FFFFFF`
- Surface: `#F5F5F5`
- Text: `#000000`

### Dark Mode

- Primary: `#25D366` (WhatsApp Green)
- Background: `#121212`
- Surface: `#1E1E1E`
- Text: `#FFFFFF`

## 📱 Android Permissions

```xml
READ_EXTERNAL_STORAGE    # Read files
WRITE_EXTERNAL_STORAGE   # Write files
MANAGE_EXTERNAL_STORAGE  # Android 11+ full access
```

## 🔐 Security Notes

- ✅ All operations are local
- ✅ No internet connection required
- ✅ No data collection
- ✅ No third-party services
- ✅ Files stay on device only

## 💡 Pro Tips

1. **Auto-Save**: Enable in settings to automatically download new statuses
2. **Dark Mode**: Use at night for comfortable viewing
3. **Batch Download**: Long-press to select multiple statuses
4. **Quick Preview**: Single tap for instant preview
5. **Refresh Often**: Pull down to check for new statuses
6. **Manage Storage**: Regularly delete old downloads
7. **Share Wisely**: Use share button to send to other apps
8. **Video Controls**: Tap screen to show/hide controls

## 📈 Performance Tips

- Clear old downloads regularly
- Close other apps for smooth video playback
- Use Wi-Fi for initial setup (downloading dependencies)
- Restart app if it becomes slow
- Clear app cache from device settings

## 🆘 Emergency Commands

```bash
# Complete reset
rm -rf node_modules android/app/build ios/build
npm install
cd android && ./gradlew clean && cd ..
npm start -- --reset-cache

# Uninstall app
adb uninstall com.whatsappstatusdownloader

# Check connected devices
adb devices

# View app info
adb shell dumpsys package com.whatsappstatusdownloader
```

## 📞 Quick Support

**Before reporting issues:**

1. Check README.md troubleshooting
2. Review SETUP.md for common fixes
3. Clear cache and rebuild
4. Check permissions are granted
5. Verify WhatsApp is installed

**When reporting:**

- Include error messages
- Describe steps to reproduce
- Mention Android version
- Share logs if possible
