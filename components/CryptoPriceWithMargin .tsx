import { colors } from "@/constants";
import { priceFormater } from "@/utils/countryStore";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
} from "react-native";
import { ms, TextStyle } from "react-native-size-matters";

interface pageProps {
  coin: string;
  margin?: number;
  displayStyle?: object; // made optional to handle "empty"
  refresh?: number;
}

export default function CryptoPriceWithMargin({
  coin,
  margin,
  displayStyle,
  refresh,
}: pageProps) {
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch only when coin changes
  useEffect(() => {
    if (!coin) return;

    // const fetchPrice = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await fetch(
    //       "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd"
    //     );
    //     const data = await res.json();

    //     const cryptoMap = {
    //       BTC: "bitcoin",
    //       ETH: "ethereum",
    //       USDT: "tether",
    //       USDC: "usd-coin",
    //     };

    //     const cryptoId =
    //       cryptoMap[coin.toUpperCase() as keyof typeof cryptoMap];
    //     if (!cryptoId || !data[cryptoId]) {
    //       throw new Error("Invalid coin symbol or missing data.");
    //     }

    //     setBasePrice(data[cryptoId].usd);
    //   } catch (err) {
    //     console.error("Error fetching crypto price:", err);
    //     setBasePrice(null);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    const fetchPrice = async (maxRetries = 3, retryDelay = 1000) => {
      const cryptoMap: Record<string, string> = {
        BTC: "bitcoin",
        ETH: "ethereum",
        USDT: "tether",
        USDC: "usd-coin",
      };

      const cryptoId = cryptoMap[coin.toUpperCase()];
      if (!cryptoId) {
        console.error("Invalid coin symbol:", coin);
        setBasePrice(null);
        return;
      }

      let attempt = 0;

      const fetchData = async (): Promise<void> => {
        attempt++;
        try {
          setLoading(true);

          const res = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd`
          );

          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }

          const data = await res.json();

          if (!data[cryptoId]?.usd) {
            throw new Error("Price data not available for coin: " + cryptoId);
          }

          setBasePrice(data[cryptoId].usd);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

      await fetchData();
    };

    fetchPrice();
  }, [coin, refresh]); // Only fetch if coin changes

  // If margin is undefined, null, or 0 — just return the base price
  const adjustedPrice =
    basePrice !== null
      ? margin && margin !== 0
        ? basePrice + basePrice * (margin / 100)
        : basePrice
      : null;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={colors.secondary} />
      </View>
    );
  }

  return (
    <>
      {adjustedPrice ? (
        <Text style={[styles.subHeader, displayStyle]}>
          ${priceFormater(adjustedPrice, { style: "short" })}
        </Text>
      ) : (
        <Text style={styles.error}>Price unavailable</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  price: { fontSize: 18, fontWeight: "bold" },
  error: { fontSize: 16, color: "red" },
  subHeader: {
    fontSize: ms(15),
    fontWeight: "400",
    lineHeight: 24,
    color: colors.gray4,
  },
});
