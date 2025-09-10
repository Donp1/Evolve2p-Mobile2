import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { globalStyles } from "@/utils/globalStyles";
import { colors } from "@/constants";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { ms, s, vs } from "react-native-size-matters";
import { Image } from "expo-image";
import { formatSecretWithDashes } from "@/utils/countryStore";
import * as Clipboard from "expo-clipboard";

interface pageProps {
  selectedRoute: string;
  setSelectedRoute: Dispatch<SetStateAction<string>>;
}
const SmsSecurity = ({ setSelectedRoute }: pageProps) => {
  const goBack = () => {
    setSelectedRoute("methods");
  };

  return (
    <>
      <View style={globalStyles.topBar}>
        <Pressable
          onPress={goBack}
          style={{
            padding: 15,
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <FontAwesome name="chevron-left" color={colors.secondary} size={15} />
          <Text
            style={{
              lineHeight: 24,
              fontWeight: 500,
              fontSize: ms(16),
              color: colors.secondary,
            }}
          ></Text>
        </Pressable>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <Text
            style={{
              fontSize: ms(20),
              fontWeight: 700,
              color: colors.white2,
              marginBottom: vs(10),
            }}
          >
            Verify Your Phone Number
          </Text>
          <Text
            style={{
              fontSize: ms(12),
              fontWeight: 400,
              color: colors.secondary,
              lineHeight: 20,
            }}
          >
            We’ll send a 6-digit code to your phone.
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default SmsSecurity;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: vs(20),
    paddingHorizontal: s(20),
  },
});
