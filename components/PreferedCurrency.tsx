import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Fontisto } from "@expo/vector-icons";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setSelectedCurrency: (currency: string) => void;
  selectedCurrency: string;
}

const currencies = ["USD", "NGN", "BTC", "ETH"];

const PreferedCurrency = ({
  visible,
  setVisible,
  setSelectedCurrency,
  selectedCurrency,
}: Props) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <Pressable
        onPress={() => setVisible(false)}
        style={{
          flex: 1,
          justifyContent: "flex-end",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
      >
        <View
          style={{
            height: "50%",
            backgroundColor: "#222222",
            paddingHorizontal: 20,
            paddingTop: 10,
            width: "100%",
          }}
        >
          <Text
            style={{
              fontWeight: 700,
              fontSize: ms(18),
              lineHeight: 28,
              color: colors.white,
            }}
          >
            Select preferred currency
          </Text>
          {currencies.map((currency) => (
            <Pressable
              key={currency}
              onPress={() => {
                setSelectedCurrency(currency);
                setVisible(false);
              }}
              style={{
                marginVertical: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: ms(14),
                  lineHeight: 20,
                  color: colors.white2,
                }}
              >
                {currency}
              </Text>
              {currency === selectedCurrency ? (
                <Fontisto name="radio-btn-active" size={24} color="green" />
              ) : (
                <Fontisto name="radio-btn-passive" size={24} color="#5C5C5C" />
              )}
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

export default PreferedCurrency;

const styles = StyleSheet.create({});
