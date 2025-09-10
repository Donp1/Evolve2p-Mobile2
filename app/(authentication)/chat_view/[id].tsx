import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { getChats, getTrade } from "@/utils/countryStore";
import { useAlert } from "@/components/AlertService";
import { isArray } from "lodash";
import io from "socket.io-client";
import { globalStyles } from "@/utils/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants";
import Spinner from "@/components/Spinner";
import { ms, s, vs } from "react-native-size-matters";
import { Entypo, Feather, FontAwesome, Octicons } from "@expo/vector-icons";

const socket = io("https://evolve2p-backend.onrender.com");

const goBack = () => {
  if (router.canGoBack()) router.back();
};

export function formatDateTime(createdAt: string | Date) {
  const date = new Date(createdAt);

  // Format time
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 -> 12
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
  const hoursStr = hours < 10 ? `0${hours}` : hours.toString();
  const timeStr = `${hoursStr}:${minutesStr} ${ampm}`;

  // Format date
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  const dateStr = date.toLocaleDateString(undefined, options); // e.g., "Aug 27, 2025"

  return `${dateStr} ${timeStr}`;
}

const userId = "";
const creatorId = "";
const ChatScreen = () => {
  const { id: chatId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [currentTrade, setCurrentTrade] = useState();
  const [messages, setMessages] = useState<any>([]);

  const { AlertComponent, showAlert } = useAlert();

  console.log(currentTrade);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const myChats = await getChats(isArray(chatId) ? chatId[0] : chatId);
      setLoading(false);
      setMessages(myChats);
      console.log(myChats);
    })();
  }, []);

  useEffect(() => {
    // join the chat
    socket.emit("join_chat", isArray(chatId) ? chatId[0] : chatId);

    // listen for new messages
    socket.on("new_message", (msg) => {
      console.log("📩 New message received:", msg);
      setMessages((prev: any) => [...prev, msg]);
    });

    return () => {
      socket.off("new_message"); // cleanup on unmount
    };
  }, [chatId]);

  return (
    <SafeAreaView style={globalStyles.container}>
      {AlertComponent}
      {loading ? (
        <View
          style={{
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Spinner width={40} height={40} />
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles.top}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View style={styles.icon}>
                  <Text
                    style={{
                      fontSize: ms(14),
                      fontWeight: 500,
                      color: colors.gray4,
                    }}
                  >
                    CB
                  </Text>
                </View>
                <Text
                  style={{
                    fontWeight: 600,
                    fontSize: ms(12),
                    color: colors.white2,
                  }}
                >
                  CryptoBoss
                </Text>
                <Octicons name="check-circle-fill" size={13} color="#4DF2BE" />
              </View>
              <Feather
                name="chevron-right"
                size={24}
                color={colors.secondary}
              />
            </View>

            <View style={styles.body}>
              <View style={styles.priceContainer}>
                <View>
                  <Text
                    style={{
                      fontWeight: 400,
                      fontSize: ms(12),
                      color: colors.secondary,
                    }}
                  >
                    FIAT AMOUNT
                  </Text>
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: ms(16),
                      color: colors.white2,
                    }}
                  >
                    200.00 USD
                  </Text>
                </View>
                <Pressable style={[globalStyles.btn, { width: "30%" }]}>
                  <Text style={globalStyles.btnText}>Paid</Text>
                </Pressable>
              </View>

              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingBottom: 100,
                  // flex: 1,
                  // paddingHorizontal: 10,
                }}
              >
                {messages
                  ?.sort(
                    (a: any, b: any) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  .map((message: any) => {
                    // 1️⃣ System message
                    if (message.type === "SYSTEM" && !message.senderId) {
                      return (
                        <View
                          key={message.id}
                          style={{ marginVertical: 10, alignItems: "center" }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                              flex: 1,
                            }}
                          >
                            <Text
                              style={{
                                color: colors.accent,
                                fontSize: ms(14),
                                fontWeight: "500",
                                marginBottom: 4,
                              }}
                            >
                              Service message
                            </Text>
                            <Text
                              style={{
                                color: colors.gray2,
                                fontSize: ms(12),
                                fontWeight: "400",
                                marginBottom: 4,
                              }}
                            >
                              {formatDateTime(message?.createdAt)}
                            </Text>
                          </View>
                          <View style={styles.serviceMessageContainer}>
                            <Text style={styles.serviceMessageText}>
                              {message.content}
                            </Text>
                          </View>
                        </View>
                      );
                    }

                    // 2️⃣ Message sent by current user
                    if (message.senderId === userId) {
                      return (
                        <View
                          key={message.id}
                          style={styles.userMessageContainer}
                        >
                          <Text style={styles.userMessageText}>
                            {message.content}
                          </Text>
                        </View>
                      );
                    }

                    // 3️⃣ Message sent by creator/other user
                    if (message.senderId === creatorId) {
                      return (
                        <View
                          key={message.id}
                          style={styles.creatorMessageContainer}
                        >
                          <Text style={styles.creatorMessageText}>
                            {message.content}
                          </Text>
                        </View>
                      );
                    }

                    return null; // fallback
                  })}
              </ScrollView>
            </View>

            <View style={styles.chatMessageCointainer}>
              <View style={styles.chatBox}>
                <TextInput
                  placeholder="Type a message… "
                  placeholderTextColor={colors.gray4}
                  multiline
                  style={styles.message}
                />
                <Entypo name="attachment" size={ms(15)} color={colors.white2} />
              </View>
              <Pressable style={styles.btn}>
                <FontAwesome name="send" size={ms(20)} color="#0F1012" />
              </Pressable>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A1A", position: "relative" },
  chatCointainer: {},
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  icon: {
    backgroundColor: "#4A4A4A",
    width: ms(35),
    height: ms(35),
    borderRadius: ms(35) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  body: {
    flex: 1,
    paddingHorizontal: ms(15),
  },
  chatMessageCointainer: {
    backgroundColor: "#0F1012",
    height: vs(80),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 0,
    flex: 1,
    width: "100%",
  },
  chatBox: {
    flex: 1,
    backgroundColor: colors.gray2,
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 10,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
  },
  message: {
    fontSize: ms(14),
    fontWeight: 400,
    color: colors.gray4,
    flex: 1,
  },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: s(50),
    height: 50,
  },
  serviceMessageContainer: {
    backgroundColor: colors.gray2,
    borderRadius: 10,
    height: "auto",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.accent,
    marginVertical: 5,
  },
  serviceMessageText: {
    color: colors.white2,
    fontWeight: 400,
    fontSize: ms(16),
    lineHeight: 24,
  },
  userMessageContainer: {},
  userMessageText: {},
  creatorMessageContainer: {},
  creatorMessageText: {},
});
