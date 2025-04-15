import React, { useState } from "react";
import CustomAlert, { AlertType } from "./CustomeAlert";

// Create a custom hook for handling alerts
export const useAlert = () => {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState<{
    title: string;
    message: string;
    buttons: { text: string; onPress: () => void }[];
    alertType: AlertType; // Add the alert type to the state
  }>({
    title: "",
    message: "",
    buttons: [],
    alertType: "info", // Default to 'info' type
  });

  const showAlert = (
    title: string,
    message: string,
    buttons: { text: string; onPress: () => void }[],
    alertType: AlertType = "info" // Default to 'info' if not provided
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
      alertType={alertProps.alertType} // Pass the alertType to CustomAlert
    />
  );

  return {
    showAlert,
    AlertComponent,
  };
};
