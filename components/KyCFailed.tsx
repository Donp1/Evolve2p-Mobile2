import { colors } from "@/constants";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface pageProps {
  status: string;
}
export default function KycFailed({ status }: pageProps) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://img.icons8.com/color/96/000000/cancel--v1.png",
        }}
        style={styles.errorIcon}
      />
      <Text style={styles.title}>Verification Failed</Text>
      <Text style={styles.subtitle}>
        Unfortunately, we couldn't verify your identity. Please try again or
        contact support.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>{status}</Text>
      </View>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => router.push("/kycVerification")}
      >
        <Text style={styles.buttonText}>Retry Verification</Text>
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
  errorIcon: {
    width: 96,
    height: 96,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#d32f2f",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#fff",
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
    color: colors.red,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  retryButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: "#d32f2f",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
