import { Pressable, StyleSheet, Text, View } from "react-native";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Image } from "expo-image";
import { colors } from "@/constants";
import { Feather, FontAwesome } from "@expo/vector-icons";
import TotalBalance from "./Balance";
import { ms } from "react-native-size-matters";
import { useUserStore } from "@/store/userStore";
import PreferedCurrency, {
  SelectedCurrency,
} from "@/components/PreferedCurrency";
import { useCoins, useCoinStore } from "@/context";

interface Wallet {
  balance: number | string;
  currency: string;
}

interface PageProps {
  lockCurrency: boolean;
  setLockCurrency: Dispatch<SetStateAction<boolean>>;
  refreshing?: boolean;
}

const BalanceViewer = ({
  refreshing,
  lockCurrency,
  setLockCurrency,
}: PageProps) => {
  const user = useUserStore((state: any) => state.user);

  const [preferedCoinVisible, setPreferedCoinVisible] = useState(false);
  const setCoin = useCoins((state) => state.setCoin);
  const { coins, fetchCoins } = useCoinStore();
  const [selectedCurrency, setSelectedCurrency] = useState<
    SelectedCurrency | null | undefined
  >(null);

  // Safer derived balances (only recomputes when user or selectedCurrency changes)
  const myBalances = useMemo(() => {
    if (!user?.wallets || !selectedCurrency) return [];
    return user.wallets
      .filter((w: Wallet) => w?.currency)
      .map((w: Wallet) => ({
        amount: Number(w.balance) || 0,
        crypto: String(w.currency).toUpperCase(),
      }));
  }, [user?.wallets, selectedCurrency]);

  return (
    <>
      <View style={styles.balance}>
        {/* Label + Toggle Visibility */}
        <View style={styles.row}>
          <Text style={styles.label}>Available Balance</Text>
          <Pressable onPress={() => setLockCurrency((c) => !c)} hitSlop={8}>
            <Feather
              name={lockCurrency ? "eye-off" : "eye"}
              size={ms(16)}
              color={colors.secondary}
              style={styles.eyeIcon}
            />
          </Pressable>
        </View>

        {/* Total Balance + Currency Selector */}
        <View style={styles.rowBetween}>
          <TotalBalance
            lockCurrency={lockCurrency}
            currency={selectedCurrency}
            data={myBalances}
            refreshing={refreshing}
          />
          <Pressable
            onPress={() => setPreferedCoinVisible((c) => !c)}
            style={styles.currencyButton}
            hitSlop={6}
          >
            {selectedCurrency?.flag && (
              <Image
                source={{ uri: selectedCurrency.flag }}
                style={styles.flag}
              />
            )}
            <Text style={styles.currencyText}>
              {selectedCurrency?.code?.toUpperCase() ?? "--"}
            </Text>
            <FontAwesome
              name="chevron-down"
              size={ms(12)}
              color={colors.secondary}
            />
          </Pressable>
        </View>
      </View>

      {/* Modal for currency selection */}
      <PreferedCurrency
        visible={preferedCoinVisible}
        onSelect={setSelectedCurrency}
        onClose={() => setPreferedCoinVisible(false)}
      />
    </>
  );
};

export default BalanceViewer;

const styles = StyleSheet.create({
  balance: {
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: colors.gray2,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray2,
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "400",
    fontSize: ms(16),
    color: colors.gray3,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  currencyButton: {
    backgroundColor: colors.gray2,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 100,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  flag: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  currencyText: {
    fontWeight: "700",
    fontSize: ms(14),
    color: colors.secondary,
  },
});
