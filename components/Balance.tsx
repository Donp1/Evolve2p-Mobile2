import React, { useMemo } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SelectedCurrency } from "./PreferedCurrency";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";

import { priceFormater } from "@/utils/countryStore";
import { usePrices } from "@/hooks/usePrices";

interface BalanceItem {
  amount: number;
  crypto: string;
}

interface TotalBalanceProps {
  data: BalanceItem[];
  currency: SelectedCurrency | null | undefined;
  lockCurrency: boolean;
  refreshing?: boolean;
}

const TotalBalance: React.FC<TotalBalanceProps> = ({
  data,
  currency,
  lockCurrency,
  refreshing,
}) => {
  const {
    data: priceData,
    isLoading,
    error,
    refetch,
  } = usePrices(currency?.code);

  // When pull-to-refresh occurs
  React.useEffect(() => {
    if (refreshing) refetch();
  }, [refreshing]);

  const total = useMemo(() => {
    if (!priceData || !data) return 0;

    return data.reduce((acc, item) => {
      const price = priceData[item.crypto.toUpperCase()] ?? 0;
      return acc + item.amount * price;
    }, 0);
  }, [priceData, data]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="small" color={colors.secondary} />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text style={styles.errorText}>Failed to fetch prices</Text>
      </View>
    );
  }

  return (
    <View>
      {lockCurrency ? (
        <Text style={styles.hidden}>****</Text>
      ) : (
        <Text style={styles.value}>
          {currency?.symbol || "$"} {priceFormater(total, { style: "short" })}
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
