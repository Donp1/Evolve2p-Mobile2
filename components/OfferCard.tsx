import { Offer } from "@/hooks/useOffers";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
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

const cryptoMap: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  USDC: "usd-coin",
};

// reusable fetch with retry
async function fetchWithRetry(url: string, retries = 3, delay = 1000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await new Promise((res) => setTimeout(res, delay * (attempt + 1))); // exponential backoff
    }
  }
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onAction,
  isUserDetails,
}) => {
  const actionLabel = offer.type.toLowerCase() === "sell" ? "Buy" : "Sell";

  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [showTradeProfile, setShowTradeProfile] = useState(false);

  useEffect(() => {
    if (!offer.crypto) return;

    let isMounted = true;

    (async () => {
      try {
        const data = await fetchWithRetry(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd"
        );

        const cryptoId = cryptoMap[offer.crypto.toUpperCase()];
        if (cryptoId && data[cryptoId]?.usd && isMounted) {
          setBasePrice(data[cryptoId].usd);
        }
      } catch (err) {
        console.error("Failed to fetch crypto price:", err);
        if (isMounted) setBasePrice(null);
      }
    })();

    return () => {
      isMounted = false;
    };
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
              <Text style={styles.iconText}>
                {getInitials(offer?.user?.username)}
              </Text>
            </View>
            <Text style={styles.username}>{offer?.user?.username}</Text>
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
    shadowColor: "#000",
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
  icon: {
    backgroundColor: "#4A4A4A",
    width: ms(35),
    height: ms(35),
    borderRadius: ms(35) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: ms(14),
    fontWeight: "500",
    color: colors.gray4,
  },
});
