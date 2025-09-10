import React, { useState } from "react";
import CustomAlert, { AlertType } from "./CustomeAlert";
import { ViewStyle, TextStyle } from "react-native";

// Define AlertButton to match CustomAlert's expected structure
type AlertButton = {
  text: string;
  onPress: () => void;
  style?: ViewStyle; // Optional button container style
  textStyle?: TextStyle; // Optional text style
};

// Create a custom hook for handling alerts
export const useAlert = () => {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState<{
    title: string;
    message: string;
    buttons: AlertButton[];
    alertType: AlertType;
  }>({
    title: "",
    message: "",
    buttons: [],
    alertType: "info",
  });

  const showAlert = (
    title: string,
    message: string,
    buttons: AlertButton[],
    alertType: AlertType = "info"
  ) => {
    setAlertProps({ title, message, buttons, alertType });
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const AlertComponent = (
    <CustomAlert
      visible={isAlertVisible}
      title={alertProps.title}
      message={alertProps.message}
      buttons={alertProps.buttons}
      onClose={hideAlert}
      alertType={alertProps.alertType}
    />
  );

  return {
    showAlert,
    AlertComponent,
  };
};
