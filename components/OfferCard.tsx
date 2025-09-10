import { Offer } from "@/hooks/useOffers";
import { formatNumber, priceFormater } from "@/utils/countryStore";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import CryptoPriceWithMargin from "./CryptoPriceWithMargin ";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import TraderProfile from "./TraderProfile";
import OfferCardUI from "./offerCardUI";

export function getInitials(username: string) {
  if (!username) return "";
  const words = username.trim().split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export interface ActionableOffer extends Offer {
  actionLabel: string; // e.g., "Buy" or "Sell"
}

interface OfferCardProps {
  offer: Offer;
  onAction?: (id: string) => void; // callback when Buy/Sell pressed
  isUserDetails?: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onAction,
  isUserDetails,
}) => {
  const actionLabel = offer.type.toLowerCase() === "sell" ? "Buy" : "Sell";
  const isBuyAction = actionLabel === "Buy";

  const [loading, setLoading] = useState(false);
  const [basePrice, setBasePrice] = useState<number | null>(null);

  const [showTradeProfile, setShowTradeProfile] = useState(false);

  useEffect(() => {
    if (!offer.crypto) return;

    const fetchPrice = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd"
        );
        const data = await res.json();

        const cryptoMap = {
          BTC: "bitcoin",
          ETH: "ethereum",
          USDT: "tether",
          USDC: "usd-coin",
        };

        const cryptoId =
          cryptoMap[offer.crypto.toUpperCase() as keyof typeof cryptoMap];
        if (!cryptoId || !data[cryptoId]) {
          throw new Error("Invalid coin symbol or missing data.");
        }

        setBasePrice(data[cryptoId].usd);
      } catch (err) {
        console.error("Error fetching crypto price:", err);
        setBasePrice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [offer.crypto]);

  const adjustedPrice =
    basePrice !== null
      ? offer.margin && offer.margin !== 0
        ? basePrice + basePrice * (offer.margin / 100)
        : basePrice
      : null;

  return (
    <>
      <View style={styles.card}>
        {/* Header */}
        {isUserDetails && (
          <Pressable
            onPress={() => setShowTradeProfile(true)}
            style={styles.header}
          >
            <View style={styles.icon}>
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: "500",
                  color: colors.gray4,
                }}
              >
                {getInitials(offer?.user?.username)}
              </Text>
            </View>
            <Text
              style={{
                fontSize: ms(14),
                fontWeight: "500",
                color: colors.white2,
              }}
            >
              {offer?.user?.username}
            </Text>
          </Pressable>
        )}

        <OfferCardUI
          onAction={onAction}
          offer={offer}
          isUserDetails={isUserDetails}
        />
      </View>
      <TraderProfile
        setVisible={setShowTradeProfile}
        visible={showTradeProfile}
        userId={offer?.user?.id}
      />
    </>
  );
};

export default OfferCard;

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    backgroundColor: "#121212",
    borderColor: "#1f1f1f",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#fff",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
    overflow: "hidden",
  },
  buyBadge: {
    backgroundColor: "rgba(34,197,94,0.2)",
    color: "#4ade80",
  },
  sellBadge: {
    backgroundColor: "rgba(239,68,68,0.2)",
    color: "#f87171",
  },
  details: {
    marginBottom: 12,
  },
  subText: {
    color: "#9ca3af",
    fontSize: 13,
  },
  marginText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  label: {
    fontSize: 11,
    color: "#9ca3af",
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e7eb",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  footerText: {
    fontSize: 11,
    color: "#6b7280",
  },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buyBtn: {
    backgroundColor: "#22c55e",
  },
  sellBtn: {
    backgroundColor: "#ef4444",
  },
  actionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  icon: {
    backgroundColor: "#4A4A4A",
    width: ms(35),
    height: ms(35),
    borderRadius: ms(35) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
