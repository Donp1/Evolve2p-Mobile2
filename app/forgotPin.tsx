import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { globalStyles } from "@/utils/globalStyles";
import { colors } from "@/constants";
import { Link, router } from "expo-router";
import CreateContainer from "@/components/createAccount/CreateContainer";
import { ms } from "react-native-size-matters";
import Spinner from "@/components/Spinner";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPin = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordIsSecure, setPasswordIsSecure] = useState(true);

  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  const handleLogin = async () => {
    setIsLoading(true);
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={globalStyles.topBar}>
        <Pressable onPress={goBack} style={{ padding: 15 }}>
          <FontAwesome name="chevron-left" color={colors.secondary} size={15} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <CreateContainer
          heading="Reset Security PIN"
          text="For your security, please enter your account password to reset your PIN."
        >
          <View style={[globalStyles.form, { paddingTop: 20 }]}>
            <Text style={globalStyles.formLabel}>Password</Text>
            <View style={[globalStyles.formInputContainer]}>
              <TextInput
                placeholder="Enter your password"
                style={[globalStyles.formInput]}
                inputMode="text"
                placeholderTextColor={colors.white}
                defaultValue={password}
                onChangeText={(e) => setPassword(e)}
                secureTextEntry={passwordIsSecure}
              />
              <Pressable
                onPress={() => setPasswordIsSecure((current) => !current)}
              >
                {passwordIsSecure ? (
                  <Feather name="eye-off" style={globalStyles.eye} />
                ) : (
                  <Feather name="eye" style={globalStyles.eye} />
                )}
              </Pressable>
            </View>
          </View>

          <Link href="/resetPassword" asChild>
            <Pressable
              style={{
                width: "100%",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                marginVertical: 10,
              }}
            >
              <Text
                style={{
                  color: colors.secondary,
                  fontWeight: 700,
                  fontSize: ms(14),
                }}
              >
                Forgot password
              </Text>
            </Pressable>
          </Link>

          <View style={globalStyles.bottomContainer}>
            <Pressable
              disabled={isLoading || !password}
              onPress={handleLogin}
              style={[
                globalStyles.btn,
                (isLoading || !password) && { opacity: 0.5 },
                { marginVertical: 20 },
              ]}
            >
              <Text style={globalStyles.btnText}>
                {isLoading ? <Spinner width={20} height={20} /> : "Continue"}
              </Text>
            </Pressable>
          </View>
        </CreateContainer>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPin;

const styles = StyleSheet.create({});
