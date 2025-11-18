import React, { useState } from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  StatusBar,
  Share,
} from 'react-native';
import Video from 'react-native-video';
import { StatusFile } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface StatusPreviewProps {
  visible: boolean;
  status: StatusFile | null;
  onClose: () => void;
  onDownload: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

const { width, height } = Dimensions.get('window');

export const StatusPreview: React.FC<StatusPreviewProps> = ({
  visible,
  status,
  onClose,
  onDownload,
  onDelete,
  showDelete = false,
}) => {
  const { colors } = useTheme();
  const [videoPaused, setVideoPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  if (!status) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this WhatsApp status!',
        url: status.uri,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.content}
          activeOpacity={1}
          onPress={() => status.type === 'video' && setShowControls(!showControls)}
        >
          <View style={[styles.mediaContainer, { backgroundColor: colors.background }]}>
            {status.type === 'image' ? (
              <Image
                source={{ uri: status.uri }}
                style={styles.media}
                resizeMode="contain"
              />
            ) : (
              <>
                <Video
                  source={{ uri: status.uri }}
                  style={styles.media}
                  resizeMode="contain"
                  paused={videoPaused}
                  repeat
                  controls={false}
                  onProgress={(data) => setCurrentTime(data.currentTime)}
                  onLoad={(data) => setDuration(data.duration)}
                />
                
                {/* Custom Video Controls */}
                {showControls && (
                  <View style={styles.videoControls}>
                    <TouchableOpacity
                      style={[styles.playButton, { backgroundColor: colors.overlay }]}
                      onPress={() => setVideoPaused(!videoPaused)}
                    >
                      <Text style={styles.playButtonText}>
                        {videoPaused ? '▶️' : '⏸️'}
                      </Text>
                    </TouchableOpacity>
                    
                    <View style={[styles.timeContainer, { backgroundColor: colors.overlay }]}>
                      <Text style={styles.timeText}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </Text>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Metadata Info */}
        {showControls && (
          <View style={[styles.metadata, { backgroundColor: colors.overlay }]}>
            <Text style={styles.metadataText}>📏 {formatFileSize(status.size)}</Text>
            <Text style={styles.metadataText}>📅 {formatDate(status.timestamp)}</Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.overlay }]}
            onPress={onClose}
          >
            <Text style={styles.headerButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.footerButton, { backgroundColor: colors.overlay }]}
            onPress={handleShare}
          >
            <Text style={styles.footerButtonText}>📤 Share</Text>
          </TouchableOpacity>

          {showDelete && onDelete ? (
            <TouchableOpacity
              style={[styles.footerButton, { backgroundColor: colors.error }]}
              onPress={onDelete}
            >
              <Text style={[styles.footerButtonText, styles.downloadButtonText]}>
                🗑️ Delete
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.footerButton, styles.downloadButton, { backgroundColor: colors.primary }]}
              onPress={onDownload}
            >
              <Text style={[styles.footerButtonText, styles.downloadButtonText]}>
                ⬇ Download
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: width,
    height: height,
  },
  videoControls: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 16,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 24,
  },
  timeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  metadata: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  metadataText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 40,
    right: 16,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  downloadButton: {
    flex: 1.5,
  },
  downloadButtonText: {
    fontWeight: 'bold',
  },
});
