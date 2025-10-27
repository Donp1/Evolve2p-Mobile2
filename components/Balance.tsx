import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { fetchPrices, priceFormater } from "@/utils/countryStore";
import { SelectedCurrency } from "./PreferedCurrency";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";

// Types
interface BalanceItem {
  amount: number;
  crypto: string;
}

interface TotalBalanceProps {
  data: BalanceItem[];
  currency: SelectedCurrency | null | undefined; // e.g., "USD" | "NGN"
  lockCurrency: boolean;
  refreshing?: boolean;
}

const MAX_RETRIES = 3;

const TotalBalance: React.FC<TotalBalanceProps> = ({
  data,
  currency,
  lockCurrency,
  refreshing,
}) => {
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent state updates on unmounted component
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const calculateTotal = useCallback(async () => {
    if (!data?.length) {
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let attempts = 0;
    let prices: Record<string, number> = {};

    while (attempts < MAX_RETRIES) {
      try {
        prices = await fetchPrices(currency?.code || "usd");

        if (Object.keys(prices).length > 0) {
          break; // success
        }
      } catch (err: any) {
        attempts++;
        if (attempts >= MAX_RETRIES) {
          if (isMounted.current) {
            setError("Failed to fetch prices. Please try again.");
            setLoading(false);
          }
          return;
        }
        // Exponential backoff before retry
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempts))
        );
      }
    }

    const totalValue = data.reduce((acc, item) => {
      const price = prices[item.crypto?.toUpperCase()] ?? 0;
      return acc + item.amount * price;
    }, 0);

    if (isMounted.current) {
      setTotal(totalValue);
      setLoading(false);
    }
  }, [data, currency]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal, refreshing]);

  if (loading || refreshing) {
    return (
      <View>
        <ActivityIndicator size="small" color={colors.secondary} />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View>
      {lockCurrency ? (
        <Text style={styles.hidden}>****</Text>
      ) : (
        <Text style={styles.value}>
          {currency?.symbol || "$"}{" "}
          {priceFormater(total ?? 0, { style: "short" }) || "0.00"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  value: {
    fontSize: ms(22),
    fontWeight: "bold",
    color: colors.white2,
  },
  hidden: {
    fontWeight: "700",
    fontSize: ms(26),
    color: colors.white2,
  },
  errorText: {
    fontSize: ms(14),
    color: "red",
    fontWeight: "500",
  },
});

export default TotalBalance;
