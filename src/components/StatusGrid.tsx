import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { StatusFile } from "@/types";
import { StatusItem } from "./StatusItem";
import { useTheme } from "@/context/ThemeContext";

interface StatusGridProps {
  statuses: StatusFile[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onStatusPress: (status: StatusFile) => void;
  loading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const StatusGrid: React.FC<StatusGridProps> = ({
  statuses,
  selectedIds,
  onToggleSelect,
  onStatusPress,
  loading = false,
  onRefresh,
  refreshing = false,
}) => {
  const { colors } = useTheme();

  if (loading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading statuses...
        </Text>
      </View>
    );
  }

  if (statuses.length === 0) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No statuses found
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
          Make sure WhatsApp statuses are available
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={statuses}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.grid}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        ) : undefined
      }
      renderItem={({ item }) => (
        <StatusItem
          status={item}
          isSelected={selectedIds.has(item.id)}
          onPress={() => onStatusPress(item)}
          onLongPress={() => onToggleSelect(item.id)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
