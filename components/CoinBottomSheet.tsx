import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { CoinData, useCoinStore } from "@/context";
import BottomSheet from "./BottomSheet";
import { ms } from "react-native-size-matters";
import { colors } from "@/constants";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";

interface PageProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCoin: React.Dispatch<React.SetStateAction<CoinData>>;
  height: number;
}

const CoinBottomSheet = ({
  visible,
  setVisible,
  height,
  setSelectedCoin,
}: PageProps) => {
  const coins = useCoinStore((state) => state.coins);
  return (
    <BottomSheet setVisible={setVisible} visible={visible} height={height}>
      <Text
        style={{
          fontWeight: 500,
          fontSize: ms(16),
          lineHeight: 28,
          color: colors.white,
          marginTop: 20,
        }}
      >
        Select a Coin
      </Text>
      {coins.map((coin, index) => (
        <Pressable
          onPress={() => {
            setVisible(false);
            setSelectedCoin(coin);
          }}
          key={index}
          style={styles.coinContainer}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Image
              source={{ uri: coin.image }}
              style={{ width: ms(30), height: ms(30) }}
              contentFit="contain"
              transition={1000}
            />
            <View>
              <Text
                style={{
                  color: colors.white2,
                  fontSize: ms(14),
                  fontWeight: 700,
                }}
              >
                {coin.name}
              </Text>
            </View>
          </View>
          <FontAwesome
            name="chevron-right"
            size={ms(16)}
            color={colors.white}
          />
        </Pressable>
      ))}
    </BottomSheet>
  );
};

export default CoinBottomSheet;

const styles = StyleSheet.create({
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.gray2,
    borderRadius: 10,
    marginVertical: 8,
  },
});
