import React from "react";
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
} from "react-native";
import { StatusFile } from "@/types";
import { useTheme } from "@/context/ThemeContext";

interface StatusPreviewProps {
  visible: boolean;
  status: StatusFile | null;
  onClose: () => void;
  onDownload: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

const { width, height } = Dimensions.get("window");

export const StatusPreview: React.FC<StatusPreviewProps> = ({
  visible,
  status,
  onClose,
  onDownload,
  onDelete,
  showDelete = false,
}) => {
  const { colors } = useTheme();
  if (!status) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out this WhatsApp status!",
        url: status.uri,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <StatusBar hidden />
      <View style={styles.container}>
        <View style={[styles.mediaContainer, { backgroundColor: colors.background }]}>
          {status.type === "image" ? (
            <Image source={{ uri: status.uri }} style={styles.media} resizeMode="contain" />
          ) : (
            <View style={styles.placeholderVideo}>
              <Text style={styles.placeholderText}>Video playback temporarily disabled</Text>
            </View>
          )}
        </View>

        <View style={[styles.metadata, { backgroundColor: colors.overlay }]}>
          <Text style={styles.metadataText}>📏 {formatFileSize(status.size)}</Text>
          <Text style={styles.metadataText}>📅 {formatDate(status.timestamp)}</Text>
        </View>

        <View style={styles.header}>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.overlay }]} onPress={onClose}>
            <Text style={styles.headerButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.footerButton, { backgroundColor: colors.overlay }]} onPress={handleShare}>
            <Text style={styles.footerButtonText}>📤 Share</Text>
          </TouchableOpacity>
          {showDelete && onDelete ? (
            <TouchableOpacity style={[styles.footerButton, { backgroundColor: colors.error }]} onPress={onDelete}>
              <Text style={[styles.footerButtonText, styles.downloadButtonText]}>🗑️ Delete</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.footerButton, styles.downloadButton, { backgroundColor: colors.primary }]} onPress={onDownload}>
              <Text style={[styles.footerButtonText, styles.downloadButtonText]}>⬇ Download</Text>
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
    backgroundColor: "#000",
  },
  mediaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  media: {
    width: width,
    height: height,
  },
  placeholderVideo: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 16,
  },
  metadata: {
    position: "absolute",
    top: 80,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  metadataText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  header: {
    position: "absolute",
    top: 40,
    right: 16,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  footerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  downloadButton: {
    flex: 1.5,
  },
  downloadButtonText: {
    fontWeight: "bold",
  },
});
