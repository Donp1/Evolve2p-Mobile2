import { colors } from "@/constants";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface pageProps {
  status: string;
}
export default function KycSuccess({ status }: pageProps) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://img.icons8.com/color/96/000000/checked--v1.png",
        }}
        style={styles.successIcon}
      />
      <Text style={styles.title}>Verification Successful</Text>
      <Text style={styles.subtitle}>
        Thank you! Your identity has been verified.
      </Text>

      <View style={styles.infoBox}>
        <Text
          style={[
            styles.value,
            { color: status === "completed" ? "#4CAF50" : "#FF9800" },
            { textAlign: "center" },
          ]}
        >
          {status}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  successIcon: {
    width: 96,
    height: 96,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 30,
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#2e7d32",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
