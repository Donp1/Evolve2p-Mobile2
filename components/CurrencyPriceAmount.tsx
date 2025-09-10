import { colors } from "@/constants";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { ms } from "react-native-size-matters";

type CryptoConverterProps = {
  amount: number; // Fiat amount
  currency: string; // Fiat currency code e.g. "NGN", "USD"
  coin: string; // Supported crypto coins
  style?: object;
};

const CryptoConverter: React.FC<CryptoConverterProps> = ({
  amount,
  currency,
  coin,
  style,
}) => {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch conversion rate only when currency or coin changes
  const fetchRate = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${getCoinId(
          coin?.toUpperCase()
        )}&vs_currencies=${currency.toLowerCase()}`
      );
      const data = await res.json();

      setRate(data[getCoinId(coin?.toUpperCase())][currency.toLowerCase()]);
    } catch (error) {
      console.error("Error fetching rate:", error);
    } finally {
      setLoading(false);
    }
  }, [currency, coin]);

  // Run only when currency or coin changes
  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const getCoinId = (symbol: string) => {
    const ids: Record<string, string> = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      USDC: "usd-coin",
    };
    return ids[symbol] || "";
  };

  const convertedValue = rate ? amount / rate : 0;

  return (
    <>
      {loading ? (
        <ActivityIndicator size="small" color={colors.secondary} />
      ) : rate ? (
        <Text style={[styles.text, style]}>
          {convertedValue.toFixed(6)} {coin?.toUpperCase()}
        </Text>
      ) : (
        <Text style={styles.error}>Failed to load rate</Text>
      )}
    </>
  );
};

// ≈

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  text: { fontWeight: 500, fontSize: ms(12), color: colors.gray3 },

  error: {
    fontSize: 14,
    color: "red",
  },
});

export default CryptoConverter;
