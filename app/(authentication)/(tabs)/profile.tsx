import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { globalStyles } from "@/utils/globalStyles";
import { ms } from "react-native-size-matters";
import { colors } from "@/constants";
import { Image } from "expo-image";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import PreferedCurrency from "@/components/PreferedCurrency";
import { router } from "expo-router";

const ContentBox = ({
  icon,
  text,
  onPress,
  modify,
  modifyContent,
}: {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
  modify?: boolean;
  modifyContent?: React.ReactNode;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.sectionMain}>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        {icon}
        <Text
          style={{
            fontWeight: 500,
            fontSize: ms(14),
            color: colors.secondary,
          }}
        >
          {text}
        </Text>
      </View>
      {modify ? (
        modifyContent
      ) : (
        <MaterialIcons name="chevron-right" size={24} color={colors.white} />
      )}
    </Pressable>
  );
};

const Prifile = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [preferedCoinVisible, setPreferedCoinVisible] = useState(false);
  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.topBar, { padding: 10 }]}>
        <Text
          style={{ fontWeight: 500, fontSize: ms(16), color: colors.secondary }}
        >
          Profile
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 100 }}
      >
        <View style={styles.sectionBox}>
          <Pressable
            onPress={() => router.push("/edit-profile")}
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Image
                style={{ width: 30, height: 30, borderRadius: 30 / 2 }}
                source={require("@/assets/images/Logo2.png")}
                contentFit="contain"
                transition={1000}
              />
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: ms(14),
                      fontWeight: 500,
                      color: colors.white2,
                    }}
                  >
                    @david1234
                  </Text>
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={15}
                    color={colors.accent}
                  />
                </View>
                <Text
                  style={{
                    color: colors.secondary,
                    fontSize: ms(12),
                    fontWeight: 400,
                  }}
                >
                  Your unique Identity
                </Text>
              </View>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.white}
            />
          </Pressable>
        </View>

        <View style={globalStyles.divider} />

        <Text
          style={{
            fontWeight: 400,
            fontSize: ms(12),
            color: colors.gray3,
            marginTop: 10,
          }}
        >
          ACCOUNT
        </Text>

        <View style={styles.sectionBox}>
          <ContentBox
            onPress={() => {}}
            text="Account verification"
            icon={
              <FontAwesome5
                name="user-check"
                size={ms(13)}
                color={colors.accent}
              />
            }
          />
          <ContentBox
            onPress={() => {}}
            text="Notification"
            icon={
              <Ionicons
                name="notifications"
                size={ms(16)}
                color={colors.accent}
              />
            }
          />
          <ContentBox
            onPress={() => {}}
            text="Transaction Limits"
            icon={
              <MaterialCommunityIcons
                name="av-timer"
                size={ms(16)}
                color={colors.accent}
              />
            }
          />
          <ContentBox
            onPress={() => {}}
            text="Preferred currency"
            modify={true}
            modifyContent={
              <Pressable
                onPress={() => setPreferedCoinVisible((c) => !c)}
                style={{
                  backgroundColor: "#3A3A3A",
                  paddingVertical: 5,
                  paddingHorizontal: 14,
                  borderRadius: 100,
                  gap: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: 700,
                    fontSize: ms(14),
                    color: colors.secondary,
                  }}
                >
                  {selectedCurrency}
                </Text>
                <FontAwesome
                  name="chevron-down"
                  size={ms(12)}
                  color={colors.secondary}
                />
              </Pressable>
            }
            icon={
              <FontAwesome5
                name="money-bill-wave-alt"
                size={ms(13)}
                color={colors.accent}
              />
            }
          />
        </View>

        <Text
          style={{
            fontWeight: 400,
            fontSize: ms(12),
            color: colors.gray3,
            marginTop: 10,
          }}
        >
          SECURITY
        </Text>
        <View style={styles.sectionBox}>
          <ContentBox
            icon={
              <MaterialCommunityIcons
                name="lock-reset"
                size={ms(16)}
                color={colors.accent}
              />
            }
            text="Change Password"
            onPress={() => {}}
          />
          <ContentBox
            icon={
              <Image
                source={require("@/assets/images/locked.png")}
                contentFit="contain"
                style={{ width: ms(16), height: ms(16) }}
              />
            }
            text="Two Factor Authentication"
            onPress={() => {}}
          />
          <ContentBox
            icon={
              <Image
                source={require("@/assets/images/pin-code.png")}
                contentFit="contain"
                style={{ width: ms(16), height: ms(16) }}
              />
            }
            text="Change your Security PIN"
            onPress={() => {}}
          />
        </View>

        <Text
          style={{
            fontWeight: 400,
            fontSize: ms(12),
            color: colors.gray3,
            marginTop: 10,
          }}
        >
          OTHERS
        </Text>
        <View style={styles.sectionBox}>
          <ContentBox
            icon={
              <Image
                source={require("@/assets/images/globe.png")}
                contentFit="contain"
                style={{ width: ms(16), height: ms(16) }}
              />
            }
            text="App Language"
            onPress={() => {}}
          />
          <ContentBox
            icon={
              <Image
                source={require("@/assets/images/dark-mode.png")}
                contentFit="contain"
                style={{ width: ms(16), height: ms(16) }}
              />
            }
            text="Dark mode"
            onPress={() => {}}
          />
          <ContentBox
            icon={
              <Image
                source={require("@/assets/images/support.png")}
                contentFit="contain"
                style={{ width: ms(16), height: ms(16) }}
              />
            }
            text="Talk to support"
            onPress={() => {}}
          />
          <ContentBox
            icon={
              <Image
                source={require("@/assets/images/Logo-white.png")}
                contentFit="contain"
                style={{ width: ms(25), height: ms(25) }}
              />
            }
            text="About Evolv2p"
            onPress={() => {}}
          />
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            marginTop: 30,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <AntDesign name="logout" size={ms(14)} color={colors.red} />
            <Text
              style={{ fontWeight: 700, fontSize: ms(14), color: colors.red }}
            >
              Log out
            </Text>
          </View>
          <Text
            style={{
              fontWeight: 500,
              fontSize: ms(14),
              color: colors.white,
            }}
          >
            V 1.0
          </Text>
        </View>
      </ScrollView>

      <PreferedCurrency
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        setVisible={setPreferedCoinVisible}
        visible={preferedCoinVisible}
      />
    </View>
  );
};

export default Prifile;

const styles = StyleSheet.create({
  sectionBox: {
    borderRadius: 8,
    backgroundColor: colors.gray2,
    padding: 10,
    marginTop: 10,
  },
  sectionMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: ms(15),
  },
});
