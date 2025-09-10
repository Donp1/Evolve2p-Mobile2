import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "@/utils/globalStyles";
import { colors } from "@/constants";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { ms } from "react-native-size-matters";
import { getItemAsync } from "expo-secure-store";
import { useUserStore } from "@/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";

const goBack = () => {
  if (router.canGoBack()) router.back();
};

const AccountVerification = () => {
  const user = useUserStore((state: any) => state.user);

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
            Verification
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.primary }}
      >
        <View style={{ paddingHorizontal: 15, marginVertical: 20 }}>
          <View style={globalStyles.sectionBox}>
            <View style={globalStyles.sectionMain}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  gap: 10,
                  flexDirection: "row",
                }}
              >
                <MaterialCommunityIcons
                  name="email-lock"
                  size={24}
                  color={colors.accent}
                />
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: ms(14),
                    color: colors.secondary,
                  }}
                >
                  Email Verification
                </Text>
                {!user?.emailVerified && (
                  <View
                    style={{
                      backgroundColor: "#3A3A3A",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: ms(12),
                        color: colors.red,
                      }}
                    >
                      Verified
                    </Text>
                  </View>
                )}
              </View>
              <View>
                {user?.emailVerified ? (
                  <View
                    style={{
                      backgroundColor: "#3A3A3A",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: ms(12),
                        color: colors.accent,
                      }}
                    >
                      Verified
                    </Text>
                  </View>
                ) : (
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={colors.white}
                  />
                )}
              </View>
            </View>
          </View>

          <View style={globalStyles.sectionBox}>
            <View style={globalStyles.sectionMain}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  gap: 10,
                  flexDirection: "row",
                }}
              >
                <Entypo name="mobile" size={24} color={colors.accent} />

                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: ms(14),
                    color: colors.secondary,
                  }}
                >
                  Phone Verification
                </Text>
              </View>
              <View>
                <View
                  style={{
                    backgroundColor: "#3A3A3A",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 16,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: ms(12),
                      color: colors.accent,
                    }}
                  >
                    Verified
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Pressable
            disabled={user?.kycVerified == true ? true : false}
            style={globalStyles.sectionBox}
            onPress={() => router.push("/kycVerification")}
          >
            <View style={globalStyles.sectionMain}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  gap: 10,
                  flexDirection: "row",
                }}
              >
                <FontAwesome5
                  name="user-check"
                  size={20}
                  color={colors.accent}
                />

                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: ms(14),
                    color: colors.secondary,
                  }}
                >
                  KYC Verification
                </Text>
                {!user?.kycVerified && (
                  <View
                    style={{
                      backgroundColor: "#3A3A3A",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: ms(12),
                        color: colors.red,
                      }}
                    >
                      Not Verified
                    </Text>
                  </View>
                )}
              </View>
              <View>
                {user?.kycVerified ? (
                  <View
                    style={{
                      backgroundColor: "#3A3A3A",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: ms(12),
                        color: colors.accent,
                      }}
                    >
                      Verified
                    </Text>
                  </View>
                ) : (
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={colors.white}
                  />
                )}
              </View>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountVerification;

const styles = StyleSheet.create({});
