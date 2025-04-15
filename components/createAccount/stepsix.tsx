import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "@/constants";
import { Image } from "expo-image";
import { ms } from "react-native-size-matters";
import CreateContainer from "./CreateContainer";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useAlert } from "../AlertService";

const StepSix = () => {
  const [modalShow, setModalShow] = useState(false);

  const { AlertComponent, showAlert } = useAlert();

  const lists = [
    "Verification Status (Approved or Rejected)",
    "Your Full Legal Name",
    "Year of Birth",
    "City & Country of Issuance",
    "ID Type & Issuing Authority",
    "A Secure, Redacted Copy of Your ID (No sensitive details are shared)",
  ];
  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={{ flex: 1, paddingBottom: 20 }}>
        {AlertComponent}
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{}}>
            <Image
              style={{ width: ms(100), height: ms(100) }}
              source={require("@/assets/images/onfido2.png")}
              contentFit="contain"
              priority={"high"}
            />
          </View>
        </View>

        <CreateContainer
          heading="Verify Your Identity"
          text="For security and compliance, we need to verify your identity before you can start trading."
        >
          <View style={styles.box}>
            <Text
              style={{
                fontWeight: 500,
                fontSize: ms(14),
                lineHeight: 20,
                color: colors.secondary,
              }}
            >
              Required for regulations
            </Text>
            <Text
              style={{
                fontWeight: 400,
                fontSize: ms(12),
                lineHeight: 18,
                color: colors.secondary,
              }}
            >
              We are required to verify your identify.
            </Text>
          </View>
          <View style={styles.box}>
            <Text
              style={{
                fontWeight: 500,
                fontSize: ms(14),
                lineHeight: 20,
                color: colors.secondary,
              }}
            >
              We value your privacy
            </Text>
            <Text
              style={{
                fontWeight: 400,
                fontSize: ms(12),
                lineHeight: 18,
                color: colors.secondary,
              }}
            >
              This helps us protect your Evolve2p account. See{" "}
              <Link href="/" style={{ color: "#4DF2BE" }}>
                privacy policy
              </Link>
            </Text>
          </View>

          <Pressable
            style={{ marginTop: 20 }}
            onPress={() => setModalShow(true)}
          >
            <Text
              style={{ color: "#4DF2BE", fontWeight: 700, fontSize: ms(14) }}
            >
              How does this works?
            </Text>
          </Pressable>

          <Modal animationType="slide" transparent visible={modalShow}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#0F1012",
                padding: 20,
                gap: 12,
              }}
            >
              <Text
                style={{
                  fontWeight: 700,
                  color: colors.white2,
                  fontSize: ms(20),
                }}
              >
                How verifying your identity works
              </Text>
              <Text
                style={{
                  fontWeight: 400,
                  color: colors.white,
                  fontSize: ms(16),
                }}
              >
                To verify your identity, Onfido will ask you to scan a
                government-issued ID (Passport, Driver’s License, or National
                ID).
              </Text>
              <Text
                style={{
                  fontWeight: 400,
                  color: colors.white,
                  fontSize: ms(16),
                }}
              >
                For security and compliance, Evolve2p will receive:
              </Text>
              {lists.map((list) => (
                <View
                  key={list}
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    paddingHorizontal: 10,
                  }}
                >
                  <FontAwesome name="dot-circle-o" color={colors.white} />
                  <Text
                    style={{
                      fontWeight: 400,
                      color: colors.white,
                      fontSize: ms(12),
                    }}
                  >
                    {list}
                  </Text>
                </View>
              ))}
              <Text
                style={{
                  fontWeight: 400,
                  color: colors.white,
                  fontSize: ms(16),
                }}
              >
                This process ensures a safe and trusted trading experience for
                all users.
              </Text>
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <Text
                  style={{
                    fontWeight: 400,
                    color: colors.white,
                    fontSize: ms(16),
                  }}
                >
                  Learn more about
                </Text>
                <Image
                  style={{
                    width: ms(100),
                    height: ms(20),
                    resizeMode: "contain",
                  }}
                  source={require("@/assets/images/onfido2.png")}
                  contentFit="contain"
                  priority={"high"}
                  contentPosition={"center"}
                />
              </View>
              <View
                style={{
                  marginVertical: "auto",
                  flex: 1,
                  justifyContent: "flex-end",
                }}
              >
                <Pressable
                  onPress={() => setModalShow(false)}
                  style={[styles.btn, { backgroundColor: colors.gray2 }]}
                >
                  <Text
                    style={{
                      fontWeight: 700,
                      fontSize: ms(14),
                      color: colors.secondary,
                    }}
                  >
                    Go back
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </CreateContainer>
        <View
          style={{
            gap: 10,
            marginVertical: "auto",
            flex: 1,
            justifyContent: "flex-end",
            paddingHorizontal: 20,
          }}
        >
          <View style={[styles.btn, { backgroundColor: "#4DF2BE" }]}>
            <Text
              style={{ fontWeight: 700, fontSize: ms(14), color: "#0F1012" }}
            >
              Verify with
            </Text>

            <Image
              style={{
                width: ms(100),
                height: ms(20),
                resizeMode: "contain",
              }}
              source={require("@/assets/images/onfido2.png")}
              contentFit="contain"
              priority={"high"}
              contentPosition={"center"}
            />
          </View>
          <View style={[styles.btn, { backgroundColor: colors.gray2 }]}>
            <Text
              style={{
                fontWeight: 700,
                fontSize: ms(14),
                color: colors.secondary,
              }}
            >
              Not now
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default StepSix;

const styles = StyleSheet.create({
  box: {
    borderRadius: 8,
    padding: 12,
    gap: 8,
    backgroundColor: colors.gray2,
    marginTop: 20,
  },
  btn: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
