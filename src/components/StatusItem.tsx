import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { StatusFile } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface StatusItemProps {
  status: StatusFile;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 3;

export const StatusItem: React.FC<StatusItemProps> = ({
  status,
  isSelected,
  onPress,
  onLongPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { marginRight: 8, marginBottom: 8 }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: status.uri }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {status.type === 'video' && (
          <View style={styles.videoIndicator}>
            <View style={styles.playIcon}>
              <Text style={styles.playIconText}>▶</Text>
            </View>
          </View>
        )}

        {isSelected && (
          <View style={[styles.selectedOverlay, { backgroundColor: colors.overlay }]}>
            <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  playIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginLeft: 2,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
