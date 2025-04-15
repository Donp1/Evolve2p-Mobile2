import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { globalStyles } from "@/utils/globalStyles";
import { router } from "expo-router";
import { colors } from "@/constants";
import { FontAwesome } from "@expo/vector-icons";
import { ms } from "react-native-size-matters";

const EditProfile = () => {
  const goBack = () => {
    if (router.canGoBack()) router.back();
  };
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
            Edit Profile
          </Text>
        </Pressable>
        <Text
          style={{
            fontSize: ms(14),
            fontWeight: 700,
            color: colors.accent,
            paddingHorizontal: 15,
          }}
        >
          Save
        </Text>
      </View>
      <View style={{ paddingHorizontal: 15 }}>
        <View style={globalStyles.form}>
          <View style={{ gap: 10 }}>
            <Text style={globalStyles.formLabel}>Email</Text>
            <View style={globalStyles.formInputContainer}>
              <TextInput style={globalStyles.formInput} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});
