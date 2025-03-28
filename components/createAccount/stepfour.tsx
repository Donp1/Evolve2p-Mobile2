import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import CreateContainer from "./CreateContainer";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import SelectDropdown, { DataProp } from "../SelectDropdown";
import { isValidPhoneNumber } from "libphonenumber-js";
type pageProps = {
  setStepCount: React.Dispatch<React.SetStateAction<number>>;
  setSelectedCountry: React.Dispatch<React.SetStateAction<DataProp | null>>;
  selectedCountry: DataProp | null;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  username: string;
};
const StepFour = ({
  setStepCount,
  selectedCountry,
  setSelectedCountry,
  phoneNumber,
  setPhoneNumber,
  username,
  setUsername,
}: pageProps) => {
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const handlePhoneNumber = useCallback((e: string) => {
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
  }, []);

  return (
    <CreateContainer
      heading="Complete Your Profile"
      text="This helps personalize your experience."
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
                defaultValue={username}
              />
            </View>
            <View style={styles.formContainerBottom}>
              <Text
                style={{
                  fontSize: ms(12),
                  fontWeight: 400,
                  color: "green",
                  lineHeight: 20,
                }}
              >
                Username available
              </Text>
            </View>
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
            onPress={() => alert("hello")}
            disabled={!username || !selectedCountry?.name || !phoneNumber}
            style={[
              styles.btn,
              !username || !selectedCountry?.name || !phoneNumber
                ? { opacity: 0.5 }
                : null,
            ]}
          >
            <Text style={styles.btnText}>Continue</Text>
          </Pressable>
        </View>
      </View>
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
