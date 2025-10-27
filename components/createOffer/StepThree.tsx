import React, { useMemo, useCallback } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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

const MAX_LENGTH = 500;

const StepThree: React.FC<StepThreeProps> = ({
  terms,
  setTerms,
  handleCreateAd,
  loading,
}) => {
  const charCount = useMemo(() => terms.length, [terms]);

  const handleTextChange = useCallback(
    (text: string) => {
      if (text.trim().length === 0 && text.length > 0) {
        // prevent only whitespace terms
        return;
      }
      if (text.length <= MAX_LENGTH) {
        setTerms(text);
      }
    },
    [setTerms]
  );

  return (
    <>
      {/* Intro */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>
          Set clear instructions and an automatic greeting to enhance your
          trading experience.
        </Text>
      </View>

      {/* Terms Input */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Terms (optional)</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            value={terms}
            onChangeText={handleTextChange}
            style={styles.textArea}
            placeholder="Terms will be displayed to the counterparty"
            placeholderTextColor={colors.gray4}
            multiline
            maxLength={MAX_LENGTH}
          />
          <View style={styles.textAreaBottom}>
            <Text style={styles.charCounter}>
              {charCount}/{MAX_LENGTH}
            </Text>
          </View>
        </View>
      </View>

      {/* Read Guide */}
      <Pressable style={styles.readGuide}>
        <MaterialIcons name="menu-book" size={ms(16)} color={colors.accent} />
        <Text style={styles.readGuideText}>
          Read our guide for creating crypto
        </Text>
      </Pressable>

      {/* Submit Button */}
      <Pressable
        onPress={handleCreateAd}
        disabled={loading}
        style={[
          globalStyles.btn,
          styles.submitBtn,
          loading && styles.disabledBtn,
        ]}
      >
        {loading ? (
          <Spinner height={20} width={20} />
        ) : (
          <Text style={globalStyles.btnText}>Post your Ad</Text>
        )}
      </Pressable>
    </>
  );
};

export default StepThree;

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  subHeader: {
    fontSize: ms(15),
    fontWeight: "400",
    lineHeight: 24,
    color: colors.gray4,
  },
  textAreaContainer: {
    backgroundColor: "#222222",
    borderRadius: 10,
    overflow: "hidden",
    height: vs(150),
    marginTop: 5,
  },
  textArea: {
    flex: 1,
    color: colors.gray4,
    fontWeight: "400",
    lineHeight: 24,
    fontSize: ms(12),
    paddingHorizontal: 10,
    paddingTop: 10,
    textAlignVertical: "top", // 👈 ensures text starts at top
  },
  textAreaBottom: {
    backgroundColor: colors.gray2,
    height: 30,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  charCounter: {
    fontSize: ms(12),
    color: colors.gray4,
  },
  readGuide: {
    marginTop: 20,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  readGuideText: {
    fontSize: ms(14),
    fontWeight: "700",
    color: colors.accent,
  },
  submitBtn: {
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
