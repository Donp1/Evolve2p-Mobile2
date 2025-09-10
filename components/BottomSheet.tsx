import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Fontisto } from "@expo/vector-icons";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { globalStyles } from "@/utils/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  children?: React.ReactNode;
  height?: number;
}

const BottomSheet = ({ visible, setVisible, children, height }: Props) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <SafeAreaView style={globalStyles.container}>
        <Pressable
          // onPress={() => setVisible(false)}
          style={{
            flex: 1,
            justifyContent: "flex-end",
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <View
            style={{
              height: height ? `${height}%` : "50%",
              backgroundColor: "#222222",
              paddingHorizontal: 20,
              paddingTop: 10,
              width: "100%",
            }}
          >
            {children}
          </View>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({});
