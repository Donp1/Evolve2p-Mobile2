import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Fontisto } from "@expo/vector-icons";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  children?: React.ReactNode;
}

const BottomSheet = ({ visible, setVisible, children }: Props) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <Pressable
        onPress={() => setVisible(false)}
        style={{
          flex: 1,
          justifyContent: "flex-end",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
      >
        <View
          style={{
            height: "50%",
            backgroundColor: "#222222",
            paddingHorizontal: 20,
            paddingTop: 10,
            width: "100%",
          }}
        >
          {children}
        </View>
      </Pressable>
    </Modal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({});
