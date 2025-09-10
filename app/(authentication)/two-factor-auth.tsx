import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "@/utils/globalStyles";
import Home from "@/components/twoFactor/Home";
import Methods from "@/components/twoFactor/Methods";
import App from "@/components/twoFactor/App";
import SMS from "@/components/twoFactor/SMS";
import AppSecurity from "@/components/twoFactor/AppSecurity";
import { getItemAsync } from "expo-secure-store";
import AppCode from "@/components/twoFactor/AppCode";
import { SafeAreaView } from "react-native-safe-area-context";

const TwofactorAuth = () => {
  const [selectedRoute, setSelectedRoute] = useState("home");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [qrd, setQrd] = useState("");
  const [secret, setSecret] = useState("");

  return (
    <SafeAreaView style={globalStyles.container}>
      {selectedRoute == "home" && (
        <Home
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
        />
      )}
      {selectedRoute == "methods" && (
        <Methods
          selectedMethod={selectedMethod}
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
        />
      )}
      {selectedRoute == "app" && (
        <App
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          setQrd={setQrd}
          setSecret={setSecret}
        />
      )}
      {selectedRoute == "sms" && (
        <SMS
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
        />
      )}

      {selectedRoute == "app-security" && (
        <AppSecurity
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          secret={secret}
          qrd={qrd}
        />
      )}
      {selectedRoute == "code" && (
        <AppCode
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
        />
      )}
    </SafeAreaView>
  );
};

export default TwofactorAuth;

const styles = StyleSheet.create({});
