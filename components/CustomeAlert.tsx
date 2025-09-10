import React, { FC } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import {
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";

export type AlertType = "success" | "error" | "info";

interface Button {
  text: string;
  onPress: () => void;
  style?: ViewStyle; // individual button background/container style
  textStyle?: TextStyle; // individual button text style
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: Button[];
  onClose: () => void;
  alertType: AlertType;
}

const CustomAlert: FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons,
  onClose,
  alertType,
}) => {
  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case "success":
        return {
          icon: (
            <MaterialCommunityIcons
              name="check-decagram"
              size={60}
              color="#00D26A"
            />
          ),
          titleColor: "#00D26A",
          messageColor: "#00D26A",
          buttonBg: "#00D26A",
          buttonTextColor: "#000000",
        };
      case "error":
        return {
          icon: <MaterialIcons name="error" size={60} color="#FF4D4F" />,
          titleColor: "#FFFFFF",
          messageColor: "#CCCCCC",
          buttonBg: "#FF4D4F",
          buttonTextColor: "#FFFFFF",
        };
      case "info":
      default:
        return {
          icon: <Feather name="info" size={60} color="#00BFFF" />,
          titleColor: "#FFFFFF",
          messageColor: "#CCCCCC",
          buttonBg: "#00BFFF",
          buttonTextColor: "#FFFFFF",
        };
    }
  };

  const stylesForType = getAlertStyles(alertType);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={globalStyles.container}>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <View style={styles.iconWrapper}>{stylesForType.icon}</View>
            <Text style={[styles.title, { color: stylesForType.titleColor }]}>
              {title}
            </Text>
            <Text
              style={[styles.message, { color: stylesForType.messageColor }]}
            >
              {message}
            </Text>

            <View style={styles.buttonContainer}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    !button.style && {
                      backgroundColor: stylesForType.buttonBg,
                    },
                    button.style,
                  ]}
                  onPress={() => {
                    button.onPress();
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      !button.textStyle && {
                        color: stylesForType.buttonTextColor,
                      },
                      button.textStyle,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    minHeight: "50%",
    justifyContent: "center",
  },
  iconWrapper: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 25,
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomAlert;
