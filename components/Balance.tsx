import { fetchPrices, formatNumber, priceFormater } from "@/utils/countryStore";
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
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

// Mock API to fetch crypto & FX prices (replace with real API call)
// const fetchPrices = async (
//   currency: string
// ): Promise<Record<string, number>> => {
//   try {
//     // Example mock prices in USD
//     const cryptoPricesUSD: Record<string, number> = {
//       BTC: 113500,
//       ETH: 4400,
//       USDT: 1,
//       USDC: 1,
//     };

//     // Mock FX rates
//     const fxRates: Record<string, number> = {
//       USD: 1,
//       NGN: 1600,
//       EUR: 0.92,
//     };

//     const fxRate = fxRates[currency.toUpperCase()] ?? 1;

//     // Convert crypto prices into requested currency
//     const prices: Record<string, number> = {};
//     Object.keys(cryptoPricesUSD).forEach((coin) => {
//       prices[coin] = cryptoPricesUSD[coin] * fxRate;
//     });

//     return prices;
//   } catch (error) {
//     console.error("Error fetching prices:", error);
//     return {};
//   }
// };

const TotalBalance: React.FC<TotalBalanceProps> = ({
  data,
  currency,
  lockCurrency,
  refreshing,
}) => {
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateTotal = async () => {
      setLoading(true);
      const prices = await fetchPrices(currency?.code || "usd");

      const totalValue = data.reduce((acc, item) => {
        const price = prices[item.crypto?.toUpperCase()] ?? 0;
        return acc + item.amount * price;
      }, 0);

      setTotal(totalValue);
      setLoading(false);
    };

    if (data.length > 0) {
      calculateTotal();
    } else {
      setTotal(0);
      setLoading(false);
    }
  }, [data, currency, refreshing == true]);

  if (loading || refreshing) {
    return (
      <View style={{}}>
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={{}}>
      {lockCurrency ? (
        <Text
          style={{
            fontWeight: 700,
            fontSize: ms(26),
            color: colors.white2,
          }}
        >
          ****
        </Text>
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
  label: {
    fontSize: 16,
    color: "#A0A0A0",
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default TotalBalance;
