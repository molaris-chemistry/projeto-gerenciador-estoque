import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";
import {
  BorderRadius,
  Colors,
  FontSize,
  FontWeight,
  Spacing,
} from "@/constants/Colors";

export interface PickerOption {
  id: number | string;
  label: string;
}

interface PickerProps {
  label: string;
  placeholder?: string;
  options: PickerOption[];
  selectedValue?: number | string;
  onValueChange: (value: number | string) => void;
  error?: string;
  style?: ViewStyle;
}

export function Picker({
  label,
  placeholder = "Selecionar...",
  options,
  selectedValue,
  onValueChange,
  error,
  style,
}: PickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.id === selectedValue)?.label || placeholder;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.trigger,
          error && styles.triggerError,
          selectedValue !== undefined &&
            selectedValue !== "" &&
            styles.triggerActive,
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            styles.triggerText,
            (selectedValue === undefined || selectedValue === "") &&
              styles.triggerPlaceholder,
          ]}
          numberOfLines={1}
        >
          {selectedLabel}
        </Text>
        <Ionicons name="chevron-down" size={20} color={Colors.primary} />
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item.id);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedValue === item.id && styles.optionTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {selectedValue === item.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={Colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
              scrollEnabled
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  triggerActive: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(108, 99, 255, 0.05)",
  },
  triggerError: {
    borderColor: Colors.error,
  },
  triggerText: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  triggerPlaceholder: {
    color: Colors.textTertiary,
  },
  error: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
    fontWeight: FontWeight.medium,
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionText: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  optionTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});
