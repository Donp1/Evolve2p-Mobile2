import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { PropsWithChildren, ReactNode } from "react";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";

type pageProp = {
  heading: string;
  text: string | ReactNode;
};

const CreateContainer = ({
  heading,
  text,
  children,
}: PropsWithChildren<pageProp>) => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View
            style={{
              paddingTop: 24,
              display: "flex",
              gap: 8,
            }}
          >
            <Text style={styles.topHeading}>{heading}</Text>
            <Text style={styles.topText}>{text}</Text>
          </View>

          {children}
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default CreateContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
  },
  topHeading: {
    fontWeight: 700,
    color: colors.secondary,
    fontSize: ms(24),
    lineHeight: 32,
  },
  topText: {
    fontWeight: 400,
    color: colors.white,
    fontSize: ms(14),
    lineHeight: 24,
  },
});
