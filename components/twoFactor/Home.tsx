import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { globalStyles } from "@/utils/globalStyles";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/constants";
import { router } from "expo-router";
import { ms, s, vs } from "react-native-size-matters";
import { Image } from "expo-image";

interface pageProps {
  selectedRoute: string;
  setSelectedRoute: Dispatch<SetStateAction<string>>;
}
const Home = ({ selectedRoute, setSelectedRoute }: pageProps) => {
  const goBack = () => {
    if (router.canGoBack()) router.back();
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
          >
            Two Factor Authentication
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Image
          priority={"high"}
          source={require("@/assets/images/two-factor.png")}
          contentFit="contain"
          style={{ width: ms(150), height: ms(150), marginBottom: vs(30) }}
        />
        <Text
          style={{
            fontSize: ms(20),
            fontWeight: 700,
            color: colors.white2,
            marginBottom: vs(10),
          }}
        >
          Security beyond passwords
        </Text>
        <Text
          style={{
            fontSize: ms(14),
            fontWeight: 400,
            color: colors.white,
            textAlign: "center",
            lineHeight: vs(20),
          }}
        >
          Get an extra layer of protection to your account when logging in and
          performing transactions.
        </Text>

        <Pressable
          onPress={() => setSelectedRoute("methods")}
          style={[globalStyles.btn, { marginTop: vs(50) }]}
        >
          <Text style={globalStyles.btnText}>Set up now</Text>
        </Pressable>
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: s(20),
    backgroundColor: colors.primary,
  },
});
