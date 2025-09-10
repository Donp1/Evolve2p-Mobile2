import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
// import { paymentMethodFields } from "@/config/paymentFields"; // adjust path if needed
import { colors, paymentMethodFields } from "@/constants";

type Props = {
  selectedMethod: string;
  formData: Record<string, string>;
  onChange: (fieldName: string, value: string) => void;
};

const PaymentMethodForm: React.FC<Props> = ({
  selectedMethod,
  formData,
  onChange,
}) => {
  const fields = paymentMethodFields[selectedMethod];

  if (!fields || fields.length === 0) {
    return (
      <Text style={styles.placeholder}>
        No extra details required for this method.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {fields.map((field) => (
        <View key={field.name} style={styles.inputGroup}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={field.placeholder || ""}
            value={formData[field.name] || ""}
            onChangeText={(text) => onChange(field.name, text)}
            placeholderTextColor="#999"
          />
        </View>
      ))}
    </View>
  );
};

export default PaymentMethodForm;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    color: colors.white2,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 12,
    color: colors.white,
    borderWidth: 1,
    borderColor: "#444",
  },
  placeholder: {
    color: "#ccc",
    fontStyle: "italic",
    fontSize: 14,
    marginTop: 10,
  },
});
