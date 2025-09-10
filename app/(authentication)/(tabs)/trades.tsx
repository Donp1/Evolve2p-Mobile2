import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { globalStyles } from "@/utils/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ms, vs } from "react-native-size-matters";
import { useUserStore } from "@/store/userStore";
import { Image } from "expo-image";
import TradeView from "@/components/TradeView";
import Spinner from "@/components/Spinner";
import { getUser } from "@/utils/countryStore";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { usePathname, useRouter } from "expo-router";
import NotificationView from "@/components/NotificationView";

const Trades = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [activetrades, setActiveTrades] = useState<any[]>([]);
  const [completedTrades, setCompletedTrades] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState("active");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [key, setKey] = useState(0);

  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  const onRefresh = async () => {
    setRefreshing(true);

    const res = await getUser();
    const freshUser = res?.user;

    setUser(freshUser);

    setActiveTrades(
      [...freshUser?.tradesAsBuyer, ...freshUser?.tradesAsSeller]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .filter(
          (trade) =>
            trade?.status == "PENDING" ||
            trade?.status == "PAID" ||
            trade?.status == "DISPUTED"
        )
    );

    setCompletedTrades(
      [...freshUser?.tradesAsBuyer, ...freshUser?.tradesAsSeller]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .filter(
          (trade) =>
            trade?.status == "COMPLETED" || trade?.status == "CANCELLED"
        )
    );

    setRefreshing(false);
  };

  useEffect(() => {
    if (isFocused) {
      (async () => {
        setLoading(true);
        const res = await getUser();
        const freshUser = res?.user;

        setUser(freshUser);
        setLoading(false);

        setActiveTrades(
          [...freshUser?.tradesAsBuyer, ...freshUser?.tradesAsSeller]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .filter(
              (trade) =>
                trade?.status == "PENDING" ||
                trade?.status == "PAID" ||
                trade?.status == "DISPUTED"
            )
        );

        setCompletedTrades(
          [...freshUser?.tradesAsBuyer, ...freshUser?.tradesAsSeller]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .filter(
              (trade) =>
                trade?.status == "COMPLETED" || trade?.status == "CANCELLED"
            )
        );
      })();
    }
  }, [isFocused]);

  return (
    <>
      {loading || refreshing ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary,
          }}
        >
          <Spinner width={40} height={40} />
        </View>
      ) : (
        <SafeAreaView style={globalStyles.container}>
          {/* topbar */}
          <View
            style={[
              globalStyles.topBar,
              { paddingHorizontal: 20, paddingVertical: 10 },
            ]}
          >
            <Text
              style={{
                fontWeight: 500,
                fontSize: ms(16),
                color: colors.secondary,
              }}
            >
              Trade
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View style={styles.notiContainer}>
                <FontAwesome5
                  name="headset"
                  size={ms(17)}
                  color={colors.secondary}
                />
              </View>
              <NotificationView />
            </View>
          </View>
          {/* end of topbar */}

          <View
            style={{
              flex: 1,
              backgroundColor: colors.primary,
            }}
          >
            {/* tabBar */}
            <View style={styles.tabContainer}>
              <Pressable
                onPress={() => setSelectedTab("active")}
                style={[
                  styles.tab,
                  selectedTab == "active" && styles.activeTab,
                ]}
              >
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: ms(16),
                    color:
                      selectedTab == "active"
                        ? colors.white2
                        : colors.secondary,
                  }}
                >
                  Active
                </Text>
                <Text
                  style={{
                    borderRadius: 100,
                    backgroundColor:
                      selectedTab == "active" ? colors.accent : "#5C5C5C",
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    fontWeight: 500,
                    fontSize: ms(14),
                    color: selectedTab == "active" ? "#1A1A1A" : colors.gray4,
                  }}
                >
                  {activetrades.length}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSelectedTab("completed")}
                style={[
                  styles.tab,
                  selectedTab == "completed" && styles.activeTab,
                ]}
              >
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: ms(16),
                    color:
                      selectedTab == "completed"
                        ? colors.white2
                        : colors.secondary,
                  }}
                >
                  Completed
                </Text>
                <Text
                  style={{
                    borderRadius: 100,
                    backgroundColor:
                      selectedTab == "completed" ? colors.accent : "#5C5C5C",
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    fontWeight: 500,
                    fontSize: ms(14),
                    color:
                      selectedTab == "completed" ? "#1A1A1A" : colors.gray4,
                  }}
                >
                  {completedTrades.length}
                </Text>
              </Pressable>
            </View>
            {/* tabBar End */}

            <ScrollView
              key={key} // 👈 this forces remount when changed
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={false}
              style={{ flex: 1, marginTop: 10 }}
              contentContainerStyle={{
                paddingBottom: 100,
                backgroundColor: colors.primary,
                flexGrow: 1,
                paddingHorizontal: 10,
              }}
            >
              {selectedTab == "active" ? (
                <>
                  {activetrades.length <= 0 ? (
                    <View style={styles.noTradesContainer}>
                      <Image
                        priority={"high"}
                        style={styles.noTradesImage}
                        source={require("@/assets/images/tx-settings.png")}
                      />
                      <Text style={styles.noTradesText}>No Active Trades</Text>
                    </View>
                  ) : (
                    <View style={{ marginVertical: 20 }}>
                      {activetrades?.map((activeTrade) => (
                        <TradeView key={activeTrade?.id} trade={activeTrade} />
                      ))}
                    </View>
                  )}
                </>
              ) : (
                <>
                  {completedTrades.length <= 0 ? (
                    <View style={styles.noTradesContainer}>
                      <Image
                        priority={"high"}
                        style={styles.noTradesImage}
                        source={require("@/assets/images/tx-settings.png")}
                      />
                      <Text style={styles.noTradesText}>No Active Trades</Text>
                    </View>
                  ) : (
                    <View style={{ marginVertical: 20 }}>
                      {completedTrades?.map((completedTrade) => (
                        <TradeView
                          key={completedTrade?.id}
                          trade={completedTrade}
                        />
                      ))}
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default Trades;

const styles = StyleSheet.create({
  notiContainer: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.gray2,
  },
  tabContainer: {
    backgroundColor: colors.gray2,
    flexDirection: "row",
    borderRadius: 100,
    overflow: "hidden",
    marginTop: 20,
    marginHorizontal: 10,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: vs(40),
    borderRadius: 100,
  },
  activeTab: {
    backgroundColor: colors.gray,
  },

  noTradesContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  noTradesText: {
    fontSize: ms(14),
    fontWeight: 400,
    color: colors.gray4,
  },
  noTradesImage: {
    width: ms(100),
    height: ms(100),
  },
});
