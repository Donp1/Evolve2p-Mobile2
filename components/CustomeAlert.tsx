import React, { FC } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export type AlertType = "success" | "error" | "info";

interface Button {
  text: string;
  onPress: () => void;
  style?: object;
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: Button[];
  onClose: () => void;
  alertType: AlertType; // New prop to specify the alert type
}

const CustomAlert: FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons,
  onClose,
  alertType,
}) => {
  // Define styles and icons based on the alert type
  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case "success":
        return {
          container: styles.successContainer,
          button: styles.successButton,
          title: styles.successTitle,
          buttonText: styles.successButtonText,
          icon: <FontAwesome name="check-circle" size={50} color="#28a745" />, // Success icon
          messageText: { color: "#28a745" },
        };
      case "error":
        return {
          container: styles.errorContainer,
          button: styles.errorButton,
          title: styles.errorTitle,
          buttonText: styles.errorButtonText,
          icon: <MaterialIcons name="error" size={50} color="#dc3545" />, // Error icon
          messageText: { color: "#dc3545" },
        };
      default:
        return {
          container: styles.infoContainer,
          button: styles.infoButton,
          title: styles.infoTitle,
          buttonText: styles.infoButtonText,
          icon: <MaterialIcons name="info" size={50} color="#17a2b8" />, // Info icon
          messageText: { color: "#17a2b8" },
        };
    }
  };

  const alertStyles = getAlertStyles(alertType);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.alertContainer, alertStyles.container]}>
          <View style={styles.iconContainer}>{alertStyles.icon}</View>
          <Text style={[styles.title, alertStyles.title]}>{title}</Text>
          <Text style={[styles.message, alertStyles.messageText]}>
            {message}
          </Text>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, alertStyles.button, button.style]}
                onPress={() => {
                  button.onPress();
                  onClose(); // Close alert after button press
                }}
              >
                <Text style={[styles.buttonText, alertStyles.buttonText]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  alertContainer: {
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  // Success style
  successContainer: {
    // backgroundColor: "#d4edda",
    backgroundColor: "black",
  },
  successButton: {
    backgroundColor: "#28a745",
  },
  successTitle: {
    color: "#155724",
  },
  successButtonText: {
    color: "#ffffff",
  },
  // Error style
  errorContainer: {
    backgroundColor: "black",
  },
  errorButton: {
    backgroundColor: "#dc3545",
  },
  errorTitle: {
    color: "#721c24",
  },
  errorButtonText: {
    color: "#ffffff",
  },
  // Info style
  infoContainer: {
    backgroundColor: "black",
  },
  infoButton: {
    backgroundColor: "#17a2b8",
  },
  infoTitle: {
    color: "#0c5460",
  },
  infoButtonText: {
    color: "#ffffff",
  },
});

export default CustomAlert;
