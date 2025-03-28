import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { PropsWithChildren, ReactNode } from "react";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";

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
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={() => Keyboard.dismiss()}
    >
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
    </TouchableWithoutFeedback>
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
    fontWeight: 200,
    color: colors.secondary,
    fontSize: ms(14),
    lineHeight: 24,
  },
});
