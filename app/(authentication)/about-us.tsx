import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/constants";
import { globalStyles } from "@/utils/globalStyles";
import { router } from "expo-router";
import { ms, vs } from "react-native-size-matters";
import Switch from "@/components/Switch";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

const goBack = () => {
  if (router.canGoBack()) router.back();
};

const AboutUs = () => {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={globalStyles.container}>
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
            About Evolve2p
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.primary }}
      >
        <View style={{ marginVertical: 20, gap: 20 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.accent,
              height: vs(150),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("@/assets/images/logo-black.png")}
              style={styles.image}
              contentFit="contain"
              priority={"high"}
            />
          </View>

          <View style={{ paddingHorizontal: 15 }}>
            <View style={[globalStyles.sectionBox, { paddingVertical: 5 }]}>
              <View style={globalStyles.sectionMain}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("@/assets/images/file-settings.png")}
                    style={{
                      width: ms(14),
                      height: ms(14),
                    }}
                    contentFit="contain"
                  />
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: ms(14),
                      color: colors.white2,
                    }}
                  >
                    Privacy Policy
                  </Text>
                </View>
                <FontAwesome
                  name="chevron-right"
                  size={15}
                  color={colors.secondary}
                />
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: 15 }}>
            <View style={[globalStyles.sectionBox, { paddingVertical: 5 }]}>
              <View style={globalStyles.sectionMain}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("@/assets/images/file-settings.png")}
                    style={{
                      width: ms(14),
                      height: ms(14),
                    }}
                    contentFit="contain"
                  />
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: ms(14),
                      color: colors.white2,
                    }}
                  >
                    Terms of Service
                  </Text>
                </View>
                <FontAwesome
                  name="chevron-right"
                  size={15}
                  color={colors.secondary}
                />
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: 15 }}>
            <View style={[globalStyles.sectionBox, { paddingVertical: 5 }]}>
              <View style={globalStyles.sectionMain}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("@/assets/images/world.png")}
                    style={{
                      width: ms(14),
                      height: ms(14),
                    }}
                    contentFit="contain"
                  />
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: ms(14),
                      color: colors.white2,
                    }}
                  >
                    Learn more
                  </Text>
                </View>
                <FontAwesome
                  name="chevron-right"
                  size={15}
                  color={colors.secondary}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: ms(100),
    aspectRatio: 1,
  },
});
