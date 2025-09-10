import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

type OfferLimits = {
  margin: string;
  minLimit: string;
  maxLimit: string;
};

type Props = {
  initialValues?: OfferLimits;
  onChangeAll: (data: OfferLimits) => void;
};

const OfferLimitsSection: React.FC<Props> = ({
  initialValues,
  onChangeAll,
}) => {
  const [margin, setMargin] = useState(initialValues?.margin || "");
  const [minLimit, setMinLimit] = useState(initialValues?.minLimit || "");
  const [maxLimit, setMaxLimit] = useState(initialValues?.maxLimit || "");

  useEffect(() => {
    onChangeAll({ margin, minLimit, maxLimit });
  }, [margin, minLimit, maxLimit]);

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Margin (%)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 5"
          keyboardType="numeric"
          value={margin}
          onChangeText={setMargin}
        />
        <Text style={styles.subText}>
          Positive = premium, Negative = discount
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.inputGroupHalf}>
          <Text style={styles.label}>Min Limit (USD)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 10"
            keyboardType="numeric"
            value={minLimit}
            onChangeText={setMinLimit}
          />
        </View>
        <View style={styles.inputGroupHalf}>
          <Text style={styles.label}>Max Limit (USD)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 1000"
            keyboardType="numeric"
            value={maxLimit}
            onChangeText={setMaxLimit}
          />
        </View>
      </View>
    </View>
  );
};

export default OfferLimitsSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
  },
  label: {
    color: "#ddd",
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#1c1c1e",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
    borderColor: "#333",
    borderWidth: 1,
  },
  subText: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputGroupHalf: {
    flex: 1,
  },
});
