import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CreateContainer from "./CreateContainer";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import SelectDropdown from "../SelectDropdown";
import { isValidPhoneNumber } from "libphonenumber-js";
import { checkUsernamExist } from "@/utils/countryStore";
import Spinner from "../Spinner";
import { useAlert } from "../AlertService";
import { CountryDataProp } from "@/context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type pageProps = {
  setStepCount: React.Dispatch<React.SetStateAction<number>>;
  setSelectedCountry: React.Dispatch<
    React.SetStateAction<CountryDataProp | null>
  >;
  selectedCountry: CountryDataProp | null;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setRegIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  regIsLoading: boolean;
  username: string;
  handlFinalRegistration: () => Promise<void>;
};
const StepFour = ({
  setStepCount,
  selectedCountry,
  setSelectedCountry,
  phoneNumber,
  setPhoneNumber,
  username,
  setUsername,
  handlFinalRegistration,
  regIsLoading,
  setRegIsLoading,
}: pageProps) => {
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userExist, setUserExist] = useState(false);

  const { AlertComponent, showAlert } = useAlert();

  const handlePhoneNumber = (e: string) => {
    let isNumberValid = false;
    if (selectedCountry?.name !== "") {
      isNumberValid = isValidPhoneNumber(e, {
        defaultCallingCode: selectedCountry?.phoneCode,
        defaultCountry: selectedCountry?.abbrev,
      });
    }
    setPhoneNumber(e);
    setIsPhoneValid(isNumberValid);

    if (isNumberValid) {
    }
  };

  const handleUsername = async () => {
    setIsLoading(true);
    try {
      const res = await checkUsernamExist(username);
      if (res?.success) {
        showAlert(
          "Error",
          res?.message,
          [{ text: "Close", onPress: () => {} }],
          "error"
        );
        setUserExist(true);
        setIsLoading(false);
      }
    } catch (error) {
      showAlert(
        "Error",
        String(error),
        [{ text: "Close", onPress: () => {} }],
        "error"
      );
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async () => {
    if (!username || !selectedCountry?.name || !phoneNumber || !isPhoneValid) {
      showAlert(
        "Error",
        "Please fill all fields correctly",
        [{ text: "Close", onPress: () => {} }],
        "error"
      );
      return;
    }

    setRegIsLoading(true);

    try {
      await handlFinalRegistration();
      setRegIsLoading(false);
    } catch (error) {
      console.log(error);
      setRegIsLoading(false);
    }
  };

  return (
    <CreateContainer
      heading="Complete Your Profile"
      text="This helps personalize your experience."
    >
      {AlertComponent}
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View style={[styles.form, { marginTop: 20, flex: 1 }]}>
          <View style={{ gap: 10 }}>
            <Text style={styles.formLabel}>Username</Text>
            <View style={styles.formContainer}>
              <View style={styles.formInputContainer}>
                <Text
                  style={{
                    color: colors.secondary,
                    fontWeight: 400,
                    fontSize: ms(14),
                  }}
                >
                  @
                </Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.secondary}
                  onChangeText={(e) => setUsername(e)}
                  onBlur={handleUsername}
                  onSubmitEditing={handleUsername}
                  defaultValue={username}
                  editable={isLoading ? false : true}
                />
              </View>
              {username != "" && (
                <View style={styles.formContainerBottom}>
                  {isLoading && !userExist ? (
                    <Spinner width={20} height={20} />
                  ) : (
                    <Text
                      style={{
                        fontSize: ms(12),
                        fontWeight: 400,
                        color: userExist ? "red" : "green",
                        lineHeight: 20,
                      }}
                    >
                      {userExist ? "Username taken" : "Username available"}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <Text style={styles.formLabel}>Country</Text>

            <SelectDropdown
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
          </View>

          <View style={{ gap: 10 }}>
            <Text style={styles.formLabel}>Phone number</Text>
            <View
              style={[
                styles.phonenumberContainer,
                phoneNumber !== ""
                  ? !isPhoneValid
                    ? { borderWidth: 1, borderColor: "red" }
                    : { borderWidth: 1, borderColor: "green" }
                  : null,
              ]}
            >
              {selectedCountry?.name && (
                <View style={styles.phoneCode}>
                  <Text style={styles.phoneCodeText}>
                    {selectedCountry?.phoneCode}
                  </Text>
                </View>
              )}

              <TextInput
                placeholder="Enter Phone number"
                placeholderTextColor={colors.secondary}
                style={[styles.phoneInput]}
                keyboardType="phone-pad"
                defaultValue={phoneNumber}
                onChangeText={(e) => handlePhoneNumber(e)}
                editable={selectedCountry?.name == "" ? false : true}
              />
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <Pressable
              onPress={handleRegistration}
              disabled={
                !username ||
                !selectedCountry?.name ||
                !phoneNumber ||
                !isPhoneValid ||
                regIsLoading
              }
              style={[
                styles.btn,
                !username ||
                !selectedCountry?.name ||
                !phoneNumber ||
                !isPhoneValid ||
                regIsLoading
                  ? { opacity: 0.5 }
                  : null,
              ]}
            >
              {regIsLoading ? (
                <Spinner width={20} height={20} />
              ) : (
                <Text style={styles.btnText}>Continue</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </CreateContainer>
  );
};

export default StepFour;

const styles = StyleSheet.create({
  form: {
    display: "flex",
    gap: 10,
  },
  formLabel: {
    fontWeight: 200,
    color: colors.secondary,
    fontSize: ms(14),
    lineHeight: 24,
  },
  formInputContainer: {
    backgroundColor: colors.gray2,
    paddingHorizontal: 10,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  formContainer: {
    display: "flex",
    borderRadius: 8,
    overflow: "hidden",
  },
  formContainerBottom: {
    marginVertical: "auto",
    backgroundColor: colors.gray,
    paddingVertical: 4,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  formInput: {
    flex: 1,
    color: colors.secondary,
    fontSize: ms(14),
    fontWeight: 500,
  },
  bottomContainer: {
    marginVertical: "auto",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    flex: 1,
  },
  btn: {
    backgroundColor: "#4DF2BE",
    width: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    paddingVertical: 12,
  },
  btnText: {
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: 1,
    color: colors.primary,
  },
  link: {
    fontWeight: 700,
    color: colors.secondary,
    fontSize: 14,
  },
  phonenumberContainer: {
    backgroundColor: colors.gray2,
    height: ms(56),
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  phoneCode: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.gray,
    borderRadius: 100,
  },
  phoneCodeText: {
    color: colors.secondary,
    fontWeight: 400,
  },
  phoneInput: {
    flex: 1,
    color: colors.secondary,
    fontWeight: 400,
  },
});
