import {
  Alert,
  Keyboard,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { router } from "expo-router";
import {
  markAsPaid,
  priceFormater,
  releaseCrypto,
  sendChat,
} from "@/utils/countryStore";
import { globalStyles } from "@/utils/globalStyles";
import { colors } from "@/constants";
import Spinner from "@/components/Spinner";
import { ms, s, vs } from "react-native-size-matters";
import { Entypo, Feather, FontAwesome, Octicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/userStore";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAlert } from "./AlertService";

interface PageProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentTrade: any;
  messages: any[];
  setMessages: Dispatch<SetStateAction<any[]>>;
  type: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  setCompletedSteps: Dispatch<SetStateAction<string[]>>;
}

export function formatDateTime(createdAt: string | Date) {
  const date = new Date(createdAt);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  const timeStr = `${hours}:${minutesStr} ${ampm}`;
  return `${date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })} ${timeStr}`;
}

export function getInitials(username: string) {
  if (!username) return "";
  const words = username.trim().split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

const ChatView = ({
  isOpen,
  setIsOpen,
  currentTrade,
  messages,
  setMessages,
  setActiveTab,
  setCompletedSteps,

  type,
}: PageProps) => {
  const [content, setContent] = useState("");
  const [isChatSending, setIsChatSending] = useState(false);
  const [file, setFile] = useState<any>(null); // { uri, name, mimeType } from DocumentPicker or { uri, type } from ImagePicker
  const [imagePreviewUri, setImagePreviewUri] = useState<string | null>(null); // fullscreen viewer

  const user = useUserStore((state) => state.user);
  const scrollRef = useRef<ScrollView>(null);
  const [isPaying, setIsPaying] = useState(false);

  const { AlertComponent, showAlert } = useAlert();

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: false });
  }, []);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      scrollRef.current?.scrollToEnd({ animated: true })
    );
    return () => showSub.remove();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Render an attachment in a message (image centered, click-to-zoom, or file link)
  const renderAttachment = (attachment?: string | null) => {
    if (!attachment) return null;
    const isImageUrl = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment);
    if (isImageUrl) {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setImagePreviewUri(attachment)}
          style={{ alignSelf: "center", marginTop: 8 }}
        >
          <Image
            source={{ uri: attachment }}
            style={{ width: 180, height: 180, borderRadius: 12 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }
    return (
      <Text
        style={{
          color: colors.accent,
          marginTop: 8,
          textDecorationLine: "underline",
          alignSelf: "center",
        }}
        onPress={() => Linking.openURL(attachment)}
      >
        📎 View File
      </Text>
    );
  };

  const handleSendChat = async () => {
    if (isChatSending) return;
    if (!content && !file) return; // prevent empty sends

    setIsChatSending(true);
    try {
      const newchat = await sendChat(
        currentTrade?.chat?.id,
        content,
        file || undefined
      );
      console.log(newchat);
      setContent("");
      setFile(null);
    } finally {
      setIsChatSending(false);
    }
  };

  // Permission (iOS requires for photo library)
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need access to your photos/files to upload."
      );
      return false;
    }
    return true;
  };

  // Pick image or PDF
  const pickFile = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*"],
      multiple: false,
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0]; // { uri, name, size, mimeType }
      scrollRef.current?.scrollToEnd({ animated: false });
      setFile(asset);
    }
  };

  // Small preview before sending (tap to enlarge if image)
  const renderPendingPreview = () => {
    if (!file) return null;

    const isImage =
      file?.mimeType?.startsWith("image/") || file?.type?.startsWith("image/");

    return (
      <View style={styles.pendingPreview}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => isImage && setImagePreviewUri(file.uri)}
          style={{ alignSelf: "center" }}
        >
          {isImage ? (
            <Image
              source={{ uri: file.uri }}
              style={{ width: 120, height: 120, borderRadius: 10 }}
              resizeMode="cover"
            />
          ) : (
            <Text style={{ color: colors.accent, textAlign: "center" }}>
              📄 {file.name || "Selected file"}
            </Text>
          )}
        </TouchableOpacity>

        <Pressable onPress={() => setFile(null)} style={{ marginTop: 6 }}>
          <Text style={{ color: "red", fontSize: 12, textAlign: "center" }}>
            Remove
          </Text>
        </Pressable>
      </View>
    );
  };

  const handlePaid = async () => {
    setIsPaying(true);

    const res = await markAsPaid(currentTrade?.id);

    if (res?.error) {
      showAlert(
        "Error",
        res?.message,
        [{ text: "Close", onPress() {} }],
        "error"
      );
      setIsPaying(false);
      return;
    }

    if (res?.success) {
      showAlert(
        "Successful",
        res?.message,
        [
          {
            text: "Continue",
            onPress() {
              setActiveTab("step-two");
              setCompletedSteps((tabs) => [...tabs, "step-one"]);
            },
          },
        ],
        "success"
      );
      setIsPaying(false);
    }
  };

  const handleRelease = async () => {
    setIsPaying(true);

    const res = await releaseCrypto(currentTrade?.id);

    if (res?.error) {
      showAlert(
        "Error",
        res?.message,
        [{ text: "Close", onPress() {} }],
        "error"
      );
      setIsPaying(false);
      return;
    }

    if (res?.success) {
      showAlert(
        "Successful",
        res?.message,
        [
          {
            text: "Continue",
            onPress() {
              setActiveTab("step-two");
              setCompletedSteps((tabs) => [...tabs, "step-one"]);
            },
          },
        ],
        "success"
      );
      setIsPaying(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={isOpen}>
      <SafeAreaView style={globalStyles.container}>
        <View style={styles.container}>
          {/* Top bar */}
          <View style={styles.top}>
            <Pressable onPress={() => setIsOpen(false)} style={{ padding: 10 }}>
              <Feather name="chevron-left" size={24} color={colors.secondary} />
            </Pressable>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View style={styles.icon}>
                <Text
                  style={{
                    fontSize: ms(14),
                    fontWeight: "500",
                    color: colors.gray4,
                  }}
                >
                  {type == "seller"
                    ? getInitials(currentTrade?.buyer?.username)
                    : getInitials(currentTrade?.seller?.username)}
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: ms(16),
                  color: colors.white2,
                }}
              >
                {type == "seller"
                  ? currentTrade?.buyer?.username
                  : currentTrade?.seller?.username}
              </Text>
              <Octicons name="check-circle-fill" size={13} color="#4DF2BE" />
            </View>
          </View>

          {/* Chat body */}
          <View style={styles.body}>
            <View style={styles.priceContainer}>
              <View>
                <Text style={{ fontSize: ms(12), color: colors.secondary }}>
                  FIAT AMOUNT
                </Text>
                <Text
                  style={{
                    fontSize: ms(16),
                    color: colors.white2,
                    fontWeight: "500",
                  }}
                >
                  {priceFormater(currentTrade?.amountFiat)}{" "}
                  {currentTrade?.offer?.currency}
                </Text>
              </View>
              <Pressable
                onPress={() =>
                  showAlert(
                    type == "seller"
                      ? "Confirm payment received?"
                      : "Made the payment?",
                    type == "seller"
                      ? "Have you verified the buyer's payment in your bank account? This action will release 0.0048 BTC from escrow to the buyer."
                      : "Ensure you’ve made payment of the exact amount using the provided payment method.",
                    [
                      {
                        text: "Cancle",
                        onPress() {},
                        style: { backgroundColor: "#2D2D2D" },
                      },
                      {
                        text: type == "seller" ? "Release Crypto" : "Yes, Paid",
                        onPress: type == "seller" ? handleRelease : handlePaid,
                        style: { backgroundColor: colors.accent },
                        textStyle: { color: colors.primary },
                      },
                    ],
                    "info"
                  )
                }
                disabled={
                  (currentTrade?.status == "PAID" && type == "buyer") ||
                  currentTrade?.status == "CANCELLED" ||
                  currentTrade?.status == "COMPLETED"
                }
                style={[
                  globalStyles.btn,
                  { width: "auto", paddingHorizontal: 10 },
                  currentTrade?.status == "PAID" &&
                    type == "buyer" && {
                      backgroundColor: "#3A3A3A",
                    },
                  currentTrade?.status == "CANCELLED" && {
                    backgroundColor: "#3A3A3A",
                  },
                ]}
              >
                <Text
                  style={[
                    globalStyles.btnText,
                    currentTrade?.status == "PAID" &&
                      type == "buyer" && {
                        color: colors.white,
                      },
                    currentTrade?.status == "CANCELLED" && {
                      color: colors.white,
                    },
                  ]}
                >
                  {currentTrade?.status == "CANCELLED"
                    ? "Cancelled"
                    : currentTrade?.status == "PAID"
                    ? "Paid"
                    : type == "seller"
                    ? "Yes, Recieved"
                    : "Paid"}
                </Text>
              </Pressable>
            </View>

            <ScrollView
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 110 }}
            >
              {messages
                ?.sort(
                  (a: any, b: any) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map((message: any) => {
                  // System message
                  if (message.type === "SYSTEM" && !message.senderId) {
                    return (
                      <View
                        key={message.id}
                        style={{ marginVertical: 10, alignItems: "center" }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Text
                            style={{ color: colors.accent, fontWeight: "500" }}
                          >
                            Service message
                          </Text>
                          <Text
                            style={{ color: colors.gray4, fontSize: ms(12) }}
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

                  // User message
                  if (message?.senderId === user?.id) {
                    return (
                      <View
                        key={message.id}
                        style={styles.userMessageContainer}
                      >
                        <Text
                          style={{
                            color: colors.gray4,
                            fontSize: ms(12),
                            textAlign: "right",
                            marginBottom: 4,
                          }}
                        >
                          {formatDateTime(message?.createdAt)}
                        </Text>
                        <View style={styles.userBubble}>
                          {message.content ? (
                            <Text style={styles.userMessageText}>
                              {message.content}
                            </Text>
                          ) : null}
                          {renderAttachment(message.attachment)}
                        </View>
                      </View>
                    );
                  }

                  // Other user message
                  return (
                    <View
                      key={message.id}
                      style={styles.creatorMessageContainer}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 4,
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <View style={styles.icon}>
                            <Text style={{ color: colors.gray4 }}>
                              {type == "seller"
                                ? getInitials(currentTrade?.buyer?.username)
                                : getInitials(currentTrade?.seller?.username)}
                            </Text>
                          </View>
                          <Text
                            style={{ color: colors.white2, fontWeight: "600" }}
                          >
                            {type == "seller"
                              ? currentTrade?.buyer?.username
                              : currentTrade?.seller?.username}
                          </Text>
                        </View>
                        <Text style={{ color: colors.gray4, fontSize: ms(12) }}>
                          {formatDateTime(message?.createdAt)}
                        </Text>
                      </View>
                      <View style={styles.creatorBubble}>
                        {message.content ? (
                          <Text style={styles.creatorMessageText}>
                            {message.content}
                          </Text>
                        ) : null}
                        {renderAttachment(message.attachment)}
                      </View>
                    </View>
                  );
                })}

              {/* Pending file preview (before sending) */}
              {renderPendingPreview()}
            </ScrollView>
          </View>

          {/* Input */}
          <View style={styles.chatMessageCointainer}>
            <View style={styles.chatBox}>
              <TextInput
                placeholder="Type a message… "
                placeholderTextColor={colors.gray4}
                multiline
                style={styles.message}
                value={content}
                onChangeText={setContent}
              />
              <Pressable onPress={pickFile}>
                <Entypo name="attachment" size={ms(18)} color={colors.white2} />
              </Pressable>
            </View>
            <Pressable
              disabled={isChatSending}
              onPress={handleSendChat}
              style={[styles.btn, { opacity: isChatSending ? 0.5 : 1 }]}
            >
              {isChatSending ? (
                <Spinner width={20} height={20} />
              ) : (
                <FontAwesome name="send" size={ms(20)} color="#0F1012" />
              )}
            </Pressable>
          </View>

          {/* Fullscreen image preview (tap to close) */}
          <Modal visible={!!imagePreviewUri} transparent animationType="fade">
            <TouchableOpacity
              activeOpacity={1}
              style={styles.viewerBackdrop}
              onPress={() => setImagePreviewUri(null)}
            >
              {imagePreviewUri && (
                <Image
                  source={{ uri: imagePreviewUri }}
                  style={styles.viewerImage}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          </Modal>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ChatView;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A1A" },
  top: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    gap: 10,
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
    // height: vs(80),
    paddingVertical: 10,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
  chatBox: {
    flex: 1,
    backgroundColor: colors.gray2,
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 10,
    height: vs(50),
    borderRadius: 10,
    alignItems: "center",
  },
  message: {
    fontSize: ms(14),
    color: colors.gray4,
    flex: 1,
  },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: s(50),
    height: vs(50),
  },
  serviceMessageContainer: {
    backgroundColor: colors.gray2,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.accent,
    marginVertical: 5,
  },
  serviceMessageText: {
    color: colors.white2,
    fontSize: ms(16),
    lineHeight: 24,
  },
  userMessageContainer: { marginVertical: 10 },
  userBubble: {
    backgroundColor: "#206650",
    marginLeft: ms(45),
    padding: 10,
    borderRadius: 8,
    borderTopRightRadius: 0,
  },
  userMessageText: { fontSize: ms(16), color: colors.white2 },
  creatorMessageContainer: { marginVertical: 10 },
  creatorBubble: {
    backgroundColor: colors.gray2,
    marginLeft: ms(45),
    padding: 10,
    borderRadius: 8,
    borderTopLeftRadius: 0,
  },
  creatorMessageText: { fontSize: ms(16), color: colors.white2 },
  pendingPreview: {
    marginTop: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  viewerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  viewerImage: {
    width: "92%",
    height: "80%",
    borderRadius: 12,
  },
});
