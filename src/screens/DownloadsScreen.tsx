import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusFile } from '@/types';
import { FileSystemService } from '@/services/FileSystemService';
import { StatusGrid } from '@/components/StatusGrid';
import { StatusPreview } from '@/components/StatusPreview';
import { useTheme } from '@/context/ThemeContext';

export const DownloadsScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [downloads, setDownloads] = useState<StatusFile[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [previewStatus, setPreviewStatus] = useState<StatusFile | null>(null);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      setLoading(true);
      const files = await FileSystemService.getDownloadedFiles();
      setDownloads(files);
    } catch (error) {
      console.error('Error loading downloads:', error);
      Alert.alert('Error', 'Failed to load downloaded statuses');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDownloads();
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

  const handleDelete = async (statusToDelete?: StatusFile) => {
    try {
      const statusesToDelete = statusToDelete
        ? [statusToDelete]
        : downloads.filter((s) => selectedIds.has(s.id));

      if (statusesToDelete.length === 0) {
        Alert.alert('No Selection', 'Please select statuses to delete');
        return;
      }

      Alert.alert(
        'Confirm Delete',
        `Are you sure you want to delete ${statusesToDelete.length} status${
          statusesToDelete.length > 1 ? 'es' : ''
        }?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              let successCount = 0;
              for (const status of statusesToDelete) {
                const success = await FileSystemService.deleteFile(status.uri);
                if (success) successCount++;
              }

              if (successCount > 0) {
                Alert.alert(
                  'Success',
                  `${successCount} status${successCount > 1 ? 'es' : ''} deleted successfully!`
                );
                setSelectedIds(new Set());
                setPreviewStatus(null);
                await loadDownloads();
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error deleting:', error);
      Alert.alert('Error', 'Failed to delete statuses');
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Downloads</Text>
        {selectedIds.size > 0 && (
          <TouchableOpacity onPress={clearSelection}>
            <Text style={[styles.headerAction, { color: colors.primary }]}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Status Grid */}
      <StatusGrid
        statuses={downloads}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelectStatus}
        onStatusPress={handleStatusPress}
        loading={loading}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Delete Button */}
      {selectedIds.size > 0 && (
        <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
          <Text style={[styles.selectedCount, { color: colors.text }]}>
            {selectedIds.size} selected
          </Text>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.error }]}
            onPress={() => handleDelete()}
          >
            <Text style={styles.deleteButtonText}>Delete {selectedIds.size > 1 ? 'All' : ''}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Status Preview */}
      <StatusPreview
        visible={previewStatus !== null}
        status={previewStatus}
        onClose={() => setPreviewStatus(null)}
        onDownload={() => {}}
        onDelete={() => previewStatus && handleDelete(previewStatus)}
        showDelete
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
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerAction: {
    fontSize: 16,
    fontWeight: '600',
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
  deleteButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
