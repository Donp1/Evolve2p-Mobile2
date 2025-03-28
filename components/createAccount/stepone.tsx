import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { colors } from "@/constants";
import { Link } from "expo-router";
import { ms } from "react-native-size-matters";
import { Dispatch, SetStateAction } from "react";
import CreateContainer from "./CreateContainer";

type pageProp = {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setStepCount: Dispatch<SetStateAction<number>>;
};

const StepOne = ({ email, setEmail, setStepCount }: pageProp) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handlePress = () => {
    if (emailRegex.test(email)) {
      setStepCount((current) => current + 1);
    }
  };
  return (
    <CreateContainer
      heading="Create account"
      text="Enter your email to start trading securely."
    >
      <View style={styles.form}>
        <Text style={styles.formLabel}>Email</Text>
        <View
          style={[
            styles.formInputContainer,
            !emailRegex.test(email) &&
              email.length > 0 && { borderColor: "red", borderWidth: 2 },
            emailRegex.test(email) && {
              borderColor: "green",
              borderWidth: 2,
            },
          ]}
        >
          <TextInput
            placeholder="Enter your email address"
            style={styles.formInput}
            inputMode="email"
            placeholderTextColor={colors.secondary}
            defaultValue={email}
            onChangeText={(e) => setEmail(e)}
          />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Pressable
          onPress={handlePress}
          disabled={!emailRegex.test(email)}
          style={[styles.btn, !emailRegex.test(email) && { opacity: 0.5 }]}
        >
          <Text style={styles.btnText}>Continue</Text>
        </Pressable>

        <View
          style={{
            width: "100%",
            alignItems: "center",
            gap: 20,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.secondary,
              fontSize: 14,
              lineHeight: 20,
              fontWeight: 200,
            }}
          >
            Already have an account?{" "}
          </Text>
          <Link style={styles.link} href={"/login"}>
            Log in
          </Link>
        </View>
        <View
          style={{
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              color: colors.secondary,
              fontWeight: 200,
              lineHeight: 20,
            }}
          >
            By creating an account you are agreeing to our {"\n"}
            <Link style={styles.link} href={"/register"}>
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link style={styles.link} href={"/register"}>
              Privacy Policy
            </Link>
          </Text>
        </View>
      </View>
    </CreateContainer>
  );
};

export default StepOne;

const styles = StyleSheet.create({
  form: {
    display: "flex",
    gap: 10,
    paddingTop: 20,
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
    paddingVertical: 5,
  },
  formInput: {
    width: "100%",
    color: colors.secondary,
    fontSize: 14,
    fontWeight: 200,
  },
  bottomContainer: {
    marginTop: "auto",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
