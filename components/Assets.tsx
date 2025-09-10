import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { priceFormater } from "@/utils/countryStore";
import { useUserStore } from "@/store/userStore";
import Spinner from "./Spinner";
import { useCoinStore } from "@/context";
import { colors } from "@/constants";
import { Image } from "expo-image";
import { ms } from "react-native-size-matters";

interface PageProps {
  lockCurrency: boolean;
}

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Assets = ({ lockCurrency }: PageProps) => {
  const { coins, fetchCoins, loading, error } = useCoinStore();
  const user = useUserStore((state: any) => state.user);

  return (
    <View style={{ marginTop: 10 }}>
      {loading ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Spinner width={40} height={40} />
        </View>
      ) : (
        <>
          {coins.map((coin, index) => (
            <View key={index} style={styles.coinContainer}>
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
                  style={{ width: ms(40), height: ms(40) }}
                  contentFit="contain"
                  transition={500}
                  priority={"high"}
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
                  <Text
                    style={{
                      color: colors.secondary,
                      fontWeight: 500,
                      fontSize: ms(10),
                    }}
                  >
                    {USDollar.format(parseFloat(String(coin.price)))}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexGrow: 1,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    color: colors.white2,
                    fontSize: ms(14),
                    fontWeight: 700,
                  }}
                >
                  {lockCurrency
                    ? "****"
                    : Number(
                        user?.wallets?.find(
                          (w: any) =>
                            String(w?.currency).toUpperCase() ==
                            coin.symbol?.toUpperCase()
                        )?.balance
                      ).toFixed(6)}
                </Text>
                <Text
                  style={{
                    color: colors.secondary,
                    fontWeight: 500,
                    fontSize: ms(12),
                  }}
                >
                  {lockCurrency
                    ? "****"
                    : "$" +
                      priceFormater(
                        Number(
                          coin.price *
                            user?.wallets?.find(
                              (w: any) =>
                                String(w?.currency).toUpperCase() ==
                                coin.symbol?.toUpperCase()
                            )?.balance
                        ),
                        { style: "short" }
                      )}
                </Text>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

export default Assets;

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
