import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { ms, vs } from "react-native-size-matters";
import { colors } from "@/constants";
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles } from "@/utils/globalStyles";
import Spinner from "../Spinner";

interface StepThreeProps {
  terms: string;
  setTerms: (terms: string) => void;
  handleCreateAd: () => Promise<void>;
  loading: boolean;
}

const StepThree: React.FC<StepThreeProps> = ({
  terms,
  setTerms,
  handleCreateAd,
  loading,
}) => {
  return (
    <>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.subHeader}>
          Set clear instructions and an automatic greeting to enhance your
          trading experience.
        </Text>
      </View>

      <View style={{ marginTop: 20, gap: 5 }}>
        <Text style={styles.subHeader}>Terms (optional)</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            defaultValue={terms}
            onChangeText={(terms) => setTerms(terms)}
            style={styles.textArea}
            placeholder="Terms will be displayed to the counterparty"
            placeholderTextColor={colors.gray4}
            multiline
          />

          <View style={styles.textAreaBottom}>
            <Text style={[styles.subHeader, { fontSize: ms(12) }]}>0/500</Text>
          </View>
        </View>
      </View>

      {/* <View style={{ marginTop: 20, gap: 5 }}>
        <Text style={styles.subHeader}>Auto-Reply (optional)</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Terms will be displayed to the counterparty"
            placeholderTextColor={colors.gray4}
            multiline
          />

          <View style={styles.textAreaBottom}>
            <Text style={[styles.subHeader, { fontSize: ms(12) }]}>0/500</Text>
          </View>
        </View>
      </View> */}

      {/* read guide */}
      <Pressable
        style={{
          marginTop: 20,
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons name="menu-book" size={ms(16)} color={colors.accent} />
        <Text
          style={{
            fontSize: ms(14),
            fontWeight: 700,
            color: colors.accent,
          }}
        >
          Read our guide for creating crypto
        </Text>
      </Pressable>
      {/* end of read guide */}

      {/* submit button */}
      <Pressable
        onPress={handleCreateAd}
        disabled={loading}
        style={[
          globalStyles.btn,
          { marginTop: 20, marginBottom: 20, width: "100%" },
          loading && { opacity: 0.5 },
        ]}
      >
        {loading ? (
          <Spinner height={20} width={20} />
        ) : (
          <Text style={globalStyles.btnText}>Post your Ad</Text>
        )}
      </Pressable>
      {/* end of submit button */}
    </>
  );
};

export default StepThree;

const styles = StyleSheet.create({
  subHeader: {
    fontSize: ms(15),
    fontWeight: 400,
    lineHeight: 24,
    color: colors.gray4,
  },
  textAreaContainer: {
    backgroundColor: "#222222",
    borderRadius: 10,
    overflow: "hidden",
    height: vs(150),
  },
  textArea: {
    color: colors.gray4,
    fontWeight: "400",
    lineHeight: 24,
    fontSize: ms(12),
    paddingHorizontal: 10,
    flex: 1,
    // backgroundColor: "red",
    textAlignVertical: "top", // 👈 makes text start from the top
  },
  textAreaBottom: {
    backgroundColor: colors.gray2,
    height: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});
