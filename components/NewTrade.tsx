import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { colors } from "@/constants";
import { Entypo, EvilIcons, Ionicons } from "@expo/vector-icons";
import { ms, s } from "react-native-size-matters";
import { Link, router } from "expo-router";
import BottomSheet from "./BottomSheet";
import { globalStyles } from "@/utils/globalStyles";
import { useCoinStore } from "@/context";
import { priceFormater } from "@/utils/countryStore";
import { Image } from "expo-image";
import TradeStatus from "./TradeStatus";
import { io } from "socket.io-client";

const { width } = Dimensions.get("window");

interface Country {
  cca2: string;
  flags: { png: string };
  currencies?: {
    [code: string]: { name: string; symbol: string };
  };
}

interface SelectedCurrency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const NewTrade = () => {
  const user = useUserStore((state) => state.user);
  const [currentTrades, setCurrentTrades] = useState<any[]>(
    user?.tradesAsSeller
  );

  const socket = io("https://evolve2p-backend.onrender.com", {
    query: { userId: user?.id },
  });

  useEffect(() => {
    setCurrentTrades(
      user?.tradesAsSeller?.filter((trade: any) => trade.status == "PENDING") ||
        []
    );
  }, [user?.tradesAsSeller]);

  useEffect(() => {
    const handleNewMessage = (msg: any) => {
      setCurrentTrades((prev: any) => [msg, ...prev]);
    };

    socket.on("new_trade", handleNewMessage);

    return () => {
      socket.off("new_trade", handleNewMessage);
    };
  }, []); // 👈 empty dependency array means this runs once
  return (
    <>
      <ScrollView
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ width: width }} // 👈 take full height
      >
        {currentTrades.length > 0 &&
          [...currentTrades]
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .filter((trade: any) => trade?.status === "PENDING") // filter only PENDING
            .map((trade: any) => (
              <View key={trade.id} style={styles.page}>
                <View style={styles.container}>
                  <View style={styles.top}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: "#002E52" },
                        ]}
                      >
                        <Ionicons
                          name="notifications"
                          size={15}
                          color={"#4DAAF2"}
                        />
                      </View>

                      <Text
                        style={{
                          color: "#33A2FF",
                          fontWeight: "500",
                          fontSize: ms(14),
                        }}
                      >
                        New trade request
                      </Text>
                    </View>
                    <View style={[styles.iconContainer]}>
                      <EvilIcons
                        name="close"
                        size={15}
                        style={{ color: colors.secondary }}
                      />
                    </View>
                  </View>

                  <Text
                    style={{
                      alignSelf: "center",
                      marginLeft: 30,
                      lineHeight: 18,
                      color: colors.secondary,
                      fontWeight: 700,
                      fontSize: ms(12),
                    }}
                  >
                    @{trade?.buyer?.username} wants to buy{" "}
                    {priceFormater(trade?.amountFiat)} {trade?.offer?.currency}{" "}
                    ({trade?.amountCrypto} {trade?.offer?.crypto}) from your Ad.
                  </Text>

                  <Pressable
                    onPress={() => {
                      router.push(`/process-trade/${trade?.id}`);
                    }}
                  >
                    <Text
                      style={{
                        color: colors.accent,
                        marginHorizontal: 30,
                        marginTop: 10,
                      }}
                    >
                      View Request
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
      </ScrollView>
    </>
  );
};

export default NewTrade;

const styles = StyleSheet.create({
  page: {
    width: width, // 👈 force each page to full screen width
    flex: 1,
  },
  container: {
    flex: 1,
    borderLeftWidth: 2,
    borderLeftColor: "#33A2FF",
    backgroundColor: "#1E303F",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    padding: 10,
    marginRight: s(15),
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: colors.gray,
    width: 25,
    height: 25,
  },
});
