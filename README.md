# WhatsApp Status Downloader

A fully functional mobile app built with React Native that allows users to view and download WhatsApp statuses (images and videos) from their contacts. The app is completely offline and preserves the original quality of all media.

## 📱 Features

### Core Functionality

- **Status Detection**: Automatically detect and display WhatsApp statuses stored locally on the device
- **Media Support**: View both images and videos in high quality
- **Preview & Select**: Browse statuses in a grid layout, tap to preview, and select multiple items
- **Download & Save**: Save selected statuses to `/WhatsAppDownloader/` folder with original quality preserved
- **Offline Operation**: No internet required - works entirely on the device

### Enhanced Features

- **Auto-Save**: Automatically download new statuses as they appear
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Downloads Manager**: View and manage previously downloaded statuses
- **Batch Operations**: Download or delete multiple statuses at once
- **Video Controls**: Custom play/pause controls for video playback
- **Share Functionality**: Share downloaded statuses to other apps
- **Metadata Display**: View file size, date, and video duration

## 🛠️ Tech Stack

- **React Native**: Core framework for cross-platform development
- **TypeScript**: Type-safe development
- **React Navigation**: Screen navigation
- **React Native FS**: File system access and operations
- **React Native Permissions**: Android permission management
- **React Native Video**: Video playback
- **AsyncStorage**: Persistent settings storage

## 📋 Prerequisites

- Node.js (>= 18.x)
- React Native development environment
- Android Studio (for Android development)
- JDK 11 or higher

## 🚀 Installation

### 1. Clone and Install Dependencies

```bash
cd wa
npm install
```

### 2. Android Setup

The app is configured for Android. Permissions are already set in `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" android:minSdkVersion="30" />
```

### 3. Build and Run

```bash
# Start Metro bundler
npm start

# In a new terminal, run on Android
npm run android
```

## 📁 Project Structure

```
wa/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── StatusGrid.tsx   # Grid layout for statuses
│   │   ├── StatusItem.tsx   # Individual status item
│   │   └── StatusPreview.tsx # Full-screen preview with controls
│   ├── context/
│   │   └── ThemeContext.tsx # Theme management (dark/light mode)
│   ├── screens/
│   │   ├── HomeScreen.tsx   # Main screen showing current statuses
│   │   └── DownloadsScreen.tsx # Downloaded statuses viewer
│   ├── services/
│   │   ├── FileSystemService.ts    # File operations
│   │   ├── PermissionService.ts    # Permission handling
│   │   └── AutoSaveService.ts      # Auto-save functionality
│   └── types/
│       └── index.ts         # TypeScript type definitions
├── android/                 # Android native code
├── App.tsx                  # Main app component
└── package.json
```

## 🎯 How It Works

### WhatsApp Status Access

The app accesses WhatsApp statuses from the following directories:

- **WhatsApp**: `/Android/media/com.whatsapp/WhatsApp/Media/.Statuses`
- **WhatsApp Business**: `/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses`

### File Management

1. **Scanning**: App scans WhatsApp status folders for images (jpg, png, gif, webp) and videos (mp4, mkv, avi, mov, 3gp)
2. **Preview**: Tap any status to open full-screen preview
3. **Download**: Copied to `/storage/emulated/0/Download/WhatsAppDownloader/`
4. **Naming**: Files saved as `Status_[timestamp]_[original_name]`

## 📱 Usage Guide

### Viewing Statuses

1. Grant storage permissions when prompted
2. App automatically loads available statuses
3. Pull down to refresh the status list
4. Tap any status to preview in full screen

### Downloading Statuses

**Single Download:**

1. Tap a status to preview
2. Tap "⬇ Download" button

**Batch Download:**

1. Long-press a status to enter selection mode
2. Tap additional statuses to select them
3. Tap "Download All" button at the bottom

### Auto-Save Feature

1. Tap settings icon (⚙️) in the header
2. Toggle "Auto-Save New Statuses"
3. New statuses will be automatically saved

### Managing Downloads

1. Tap downloads icon (📥) in the header
2. View all downloaded statuses
3. Select and delete unwanted files

### Theme Switching

1. Tap settings icon (⚙️) in the header
2. Toggle "Dark Mode" switch

## ⚙️ Configuration

### Android Permissions (Android 11+)

For Android 11 and above, additional setup may be required:

1. Install and run the app
2. Go to Settings > Apps > Status Downloader > Permissions
3. Enable "All files access" or "Manage external storage"

### File Paths

To customize download location, edit `FileSystemService.ts`:

```typescript
private static readonly DOWNLOAD_FOLDER = `${RNFS.DownloadDirectoryPath}/WhatsAppDownloader`;
```

## 🐛 Troubleshooting

### No Statuses Showing

- Ensure WhatsApp is installed and you've viewed some statuses
- Check that storage permissions are granted
- Verify WhatsApp status directory exists
- Try refreshing the list (pull down)

### Permission Errors

- For Android 11+, manually enable "All files access" in app settings
- Reinstall the app and grant permissions again
- Check that `requestLegacyExternalStorage` is set to `true` in AndroidManifest.xml

### Download Failures

- Ensure sufficient storage space
- Check write permissions
- Verify download folder creation in FileSystemService

## 🔒 Privacy & Legal

This app is completely safe and legal:

- ✅ Works entirely offline
- ✅ Only accesses media you already have permission to view
- ✅ No data collection or internet communication
- ✅ No third-party analytics
- ✅ Downloaded files remain on your device only

**Note**: Downloaded statuses remain accessible even after they expire in WhatsApp (typically 24 hours).

## 🚀 Building for Release

### Generate Release APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Signing the App

1. Generate a keystore:

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Update `android/app/build.gradle` with signing config

3. Build signed APK:

```bash
cd android
./gradlew assembleRelease
```

## 📈 Future Enhancements

Potential features to add:

- [ ] Status upload/sharing back to WhatsApp
- [ ] Advanced filtering (by date, type, contact)
- [ ] Search functionality
- [ ] Favorites/bookmarks
- [ ] Cloud backup integration
- [ ] Slideshow mode
- [ ] Image editing tools
- [ ] Status categories/albums

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- iOS support
- Performance optimizations
- UI/UX enhancements
- Additional features
- Bug fixes

## 📄 License

This project is for educational purposes. Respect WhatsApp's terms of service and user privacy.

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review the GitHub issues
3. Create a new issue with details about your problem

## 🙏 Acknowledgments

- React Native community
- WhatsApp for the amazing status feature
- All contributors and users

---

**Made with ❤️ using React Native**
