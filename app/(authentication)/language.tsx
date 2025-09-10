import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/constants";
import { globalStyles } from "@/utils/globalStyles";
import { router } from "expo-router";
import { ms } from "react-native-size-matters";
import Switch from "@/components/Switch";
import { SafeAreaView } from "react-native-safe-area-context";

const goBack = () => {
  if (router.canGoBack()) router.back();
};

const Language = () => {
  const [loading, setLoading] = useState(false);
  const [selecteLanguage, setSelectedLanguage] = useState("English");

  const [language, setLanguage] = useState([
    "English",
    "French",
    "Spanish",
    "German",
    "Japanese",
    "Russian",
  ]);

  const handleUpdate = async () => {};

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
            Select a language
          </Text>
        </Pressable>
      </View>

      <ScrollView>
        <View style={{ paddingHorizontal: 15, marginVertical: 20 }}>
          {language.map((language, index) => (
            <Pressable
              onPress={() => setSelectedLanguage(language)}
              key={index}
              style={styles.listContainer}
            >
              <Text style={styles.listText}>{language}</Text>
              <View
                style={[
                  selecteLanguage == language
                    ? styles.radioSelected
                    : styles.radio,
                ]}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Language;

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  listText: {
    fontSize: ms(14),
    fontWeight: 500,
    color: colors.white2,
    lineHeight: 20,
    flex: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: colors.gray,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: colors.accent,
  },
});
