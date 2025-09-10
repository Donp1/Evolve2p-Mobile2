import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Image } from "expo-image";
import { colors } from "@/constants";
import { Feather, FontAwesome } from "@expo/vector-icons";
import TotalBalance from "./Balance";
import { ms } from "react-native-size-matters";
import { useUserStore } from "@/store/userStore";
import PreferedCurrency, {
  SelectedCurrency,
} from "@/components/PreferedCurrency";

interface PageProps {
  lockCurrency: boolean;
  setLockCurrency: Dispatch<SetStateAction<boolean>>;
  setPreferedCoinVisible: Dispatch<SetStateAction<boolean>>;
  setSelectedCurrency: Dispatch<
    SetStateAction<SelectedCurrency | null | undefined>
  >;
  selectedCurrency: SelectedCurrency | null | undefined;
  preferedCoinVisible: boolean;
  refreshing?: boolean;
}

const BalanceViewer = ({
  lockCurrency,
  setLockCurrency,
  selectedCurrency,
  setPreferedCoinVisible,
  preferedCoinVisible,
  setSelectedCurrency,
  refreshing,
}: PageProps) => {
  const user = useUserStore((state: any) => state.user);
  const [myBalances, setMyBalances] = useState<
    { crypto: string; amount: number }[]
  >([]);

  useEffect(() => {
    (async () => {
      if (!user || !selectedCurrency) return;

      const balances = user?.wallets?.map((w: any) => ({
        amount: Number(w?.balance),
        crypto: String(w?.currency).toUpperCase(),
      }));

      setMyBalances(balances);
    })();
  }, [user, selectedCurrency]);
  return (
    <>
      <View style={styles.balance}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text
            style={{
              fontWeight: 400,
              fontSize: ms(16),
              color: colors.gray3,
            }}
          >
            Available Balance
          </Text>
          <Pressable style={{}} onPress={() => setLockCurrency((c) => !c)}>
            {lockCurrency ? (
              <Feather
                name="eye-off"
                size={ms(16)}
                color={colors.secondary}
                style={{ marginLeft: 10 }}
              />
            ) : (
              <Feather
                name="eye"
                size={ms(16)}
                color={colors.secondary}
                style={{ marginLeft: 10 }}
              />
            )}
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TotalBalance
            lockCurrency={lockCurrency}
            currency={selectedCurrency}
            data={myBalances}
            refreshing={refreshing}
          />
          <Pressable
            onPress={() => setPreferedCoinVisible((c) => !c)}
            style={{
              backgroundColor: colors.gray2,
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderRadius: 100,
              gap: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={{
                uri: selectedCurrency?.flag,
              }}
              style={{ width: 20, height: 20, borderRadius: 10 }}
            />

            <Text
              style={{
                fontWeight: 700,
                fontSize: ms(14),
                color: colors.secondary,
              }}
            >
              {selectedCurrency?.code.toUpperCase()}
            </Text>
            <FontAwesome
              name="chevron-down"
              size={ms(12)}
              color={colors.secondary}
            />
          </Pressable>
        </View>
      </View>
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
    // paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray2,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray2,
    marginVertical: 20,
  },
});
