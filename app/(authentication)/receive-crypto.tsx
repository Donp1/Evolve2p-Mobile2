import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants";
import { globalStyles } from "@/utils/globalStyles";
import { router, useLocalSearchParams } from "expo-router";
import { ms } from "react-native-size-matters";
import QRCode from "react-native-qrcode-svg";
import { useUserStore } from "@/store/userStore";
import { formatWalletAddress } from "@/utils/countryStore";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";

const goBack = () => {
  if (router.canGoBack()) router.back();
};

const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
  // Alert.alert("Copied!", "Wallet address copied to clipboard");
};

const ReceiveCrypto = () => {
  const [loading, setLoading] = useState(false);

  const { coin } = useLocalSearchParams();

  const date = new Date();

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  useEffect(() => {
    (async () => {})();
  }, []);

  const user = useUserStore((state) => state.user);

  const currentCoin = user.wallets.find(
    (wallet: any) => wallet.currency === coin
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: currentCoin?.address || "",
        title: `Receive ${coin} - Evolve2p Wallet`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // console.log("Shared with activity type:", result.activityType);
        } else {
          // console.log("Shared successfully!");
        }
      } else if (result.action === Share.dismissedAction) {
        // console.log("Share dismissed.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
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
          <FontAwesome name="chevron-left" color={colors.secondary} size={15} />
          <Text
            style={{
              lineHeight: 24,
              fontWeight: 500,
              fontSize: ms(16),
              color: colors.secondary,
            }}
          >
            Receive {coin}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 50,
          backgroundColor: colors.primary,
        }}
      >
        <View style={{ paddingHorizontal: 15, marginVertical: 20 }}>
          <View style={{ gap: 10 }}>
            <Text
              style={{
                fontWeight: 700,
                fontSize: ms(18),
                color: colors.white2,
              }}
            >
              Your {currentCoin?.currency} Address
            </Text>

            <Text
              style={{
                fontWeight: 400,
                fontSize: ms(14),
                color: colors.white,
                lineHeight: 20,
              }}
            >
              Use this address to deposit {currentCoin?.currency} to your
              Evolve2p wallet.
            </Text>
          </View>
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <QRCode value={currentCoin?.address} size={250} />
          </View>

          <View
            style={[
              globalStyles.sectionBox,
              { paddingVertical: 0, marginTop: 20 },
            ]}
          >
            <View style={globalStyles.sectionMain}>
              <Text
                style={{
                  fontWeight: 400,
                  color: colors.secondary,
                  fontSize: ms(14),
                }}
              >
                Network
              </Text>
              <Text
                style={{
                  fontWeight: 500,
                  color: colors.white2,
                  fontSize: ms(14),
                }}
              >
                {currentCoin?.currency === "ETH" && "Ethereum"}
                {currentCoin?.currency === "BTC" && "Bitcoin"}
                {currentCoin?.currency === "USDT" && "TRON"}
                {currentCoin?.currency === "USDC" && "TRON"}
              </Text>
            </View>
          </View>

          <View
            style={[
              globalStyles.sectionBox,
              { paddingVertical: 0, marginTop: 10 },
            ]}
          >
            <View style={globalStyles.sectionMain}>
              <Text
                style={{
                  fontWeight: 400,
                  color: colors.secondary,
                  fontSize: ms(14),
                }}
              >
                Created
              </Text>
              <Text
                style={{
                  fontWeight: 500,
                  color: colors.white2,
                  fontSize: ms(14),
                }}
              >
                {formattedDate}
              </Text>
            </View>
          </View>

          <View
            style={[
              globalStyles.sectionBox,
              {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderLeftWidth: 2,
                borderLeftColor: "#FFC051",
                gap: 10,
              },
            ]}
          >
            <FontAwesome name="info-circle" color={"#FFC051"} size={14} />
            <Text
              style={{
                fontSize: ms(14),
                color: colors.secondary,
                fontWeight: 400,
                lineHeight: 20,
              }}
            >
              Make sure to only send {coin} through the selected network: {coin}
              . Sending incompatible cryptocurrencies or sending through a
              different network may result in irreversible loss.
            </Text>
          </View>

          <Pressable onPress={() => copyToClipboard(currentCoin?.address)}>
            <View
              style={{
                paddingVertical: 12,
                paddingHorizontal: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.gray2,
                marginVertical: 20,
                borderRadius: 100,
                gap: 10,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontWeight: 700,
                  fontSize: ms(14),
                  color: colors.white2,
                }}
              >
                {formatWalletAddress(currentCoin?.address)}
              </Text>
              <FontAwesome name="copy" color={colors.white2} size={16} />
            </View>
          </Pressable>

          <Pressable onPress={onShare}>
            <View
              style={{
                paddingVertical: 12,
                paddingHorizontal: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.gray2,

                borderRadius: 100,
                gap: 5,
                flexDirection: "row",
              }}
            >
              <Entypo name="share" size={ms(14)} color={colors.accent} />
              <Text
                style={{
                  fontWeight: 700,
                  fontSize: ms(14),
                  color: colors.accent,
                }}
              >
                Share
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReceiveCrypto;

const styles = StyleSheet.create({});
