import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useUserStore } from "@/store/userStore";
import { colors } from "@/constants";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { ms, s } from "react-native-size-matters";
import { router } from "expo-router";
import { priceFormater } from "@/utils/countryStore";
import { io, Socket } from "socket.io-client";

const { width } = Dimensions.get("window");

const NewTrade = () => {
  const user = useUserStore((state) => state.user);
  const [currentTrades, setCurrentTrades] = useState<any[]>([]);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    if (!socketRef.current) {
      socketRef.current = io("https://evolve2p-backend.onrender.com", {
        query: { userId: user.id },
        transports: ["websocket"],
      });
    }

    const socket = socketRef.current;

    const handleNewMessage = (msg: any) => {
      setCurrentTrades((prev) => [msg, ...prev]);
    };

    socket.on("new_trade", handleNewMessage);

    return () => {
      socket.off("new_trade", handleNewMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]);

  const tradesToShow = useMemo(() => {
    return (
      user?.tradesAsSeller
        ?.filter((trade: any) => trade?.status === "PENDING")
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ) || []
    );
  }, [user?.tradesAsSeller]);

  useEffect(() => {
    setCurrentTrades(tradesToShow);
  }, [tradesToShow]);

  if (currentTrades.length === 0) return null;

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={{ width }}
    >
      {currentTrades.map((trade) => (
        <View style={styles.page} key={trade.id}>
          <View style={styles.container}>
            {/* Top Row */}
            <View style={styles.top}>
              <View style={styles.topLeft}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#002E52" }]}
                >
                  <Ionicons name="notifications" size={15} color={"#4DAAF2"} />
                </View>
                <Text style={styles.newTradeText}>New trade request</Text>
              </View>

              <View style={styles.iconContainer}>
                <EvilIcons
                  name="close"
                  size={15}
                  style={{ color: colors.secondary }}
                />
              </View>
            </View>

            {/* Message */}
            <Text style={styles.tradeText}>
              @{trade?.buyer?.username ?? "Unknown"} wants to buy{" "}
              {priceFormater(trade?.amountFiat || 0)}{" "}
              {trade?.offer?.currency ?? ""} ({trade?.amountCrypto ?? 0}{" "}
              {trade?.offer?.crypto ?? ""}) from your Ad.
            </Text>

            {/* Action */}
            <Pressable onPress={() => router.push(`/process-trade/${trade?.id}`)}>
              <Text style={styles.viewRequest}>View Request</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default NewTrade;

const styles = StyleSheet.create({
  page: {
    width,
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
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: colors.gray,
    width: 25,
    height: 25,
  },
  newTradeText: {
    color: "#33A2FF",
    fontWeight: "500",
    fontSize: ms(14),
  },
  tradeText: {
    alignSelf: "center",
    marginLeft: 30,
    lineHeight: 18,
    color: colors.secondary,
    fontWeight: "700",
    fontSize: ms(12),
  },
  viewRequest: {
    color: colors.accent,
    marginHorizontal: 30,
    marginTop: 10,
  },
});
