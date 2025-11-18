# Development Notes

## Project Architecture

### Component Structure

```
App.tsx (Root)
  └── ThemeProvider (Context)
      └── NavigationContainer
          └── Stack.Navigator
              ├── HomeScreen
              │   ├── StatusGrid
              │   │   └── StatusItem (multiple)
              │   └── StatusPreview
              └── DownloadsScreen
                  ├── StatusGrid
                  │   └── StatusItem (multiple)
                  └── StatusPreview
```

### State Management

- **Local State**: Component-level with `useState`
- **Context**: Theme management via `ThemeContext`
- **Persistent**: Auto-save settings via `AsyncStorage`

### Services Layer

1. **FileSystemService**: All file operations
   - Scan WhatsApp directories
   - Download/copy files
   - Delete files
   - List downloaded files

2. **PermissionService**: Permission management
   - Request storage permissions
   - Handle different Android versions
   - Check permission status

3. **AutoSaveService**: Auto-download functionality
   - Track saved status IDs
   - Auto-download new statuses
   - Manage save settings

## Key Design Decisions

### File System Access

**Why we use RNFS:**
- Direct file system access
- Copy files without compression
- Reliable on Android
- Simple API

**WhatsApp Status Paths:**
- Changed in Android 11+ to `/Android/media/` from `/WhatsApp/`
- Support both regular and business WhatsApp
- Handle `.nomedia` file properly

### Permission Handling

**Android Version Strategy:**
- Android 6-9: `READ/WRITE_EXTERNAL_STORAGE`
- Android 10: Scoped storage with legacy flag
- Android 11+: `MANAGE_EXTERNAL_STORAGE` (requires manual grant)

### UI/UX Choices

**Grid Layout:**
- 3 columns for optimal viewing
- Square thumbnails for consistency
- Video indicator overlay
- Selection checkmark overlay

**Theme System:**
- Auto-detect system theme
- Manual override option
- Consistent color palette
- Smooth transitions

## Code Style

### TypeScript Guidelines

```typescript
// Use interfaces for props
interface ComponentProps {
  value: string;
  onPress: () => void;
}

// Use arrow functions for components
export const Component: React.FC<ComponentProps> = ({ value, onPress }) => {
  // Implementation
};

// Type service methods
static async methodName(): Promise<ReturnType> {
  // Implementation
}
```

### File Naming

- Components: `PascalCase.tsx`
- Services: `PascalCase.ts`
- Types: `index.ts` (exported from folder)
- Screens: `PascalCaseScreen.tsx`

### Import Order

1. React imports
2. React Native imports
3. Third-party libraries
4. Local components
5. Local services
6. Types
7. Assets/styles

## Performance Considerations

### Image/Video Loading

- Use `resizeMode="cover"` for thumbnails
- Use `resizeMode="contain"` for previews
- Lazy load grid items
- Cache thumbnails in memory

### File Operations

- Batch operations when possible
- Use async/await for I/O
- Handle errors gracefully
- Show loading states

### Memory Management

- Clean up video players on unmount
- Limit simultaneous renders
- Use `FlatList` for virtualization
- Release resources properly

## Testing Strategy

### Manual Testing Checklist

**Permissions:**
- [ ] First launch permission request
- [ ] Permission denial handling
- [ ] Permission grant flow
- [ ] Android 11+ special permissions

**Status Loading:**
- [ ] Empty state display
- [ ] Loading indicator
- [ ] Refresh functionality
- [ ] Error handling

**Downloads:**
- [ ] Single download
- [ ] Batch download
- [ ] Progress indication
- [ ] Success/error messages

**Auto-Save:**
- [ ] Enable/disable toggle
- [ ] New status detection
- [ ] Notification on save
- [ ] Settings persistence

**Theme:**
- [ ] Light mode display
- [ ] Dark mode display
- [ ] Theme toggle
- [ ] System theme detection

**Navigation:**
- [ ] Home to Downloads
- [ ] Downloads back to Home
- [ ] Preview open/close
- [ ] Deep navigation

## Known Limitations

1. **Android Only**: No iOS support currently
2. **No Story Upload**: Can only download, not upload
3. **24-Hour Window**: Only shows currently available statuses
4. **No Contact Info**: Can't identify who posted each status
5. **Manual Refresh**: Not real-time (pull to refresh)

## Future Improvements

### Phase 1: Core Enhancements
- [ ] iOS support
- [ ] Real-time status detection
- [ ] Background auto-save
- [ ] Status expiration indicators

### Phase 2: Features
- [ ] Search and filter
- [ ] Categories/folders
- [ ] Favorites system
- [ ] Share to WhatsApp

### Phase 3: Advanced
- [ ] Cloud backup (Google Drive, Dropbox)
- [ ] Image editor
- [ ] Video trimmer
- [ ] Status scheduling

## Debugging Tips

### Common Issues

**Metro Bundler:**
```bash
# If you see module resolution errors
watchman watch-del-all
rm -rf node_modules
npm install
npm start -- --reset-cache
```

**Android Build:**
```bash
# If build fails
cd android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

**Permissions:**
```bash
# Check granted permissions
adb shell dumpsys package com.whatsappstatusdownloader | grep permission
```

### Logging

Add console logs strategically:
```typescript
console.log('[ServiceName] Operation:', data);
console.error('[ServiceName] Error:', error);
```

View logs:
```bash
npx react-native log-android | grep "ServiceName"
```

## Dependencies

### Core
- `react-native`: Cross-platform framework
- `react`: UI library
- `typescript`: Type safety

### Navigation
- `@react-navigation/native`: Navigation framework
- `@react-navigation/stack`: Stack navigation

### File System
- `react-native-fs`: File operations

### Permissions
- `react-native-permissions`: Permission management

### Media
- `react-native-video`: Video playback

### Storage
- `@react-native-async-storage/async-storage`: Persistent storage

### UI
- `react-native-gesture-handler`: Gesture support
- `react-native-safe-area-context`: Safe area support
- `react-native-screens`: Native screen optimization

## Build Configuration

### Debug Build
```bash
cd android
./gradlew assembleDebug
```

### Release Build
```bash
cd android
./gradlew assembleRelease
```

### Bundle for Play Store
```bash
cd android
./gradlew bundleRelease
```

## Environment Variables

Create `.env` file for configuration:
```
DOWNLOAD_FOLDER_NAME=WhatsAppDownloader
MAX_FILE_SIZE=100
AUTO_SAVE_ENABLED=false
```

## Git Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Emergency fixes

### Commit Messages
```
feat: Add auto-save functionality
fix: Resolve permission error on Android 11
docs: Update README with setup instructions
refactor: Simplify FileSystemService
style: Format code with Prettier
test: Add unit tests for AutoSaveService
```

## Release Process

1. Update version in `package.json`
2. Update version in `android/app/build.gradle`
3. Generate release build
4. Test on multiple devices
5. Create GitHub release
6. Update documentation
7. Deploy to Play Store (optional)

## Support

For development questions:
1. Check this file
2. Review service implementations
3. Check React Native docs
4. Search GitHub issues
5. Ask in community forums

---

**Happy Coding! 🚀**
