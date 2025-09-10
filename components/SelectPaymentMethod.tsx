import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants";
import { useAlert } from "./AlertService";
import { getPaymentMethods } from "@/utils/countryStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";

// Types
export type PaymentMethod = {
  id: string;
  name: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (selected: PaymentMethod[]) => void;
  mode?: "single" | "multiple";
};

const PaymentMethodSelector: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  mode = "multiple",
}) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);

  const { showAlert, AlertComponent } = useAlert();

  // Fetch from backend
  const getPaymentMethod = async () => {
    try {
      setLoading(true);
      const res = await getPaymentMethods();
      if (res.success) {
        setMethods(res.data);
      }
    } catch (error: any) {
      if (error?.message.includes("Network request failed")) {
        showAlert(
          "Error",
          "Unable to connect. Please check your internet connection.",
          [{ text: "Close", onPress() {} }],
          "error"
        );
        return;
      }
      console.error("Error fetching payment methods:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      getPaymentMethod();
    }
  }, [visible]);

  // ✅ Fix: work with full objects, not ids
  const toggleMethod = (method: PaymentMethod) => {
    setSelectedMethods((prev) => {
      if (mode === "single") {
        return [method];
      }

      const exists = prev.some((m) => m.id === method.id);
      return exists
        ? prev.filter((m) => m.id !== method.id)
        : [...prev, method];
    });
  };

  const resetMethods = () => setSelectedMethods([]);

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <SafeAreaView style={globalStyles.container}>
        {AlertComponent}
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.title}>
              Select Payment {mode === "single" ? "Method" : "Methods"}
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color={colors.accent} />
            ) : (
              <ScrollView>
                {methods.map((method) => {
                  const isSelected = selectedMethods.some(
                    (m) => m.id === method.id
                  );
                  return (
                    <TouchableOpacity
                      key={method.id}
                      style={[styles.item, isSelected && styles.selectedItem]}
                      onPress={() => toggleMethod(method)}
                    >
                      <Feather
                        name={isSelected ? "check-square" : "square"}
                        size={20}
                        color="#555"
                      />
                      <Text
                        style={[
                          styles.itemText,
                          isSelected && {
                            color: colors.primary,
                            fontWeight: "bold",
                          },
                        ]}
                      >
                        {method.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={resetMethods}
                style={[styles.footerButton, styles.resetButton]}
              >
                <Text
                  style={[styles.footerButtonText, { color: colors.primary }]}
                >
                  Reset
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.footerButton}>
                <Text style={styles.footerButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onSave(selectedMethods); // ✅ saves the whole object(s)
                  setSelectedMethods([]);
                  onClose();
                }}
                style={[
                  styles.footerButton,
                  styles.saveButton,
                  selectedMethods.length <= 0 && { opacity: 0.5 },
                ]}
                disabled={selectedMethods.length <= 0}
              >
                <Text
                  style={[
                    styles.footerButtonText,
                    { fontWeight: "bold", color: colors.primary },
                  ]}
                >
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PaymentMethodSelector;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.primary,
    height: "100%",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: colors.white2,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#1e1e1e",
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: colors.accent,
  },
  itemText: {
    marginLeft: 12,
    fontSize: 15,
    color: colors.white,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  footerButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
    backgroundColor: "#2d2d2d",
  },
  resetButton: {
    backgroundColor: colors.red,
  },
  saveButton: {
    backgroundColor: colors.accent,
  },
  footerButtonText: {
    fontSize: 16,
    color: colors.white,
  },
});
