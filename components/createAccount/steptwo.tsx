import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { Dispatch, SetStateAction, useState } from "react";
import { Feather } from "@expo/vector-icons";
import CreateContainer from "./CreateContainer";

type pageProp = {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  setStepCount: Dispatch<SetStateAction<number>>;
};

const PasswordCondition = ({
  text,
  condition,
}: {
  text: string;
  condition?: boolean;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Feather
        style={{ fontWeight: 200 }}
        name="check-circle"
        color={condition ? "green" : colors.secondary}
        size={14}
      />
      <Text style={{ color: colors.secondary, fontWeight: 200, fontSize: 14 }}>
        {text}
      </Text>
    </View>
  );
};

const StepTwo = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  setStepCount,
}: pageProp) => {
  const handlePress = () => {
    setStepCount(3);
  };

  const uppercaseRegex = /(?=.*[A-Z])/i;
  const lowercaseRegex = /(?=.*[a-z])/i;
  const numberRegex = /^(?=.*\d).*$/;
  const specialCharacterRegex = /(?=.*[@#$%^&*!])/i;

  const [passwordIsSecure, setPasswordIsSecure] = useState(true);
  const [confirmPasswordIsSecure, setConfirmPasswordIsSecure] = useState(true);

  return (
    <CreateContainer
      heading="Create a password"
      text="Create a strong password to protect your trades and funds."
    >
      <View style={[styles.form, { paddingTop: 20 }]}>
        <Text style={styles.formLabel}>Password</Text>
        <View
          style={[
            styles.formInputContainer,
            password.length > 0
              ? uppercaseRegex.test(password) &&
                lowercaseRegex.test(password) &&
                numberRegex.test(password) &&
                specialCharacterRegex.test(password) &&
                password.length >= 6
                ? {
                    borderColor: "green",
                    borderWidth: 1,
                  }
                : {
                    borderColor: "red",
                    borderWidth: 1,
                  }
              : null,
          ]}
        >
          <TextInput
            placeholder="Enter your password"
            style={[styles.formInput]}
            inputMode="text"
            placeholderTextColor={colors.secondary}
            defaultValue={password}
            onChangeText={(e) => setPassword(e)}
            secureTextEntry={passwordIsSecure}
          />
          <Pressable onPress={() => setPasswordIsSecure((current) => !current)}>
            {passwordIsSecure ? (
              <Feather name="eye-off" style={styles.eye} />
            ) : (
              <Feather name="eye" style={styles.eye} />
            )}
          </Pressable>
        </View>
      </View>

      <View style={{ paddingVertical: 10, gap: 10, marginBottom: 20 }}>
        <PasswordCondition
          condition={password.length >= 6}
          text="Minimum of 6 characters"
        />
        <PasswordCondition
          condition={numberRegex.test(password)}
          text="At least 1 number"
        />
        <PasswordCondition
          condition={specialCharacterRegex.test(password)}
          text="At least 1 special character"
        />
        <PasswordCondition
          condition={
            uppercaseRegex.test(password) && lowercaseRegex.test(password)
          }
          text="1 uppercase and 1 lowercase"
        />
      </View>

      <View style={styles.form}>
        <Text style={styles.formLabel}>Confirm Password</Text>
        <View
          style={[
            styles.formInputContainer,
            password.length > 0
              ? password === confirmPassword
                ? { borderColor: "green", borderWidth: 1 }
                : { borderColor: "red", borderWidth: 1 }
              : null,
          ]}
        >
          <TextInput
            placeholder="Re-enter your password"
            style={styles.formInput}
            inputMode="text"
            placeholderTextColor={colors.secondary}
            defaultValue={confirmPassword}
            onChangeText={(e) => setConfirmPassword(e)}
            secureTextEntry={confirmPasswordIsSecure}
          />
          <Pressable
            onPress={() => setConfirmPasswordIsSecure((current) => !current)}
          >
            {confirmPasswordIsSecure ? (
              <Feather name="eye-off" style={styles.eye} />
            ) : (
              <Feather name="eye" style={styles.eye} />
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Pressable
          onPress={handlePress}
          disabled={
            !uppercaseRegex.test(password) ||
            !lowercaseRegex.test(password) ||
            !numberRegex.test(password) ||
            !specialCharacterRegex.test(password) ||
            password.length < 6 ||
            password !== confirmPassword
          }
          style={[
            styles.btn,
            !uppercaseRegex.test(password) ||
            !lowercaseRegex.test(password) ||
            !numberRegex.test(password) ||
            !specialCharacterRegex.test(password) ||
            password.length < 6 ||
            password !== confirmPassword
              ? { opacity: 0.5 }
              : {},
          ]}
        >
          <Text style={styles.btnText}>Continue</Text>
        </Pressable>
      </View>
    </CreateContainer>
  );
};

export default StepTwo;

const styles = StyleSheet.create({
  eye: {
    color: colors.secondary,
    fontWeight: 500,
    fontSize: 16,
    padding: 10,
  },
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
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  formInput: {
    flex: 1,
    color: colors.secondary,
    fontSize: 14,
    fontWeight: 200,
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
});
