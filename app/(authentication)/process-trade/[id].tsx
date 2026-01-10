import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";
import Spinner from "@/components/Spinner";
import { colors } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { ms, s } from "react-native-size-matters";
import StepOne from "@/components/processTrade/StepOne";
import {
  cancelTrade,
  fetchPrices,
  getChats,
  getTrade,
} from "@/utils/countryStore";
import { isArray } from "lodash";
import { useAlert } from "@/components/AlertService";
import StepTwo from "@/components/processTrade/StepTwo";
import StepThree from "@/components/processTrade/StepThree";
import ChatView from "@/components/ChatView";
import { io } from "socket.io-client";
import { useUserStore } from "@/store/userStore";
import DisputeView from "@/components/DisputeView";
import ChatModal from "@/components/TestChatView";

const socket = io("https://evolve2p-backend.onrender.com");

const goBack = () => {
  if (router.canGoBack()) router.back();
};

const ProcessTrade = () => {
  const { id: tradeId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [currentTrade, setCurrentTrade] = useState<any>();
  const [activeTab, setActiveTab] = useState("step-one");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isOpenDispute, setIsOpenDispute] = useState(false);
  const [isOpenChat, setIsOpenChat] = useState(false);
  const { AlertComponent, showAlert } = useAlert();
  const [messages, setMessages] = useState<any>([]);
  const [type, setType] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const user = useUserStore((state) => state.user);

  // listen for new messages
  const handleNewMessage = (msg: any) => {
    setMessages((prev: any) => {
      // Avoid duplicates by id
      const exists = prev.find((m: any) => m.id === msg.id);
      if (exists) return prev;
      return [...prev, msg];
    });
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getTrade(isArray(tradeId) ? tradeId[0] : tradeId);

      if (res?.error) {
        showAlert(
          "Error",
          res?.message,
          [{ text: "Close", onPress() {} }],
          "error"
        );
        setLoading(false);
        return;
      }

      if (res?.success) {
        setCurrentTrade(res?.data);
        const myChats = await getChats(res?.data?.chat?.id);
        setMessages(myChats);
        setLoading(false);
      }
    })();
  }, [tradeId]);

  useEffect(() => {
    if (!currentTrade) return;
    (async () => {})();
  }, [currentTrade]);

  useEffect(() => {
    if (!currentTrade) return;

    const chatId = currentTrade?.chat?.id;

    // join the chat room once
    socket.emit("join_chat", chatId);
    socket.emit("join_trade", currentTrade?.id);

    socket.on("new_message", handleNewMessage);

    socket.on("new_trade", (trade: any) => {
      setCurrentTrade(trade);
    });

    // cleanup only when unmounting or chatId changes
    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("new_trade", (trade: any) => {
        // setCurrentTrade(trade);
      });
      socket.emit("leave_chat", chatId); // optional: tell server you left chat
      socket.emit("leave_trade", currentTrade?.id); // optional: tell server you left trade
    };
  }, [currentTrade]);

  useEffect(() => {
    if (!currentTrade) return;

    const myType = currentTrade?.buyerId == user?.id ? "buyer" : "seller";

    setType(myType);
  }, [currentTrade]);

  useEffect(() => {
    if (currentTrade?.status == "PENDING") {
      setActiveTab("step-one");
    } else if (
      currentTrade?.status == "PAID" ||
      currentTrade?.status == "DISPUTED"
    ) {
      setActiveTab("step-two");
    } else if (
      currentTrade?.status == "COMPLETED" ||
      currentTrade?.status == "CANCELLED"
    ) {
      setActiveTab("step-three");
    }
  }, [currentTrade]);

  const handleCancle = async () => {
    setCancelling(true);
    const res = await cancelTrade(currentTrade?.id);
    setCancelling(false);

    if (res?.error) {
      showAlert(
        "Error",
        res?.message,
        [{ onPress() {}, text: "Close" }],
        "error"
      );
      return;
    }
    if (res?.success) {
      showAlert(
        "Success",
        res?.message,
        [
          {
            onPress() {
              setRefreshKey((k) => k + 1);
            },
            text: "Continue",
          },
        ],
        "success"
      );
    }
  };

  return (
    <>
      <SafeAreaView style={globalStyles.container}>
        {AlertComponent}
        {loading ? (
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
          <>
            {/* topbar */}
            <View style={globalStyles.topBar}>
              <Pressable
                onPress={goBack}
                style={{
                  padding: 15,
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <FontAwesome
                  name="chevron-left"
                  color={colors.secondary}
                  size={15}
                />
                {/* <Text
                  style={{
                    lineHeight: 24,
                    fontWeight: 500,
                    fontSize: ms(16),
                    color: colors.secondary,
                  }}
                >
                  {actionLabel} {currentOffer?.crypto}
                </Text> */}
              </Pressable>

              {currentTrade?.status == "CANCELLED"
                ? null
                : user?.id == currentTrade?.buyer?.id && (
                    <Pressable
                      onPress={() =>
                        showAlert(
                          "Cancel Trade?",
                          type == "seller"
                            ? `This will cancel your trade with @${currentTrade?.buyer?.username}. The crypto will be released from escrow, and you won’t be able to continue this transaction`
                            : `This will cancel your trade with @${currentTrade?.seller?.username}. The crypto will be released from escrow, and you won’t be able to continue this transaction`,
                          [
                            {
                              text: "Yes, Cancel Trade",
                              onPress: handleCancle,
                              style: { backgroundColor: "#FE857D" },
                              textStyle: { color: colors.primary },
                            },
                            {
                              text: "Keep Trade Open",
                              onPress() {},
                              style: { backgroundColor: "#2D2D2D" },
                            },
                          ],
                          "error"
                        )
                      }
                      disabled={
                        activeTab == "step-two" ||
                        activeTab == "step-three" ||
                        cancelling
                      }
                      style={{ padding: 15 }}
                    >
                      {cancelling ? (
                        <Spinner height={20} width={20} />
                      ) : (
                        <Text
                          style={[
                            {
                              fontSize: ms(14),
                              fontWeight: 700,
                              color: colors.white2,
                            },
                            (activeTab == "step-two" ||
                              activeTab == "step-three" ||
                              cancelling) && {
                              color: "#5C5C5C",
                            },
                          ]}
                        >
                          Cancel trade
                        </Text>
                      )}
                    </Pressable>
                  )}
            </View>
            {/* end of topbar */}

            <View
              style={{
                flex: 1,
                backgroundColor: colors.primary,
              }}
            >
              {/* tab bar */}
              <View style={styles.tabBar}>
                <Pressable
                  // onPress={() => setActiveTab("step-one")}
                  style={[
                    styles.tabBarItem,
                    activeTab === "step-one" && styles.tabBarItemActive,
                    completedSteps.includes("step-one") && {
                      borderBottomColor: colors.accent,
                    },
                    currentTrade?.status == "CANCELLED" && styles.tabBarItem,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBarItemText,
                      activeTab == "step-one" && { color: colors.accent },
                      completedSteps.includes("step-one") && {
                        color: colors.white2,
                      },
                      currentTrade?.status == "CANCELLED" &&
                        styles.tabBarItemText,
                    ]}
                  >
                    {type == "seller" ? "Awaiting" : "Pay"}
                  </Text>
                </Pressable>

                <Pressable
                  // onPress={() => setActiveTab("step-two")}
                  style={[
                    styles.tabBarItem,
                    activeTab === "step-two" && styles.tabBarItemActive,
                    completedSteps.includes("step-two") && {
                      borderBottomColor: colors.accent,
                    },
                    currentTrade?.status == "CANCELLED" && styles.tabBarItem,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBarItemText,
                      activeTab == "step-two" && { color: colors.accent },
                      completedSteps.includes("step-two") && {
                        color: colors.white2,
                      },
                      currentTrade?.status == "CANCELLED" &&
                        styles.tabBarItemText,
                    ]}
                  >
                    {type == "seller" ? "Release" : " In Review"}
                  </Text>
                </Pressable>

                <Pressable
                  // onPress={() => setActiveTab("step-three")}
                  style={[
                    styles.tabBarItem,
                    activeTab === "step-three" && styles.tabBarItemActive,
                    completedSteps.includes("step-three") && {
                      borderBottomColor: colors.accent,
                    },
                    currentTrade?.status == "CANCELLED" && styles.tabBarItem,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBarItemText,
                      activeTab == "step-three" && { color: colors.accent },
                      completedSteps.includes("step-three") && {
                        color: colors.white2,
                      },
                      currentTrade?.status == "CANCELLED" &&
                        styles.tabBarItemText,
                    ]}
                  >
                    Complete
                  </Text>
                </Pressable>
              </View>
              {/* end of tab bar */}

              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingBottom: 20,
                  // paddingHorizontal: 10,
                }}
              >
                {activeTab == "step-one" && (
                  <StepOne
                    type={type}
                    setActiveTab={setActiveTab}
                    setCompletedSteps={setCompletedSteps}
                    tradeId={isArray(tradeId) ? tradeId[0] : tradeId}
                    currentTrade={currentTrade}
                    setIsOpenChat={setIsOpenChat}
                  />
                )}
                {activeTab == "step-two" && (
                  <StepTwo
                    setActiveTab={setActiveTab}
                    setCompletedSteps={setCompletedSteps}
                    tradeId={isArray(tradeId) ? tradeId[0] : tradeId}
                    currentTrade={currentTrade}
                    setIsOpenChat={setIsOpenChat}
                    type={type}
                    setIsOpenDispute={setIsOpenDispute}
                    isOpenDispute={isOpenDispute}
                  />
                )}
                {activeTab == "step-three" && (
                  <StepThree
                    type={type}
                    setActiveTab={setActiveTab}
                    setCompletedSteps={setCompletedSteps}
                    tradeId={isArray(tradeId) ? tradeId[0] : tradeId}
                    currentTrade={currentTrade}
                    setIsOpenChat={setIsOpenChat}
                  />
                )}
              </ScrollView>
            </View>
          </>
        )}
      </SafeAreaView>
      <ChatView
        setActiveTab={setActiveTab}
        setCompletedSteps={setCompletedSteps}
        type={type}
        messages={messages}
        setMessages={setMessages}
        currentTrade={currentTrade}
        isOpen={isOpenChat}
        setIsOpen={setIsOpenChat}
      />

      {/* <ChatModal visible={isOpenChat} onClose={() => setIsOpenChat(false)} /> */}

      <DisputeView
        currentTrade={currentTrade}
        isOpen={isOpenDispute}
        setIsOpen={setIsOpenDispute}
        setRefreshKey={setRefreshKey}
        type={type}
      />
    </>
  );
};

export default ProcessTrade;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(5),
    backgroundColor: "#1a1a1a",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tabBarItem: {
    paddingVertical: s(10),
    paddingHorizontal: s(15),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  tabBarItemIndicator: {
    flex: 1,
    height: 2,
  },
  tabBarItemActive: {
    borderBottomColor: "#C7C7C7",
  },
  tabBarItemText: {
    fontSize: ms(16),
    color: "#5C5C5C",
    fontWeight: "500",
    lineHeight: 24,
    textAlign: "center",
  },
});
