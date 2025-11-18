import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusFile } from '@/types';
import { FileSystemService } from '@/services/FileSystemService';
import { PermissionService } from '@/services/PermissionService';
import { AutoSaveService } from '@/services/AutoSaveService';
import { StatusGrid } from '@/components/StatusGrid';
import { StatusPreview } from '@/components/StatusPreview';
import { useTheme } from '@/context/ThemeContext';

export const HomeScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [statuses, setStatuses] = useState<StatusFile[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [previewStatus, setPreviewStatus] = useState<StatusFile | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    initializeApp();
    loadAutoSaveSettings();
  }, []);

  const loadAutoSaveSettings = async () => {
    const enabled = await AutoSaveService.isAutoSaveEnabled();
    setAutoSaveEnabled(enabled);
  };

  const initializeApp = async () => {
    try {
      const granted = await PermissionService.requestStoragePermissions();
      setHasPermission(granted);

      if (granted) {
        await loadStatuses();
      } else {
        setLoading(false);
        Alert.alert(
          'Permission Required',
          'Storage permission is required to access WhatsApp statuses.',
          [
            {
              text: 'Retry',
              onPress: initializeApp,
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      setLoading(false);
    }
  };

  const loadStatuses = async () => {
    try {
      setLoading(true);
      const files = await FileSystemService.scanStatusFiles();
      setStatuses(files);

      // Auto-save new statuses if enabled
      const savedCount = await AutoSaveService.checkAndAutoSave(files);
      if (savedCount > 0) {
        Alert.alert('Auto-Save', `${savedCount} new status${savedCount > 1 ? 'es' : ''} saved automatically!`);
      }
    } catch (error) {
      console.error('Error loading statuses:', error);
      Alert.alert('Error', 'Failed to load statuses');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStatuses();
    setRefreshing(false);
  }, []);

  const toggleSelectStatus = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleStatusPress = (status: StatusFile) => {
    if (selectedIds.size > 0) {
      toggleSelectStatus(status.id);
    } else {
      setPreviewStatus(status);
    }
  };

  const handleDownload = async (statusToDownload?: StatusFile) => {
    try {
      const statusesToDownload = statusToDownload
        ? [statusToDownload]
        : statuses.filter((s) => selectedIds.has(s.id));

      if (statusesToDownload.length === 0) {
        Alert.alert('No Selection', 'Please select statuses to download');
        return;
      }

      const results = await FileSystemService.downloadMultipleStatuses(statusesToDownload);
      const successCount = results.filter((r) => r.success).length;

      if (successCount === statusesToDownload.length) {
        Alert.alert(
          'Success',
          `${successCount} status${successCount > 1 ? 'es' : ''} downloaded successfully!`
        );
        setSelectedIds(new Set());
        setPreviewStatus(null);
      } else {
        Alert.alert(
          'Partial Success',
          `${successCount} of ${statusesToDownload.length} statuses downloaded`
        );
      }
    } catch (error) {
      console.error('Error downloading:', error);
      Alert.alert('Error', 'Failed to download statuses');
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const toggleAutoSave = async () => {
    const newValue = !autoSaveEnabled;
    setAutoSaveEnabled(newValue);
    await AutoSaveService.setAutoSaveEnabled(newValue);
    Alert.alert(
      'Auto-Save',
      `Auto-save has been ${newValue ? 'enabled' : 'disabled'}. ${
        newValue ? 'New statuses will be saved automatically.' : ''
      }`
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          WhatsApp Status
        </Text>
        <View style={styles.headerActions}>
          {selectedIds.size > 0 ? (
            <TouchableOpacity onPress={clearSelection}>
              <Text style={[styles.headerAction, { color: colors.primary }]}>
                Clear
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Downloads' as never)}
                style={styles.headerButton}
              >
                <Text style={styles.downloadsIcon}>📥</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
                <Text style={styles.settingsIcon}>⚙️</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Settings Panel */}
      {showSettings && (
        <View style={[styles.settingsPanel, { backgroundColor: colors.surface }]}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Auto-Save New Statuses</Text>
            <Switch
              value={autoSaveEnabled}
              onValueChange={toggleAutoSave}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      )}

      {/* Status Grid */}
      <StatusGrid
        statuses={statuses}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelectStatus}
        onStatusPress={handleStatusPress}
        loading={loading}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Download Button */}
      {selectedIds.size > 0 && (
        <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
          <Text style={[styles.selectedCount, { color: colors.text }]}>
            {selectedIds.size} selected
          </Text>
          <TouchableOpacity
            style={[styles.downloadButton, { backgroundColor: colors.primary }]}
            onPress={() => handleDownload()}
          >
            <Text style={styles.downloadButtonText}>
              Download {selectedIds.size > 1 ? 'All' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Status Preview */}
      <StatusPreview
        visible={previewStatus !== null}
        status={previewStatus}
        onClose={() => setPreviewStatus(null)}
        onDownload={() => previewStatus && handleDownload(previewStatus)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  headerAction: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingsIcon: {
    fontSize: 24,
  },
  downloadsIcon: {
    fontSize: 24,
  },
  settingsPanel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  downloadButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
