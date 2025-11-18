import AsyncStorage from '@react-native-async-storage/async-storage';
import { FileSystemService } from './FileSystemService';
import { StatusFile } from '@/types';

const AUTO_SAVE_KEY = 'auto_save_enabled';
const SAVED_STATUS_IDS_KEY = 'saved_status_ids';

export class AutoSaveService {
  /**
   * Check if auto-save is enabled
   */
  static async isAutoSaveEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(AUTO_SAVE_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking auto-save status:', error);
      return false;
    }
  }

  /**
   * Enable or disable auto-save
   */
  static async setAutoSaveEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTO_SAVE_KEY, enabled.toString());
    } catch (error) {
      console.error('Error setting auto-save status:', error);
    }
  }

  /**
   * Get list of previously saved status IDs
   */
  private static async getSavedStatusIds(): Promise<Set<string>> {
    try {
      const value = await AsyncStorage.getItem(SAVED_STATUS_IDS_KEY);
      if (value) {
        return new Set(JSON.parse(value));
      }
      return new Set();
    } catch (error) {
      console.error('Error getting saved status IDs:', error);
      return new Set();
    }
  }

  /**
   * Save status IDs to storage
   */
  private static async saveSavedStatusIds(ids: Set<string>): Promise<void> {
    try {
      await AsyncStorage.setItem(SAVED_STATUS_IDS_KEY, JSON.stringify([...ids]));
    } catch (error) {
      console.error('Error saving status IDs:', error);
    }
  }

  /**
   * Check for new statuses and auto-save them
   */
  static async checkAndAutoSave(statuses: StatusFile[]): Promise<number> {
    try {
      const isEnabled = await this.isAutoSaveEnabled();
      if (!isEnabled) {
        return 0;
      }

      const savedIds = await this.getSavedStatusIds();
      const newStatuses = statuses.filter(status => !savedIds.has(status.id));

      if (newStatuses.length === 0) {
        return 0;
      }

      // Download new statuses
      const results = await FileSystemService.downloadMultipleStatuses(newStatuses);
      const successfulDownloads = results.filter(r => r.success).length;

      // Update saved IDs
      if (successfulDownloads > 0) {
        newStatuses.forEach(status => savedIds.add(status.id));
        await this.saveSavedStatusIds(savedIds);
      }

      return successfulDownloads;
    } catch (error) {
      console.error('Error in auto-save:', error);
      return 0;
    }
  }

  /**
   * Clear saved status IDs history
   */
  static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SAVED_STATUS_IDS_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }
}
