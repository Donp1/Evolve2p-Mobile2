import React, { useMemo } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Image } from "expo-image";
import { ms } from "react-native-size-matters";

import { priceFormater } from "@/utils/countryStore";
import { useUserStore } from "@/store/userStore";
import { useCoinStore } from "@/context";
import Spinner from "./Spinner";
import { colors } from "@/constants";
import { usePrices } from "@/hooks/usePrices";

interface PageProps {
  lockCurrency: boolean;
}

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Assets = ({ lockCurrency }: PageProps) => {
  // 1️⃣ Coin metadata from Zustand
  const { coins: metaCoins } = useCoinStore();

  // 2️⃣ Live prices from TanStack Query
  const { data: livePrices, isLoading, error } = usePrices("USD");

  const user = useUserStore((state: any) => state.user);

  // 3️⃣ Build wallet lookup map
  const walletMap = useMemo(() => {
    if (!user?.wallets) return {};
    return user.wallets.reduce((map: Record<string, number>, w: any) => {
      map[w.currency?.toUpperCase()] = Number(w.balance) || 0;
      return map;
    }, {});
  }, [user?.wallets]);

  // 4️⃣ Merge coin metadata + live prices
  const mergedCoins = useMemo(() => {
    if (!metaCoins || !livePrices) return [];

    return metaCoins.map((coin) => {
      const symbol = coin.symbol.toUpperCase();
      return {
        ...coin,
        price: livePrices[symbol] ?? 0, // attach live price
      };
    });
  }, [metaCoins, livePrices]);

  const renderItem = ({ item: coin }: { item: any }) => {
    const symbol = coin.symbol.toUpperCase();

    const balance = walletMap[symbol] ?? 0;
    const usdValue = balance * coin.price;

    return (
      <View style={styles.coinContainer}>
        <View style={styles.leftContainer}>
          <Image
            source={{ uri: coin.image }}
            style={styles.coinImage}
            contentFit="contain"
            transition={200}
            priority="high"
          />
          <View>
            <Text style={styles.coinName}>{coin.name}</Text>
            <Text style={styles.coinPrice}>{USDollar.format(coin.price)}</Text>
          </View>
        </View>

        <View style={styles.rightContainer}>
          <Text style={styles.balanceText}>
            {lockCurrency ? "****" : balance.toFixed(6)}
          </Text>

          <Text style={styles.usdValue}>
            {lockCurrency
              ? "****"
              : "$" + priceFormater(usdValue, { style: "short" })}
          </Text>
        </View>
      </View>
    );
  };

  // Loading
  if (isLoading) {
    return (
      <View style={styles.spinnerContainer}>
        <Spinner width={40} height={40} />
      </View>
    );
  }

  // Error
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load live prices</Text>
      </View>
    );
  }

  return (
    <FlatList
      scrollEnabled={false}
      data={mergedCoins}
      keyExtractor={(coin) => coin.symbol}
      renderItem={renderItem}
      contentContainerStyle={{ paddingTop: 10 }}
    />
  );
};

export default Assets;

const styles = StyleSheet.create({
  spinnerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  errorText: {
    color: colors.secondary,
    fontSize: ms(12),
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.gray2,
    borderRadius: 10,
    marginVertical: 6,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  rightContainer: {
    flexGrow: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  coinImage: {
    width: ms(40),
    height: ms(40),
  },
  coinName: {
    color: colors.white2,
    fontSize: ms(14),
    fontWeight: "700",
  },
  coinPrice: {
    color: colors.secondary,
    fontSize: ms(10),
    fontWeight: "500",
  },
  balanceText: {
    color: colors.white2,
    fontSize: ms(14),
    fontWeight: "700",
  },
  usdValue: {
    color: colors.secondary,
    fontSize: ms(12),
    fontWeight: "500",
  },
});
