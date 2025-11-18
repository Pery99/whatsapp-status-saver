import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export class PermissionService {
  /**
   * Request storage permissions based on Android version
   */
  static async requestStoragePermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const androidVersion = Platform.Version;

      // Android 11+ (API 30+)
      if (androidVersion >= 30) {
        return await this.requestAndroid11Permissions();
      } 
      // Android 10 (API 29)
      else if (androidVersion === 29) {
        return await this.requestAndroid10Permissions();
      } 
      // Android 6-9 (API 23-28)
      else {
        return await this.requestLegacyPermissions();
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * Android 11+ permissions (MANAGE_EXTERNAL_STORAGE)
   */
  private static async requestAndroid11Permissions(): Promise<boolean> {
    try {
      // For Android 11+, we need to request MANAGE_EXTERNAL_STORAGE
      // This requires the user to grant permission in Settings
      
      const readPermission = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      
      if (readPermission !== RESULTS.GRANTED) {
        const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        if (result !== RESULTS.GRANTED) {
          Alert.alert(
            'Permission Required',
            'Storage permission is required to access WhatsApp statuses. Please grant permission in Settings.',
            [{ text: 'OK' }]
          );
          return false;
        }
      }

      // Note: MANAGE_EXTERNAL_STORAGE requires special handling
      // Users need to manually enable it in Settings > Apps > Your App > Permissions
      Alert.alert(
        'Additional Permission Required',
        'For Android 11+, you may need to enable "All files access" in Settings > Apps > Status Downloader > Permissions.',
        [{ text: 'OK' }]
      );

      return true;
    } catch (error) {
      console.error('Error requesting Android 11+ permissions:', error);
      return false;
    }
  }

  /**
   * Android 10 permissions
   */
  private static async requestAndroid10Permissions(): Promise<boolean> {
    try {
      const readPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to view WhatsApp statuses.',
          buttonPositive: 'OK',
        }
      );

      const writePermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to save WhatsApp statuses.',
          buttonPositive: 'OK',
        }
      );

      return (
        readPermission === PermissionsAndroid.RESULTS.GRANTED &&
        writePermission === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (error) {
      console.error('Error requesting Android 10 permissions:', error);
      return false;
    }
  }

  /**
   * Legacy Android permissions (Android 6-9)
   */
  private static async requestLegacyPermissions(): Promise<boolean> {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);

      return (
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (error) {
      console.error('Error requesting legacy permissions:', error);
      return false;
    }
  }

  /**
   * Check if storage permissions are granted
   */
  static async checkStoragePermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const readPermission = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      return readPermission === RESULTS.GRANTED;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }
}
