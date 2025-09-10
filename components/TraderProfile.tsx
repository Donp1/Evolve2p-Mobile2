import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";
import { colors } from "@/constants";
import Spinner from "./Spinner";
import { AntDesign, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { ms } from "react-native-size-matters";
import {
  createTrust,
  formatNumber,
  getUserById,
  getUserOffers,
} from "@/utils/countryStore";
import { useCoinStore } from "@/context";
import { Image } from "expo-image";
import OfferCardUI from "./offerCardUI";
import { router } from "expo-router";
import { useAlert } from "./AlertService";

export function getInitials(username: string) {
  if (!username) return "";
  const words = username.trim().split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function countCompletedTrades(tradesAsSeller: any[], tradesAsBuyer: any[]) {
  const completedAsSeller = tradesAsSeller?.filter(
    (t) => t.status === "COMPLETED"
  ).length;
  const completedAsBuyer = tradesAsBuyer?.filter(
    (t) => t.status === "COMPLETED"
  ).length;

  return {
    asSeller: completedAsSeller,
    asBuyer: completedAsBuyer,
    total: completedAsSeller + completedAsBuyer,
  };
}

function calculateCompletionRate(
  tradesAsSeller: any[],
  tradesAsBuyer: any[]
): number {
  // merge both
  const sellerTrades = tradesAsSeller ?? [];
  const buyerTrades = tradesAsBuyer ?? [];
  const allTrades = [...sellerTrades, ...buyerTrades];

  if (allTrades?.length === 0) return 0;

  // trades that count towards denominator
  const validTrades = allTrades?.filter((t) =>
    ["COMPLETED", "CANCELLED", "DISPUTED"].includes(t?.status)
  );

  if (validTrades.length === 0) return 0;

  const completedTrades = validTrades?.filter(
    (t) => t?.status === "COMPLETED"
  ).length;

  const completionRate = (completedTrades / validTrades?.length) * 100;

  return Math.round(completionRate * 100) / 100; // round to 2 decimal places
}

type PaymentMethod = { id: string; name: string };

export function getUniquePaymentMethods(offers: any[]): PaymentMethod[] {
  const map = new Map<string, PaymentMethod>();

  offers.forEach((offer) => {
    if (offer.paymentMethod) {
      map.set(offer.paymentMethod.id, offer.paymentMethod);
    }
  });

  return Array.from(map.values());
}

interface TraderProfileProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  userId: string;
}

const handleTrade = async (id: string) => {
  router.push({
    pathname: "/trade/[id]",
    params: {
      id: id,
    },
  });
};

const TraderProfile = ({ visible, setVisible, userId }: TraderProfileProps) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [trustedBy, setTrustedBy] = useState<number>(0);
  const [isTrusted, setIsTrusted] = useState(false);

  const coins = useCoinStore((state) => state.coins);
  const btcDetails = coins.find((coin) => coin.symbol?.toLowerCase() == "btc");
  const ethDetails = coins.find((coin) => coin.symbol?.toLowerCase() == "eth");
  const usdcDetails = coins.find(
    (coin) => coin.symbol?.toLowerCase() == "usdc"
  );
  const usdtDetails = coins.find(
    (coin) => coin.symbol?.toLowerCase() == "usdt"
  );

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const { AlertComponent, showAlert } = useAlert();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const userData = await getUserById(userId);
      const offersData = await getUserOffers(userData?.user?.id);

      setLoading(false);
      if (userData?.success && offersData?.success) {
        setUser(userData?.user);
        setOffers(offersData?.offers);
        setTrustedBy(userData?.user?.trustedBy?.length);
        setIsTrusted(
          userData?.user?.trustedBy?.some((t: any) => t.trustedId === userId) ??
            false
        );
        setPaymentMethods(getUniquePaymentMethods(offersData?.offers));
      }
    })();
  }, [userId]);

  const handleTrusted = async () => {
    if (isTrusted) return;
    // ✅ Optimistic update
    setTrustedBy((prev) => prev + 1);
    setIsTrusted(true);
    const res = await createTrust(userId);

    if (res?.error) {
      setTrustedBy((prev) => prev - 1);
      setIsTrusted(false);
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
        [{ onPress() {}, text: "Close" }],
        "success"
      );
    }
  };

  return (
    <>
      <Modal animationType="slide" visible={visible} transparent>
        <SafeAreaView
          style={[
            globalStyles.container,
            { backgroundColor: colors.primary, padding: 10 },
          ]}
        >
          {AlertComponent}
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.primary,
              }}
            >
              <Spinner width={40} height={40} />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 100,
                backgroundColor: colors.primary,
                flexGrow: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 10,
                }}
              >
                <Pressable
                  onPress={() => setVisible(false)}
                  style={{ padding: 10 }}
                >
                  <FontAwesome
                    name="chevron-left"
                    size={15}
                    color={colors.white2}
                    onPress={() => setVisible(false)}
                  />
                </Pressable>
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: ms(16),
                    color: colors.white2,
                  }}
                >
                  Back
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Pressable
                    // onPress={() => setShowTradeProfile(true)}
                    style={styles.icon}
                  >
                    <Text
                      style={{
                        fontSize: ms(16),
                        fontWeight: "500",
                        color: colors.gray4,
                      }}
                    >
                      {getInitials(user?.username)}
                    </Text>
                  </Pressable>

                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 500,
                          fontSize: ms(16),
                          color: colors.white2,
                        }}
                      >
                        {user?.username}
                      </Text>
                      {user?.kycVerified ? (
                        <AntDesign
                          name="checkcircle"
                          size={15}
                          color={colors.accent}
                        />
                      ) : (
                        <Feather name="user-x" size={15} color={colors.red} />
                      )}
                    </View>

                    <Text
                      style={{
                        fontWeight: 400,
                        fontSize: ms(14),
                        color: colors.gray4,
                      }}
                    >
                      Online
                    </Text>
                  </View>
                </View>

                <Pressable
                  disabled={isTrusted}
                  onPress={handleTrusted}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderRadius: 100,
                    backgroundColor: colors.gray2,
                    minWidth: ms(60),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isTrusted ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Entypo
                        name="thumbs-up"
                        size={15}
                        color={colors.accent}
                      />
                      <Text
                        style={{
                          fontWeight: 700,
                          fontSize: ms(14),
                          color: colors.accent,
                        }}
                      >
                        Trusted
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontWeight: 700,
                        fontSize: ms(14),
                        color: colors.accent,
                      }}
                    >
                      Trust
                    </Text>
                  )}
                </Pressable>
              </View>

              <View
                style={{
                  marginVertical: 10,

                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <AntDesign
                    name="checkcircle"
                    size={10}
                    color={colors.accent}
                  />

                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: ms(12),
                      color: colors.secondary,
                    }}
                  >
                    Email
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <AntDesign
                    name="checkcircle"
                    size={10}
                    color={colors.accent}
                  />

                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: ms(12),
                      color: colors.secondary,
                    }}
                  >
                    SMS
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {user?.kycVerified ? (
                    <AntDesign
                      name="checkcircle"
                      size={15}
                      color={colors.accent}
                    />
                  ) : (
                    <Feather name="user-x" size={15} color={colors.red} />
                  )}

                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: ms(12),
                      color: colors.secondary,
                    }}
                  >
                    ID Verification
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <AntDesign
                    name="checkcircle"
                    size={10}
                    color={colors.accent}
                  />

                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: ms(12),
                      color: colors.secondary,
                    }}
                  >
                    Address
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  //   justifyContent: "space-evenly",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <View
                  style={[
                    globalStyles.sectionBox,
                    {
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: ms(12),
                      fontWeight: "500",
                      color: colors.white2,
                    }}
                  >
                    {formatNumber(
                      countCompletedTrades(
                        user?.tradesAsBuyer,
                        user?.tradesAsSeller
                      ).total,
                      0
                    )}
                  </Text>
                  <Text
                    style={{
                      fontSize: ms(8),
                      fontWeight: "700",
                      color: colors.gray4,
                    }}
                  >
                    Trades Completed
                  </Text>
                </View>
                <View
                  style={[
                    globalStyles.sectionBox,
                    {
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: ms(12),
                      fontWeight: "500",
                      color: colors.white2,
                    }}
                  >
                    {calculateCompletionRate(
                      user?.tradesAsBuyer,
                      user?.tradesAsSeller
                    )}
                    %
                  </Text>
                  <Text
                    style={{
                      fontSize: ms(8),
                      fontWeight: "700",
                      color: colors.gray4,
                    }}
                  >
                    Completion Rate
                  </Text>
                </View>
              </View>

              <View style={globalStyles.divider} />
              <View style={{ gap: 10, marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: ms(14),
                    color: colors.gray4,
                  }}
                >
                  Trade Info
                </Text>
                <View style={{ gap: 5 }}>
                  <View style={globalStyles.top}>
                    <Text
                      style={{
                        fontWeight: 400,
                        fontSize: ms(14),
                        color: colors.secondary,
                      }}
                    >
                      Total Trades
                    </Text>

                    <Text
                      style={{
                        fontWeight: 400,
                        fontSize: ms(14),
                        color: colors.secondary,
                      }}
                    >
                      {
                        [
                          ...(user?.tradesAsBuyer ?? []),
                          ...(user?.tradesAsSeller ?? []),
                        ].filter((trade) =>
                          ["COMPLETED", "CANCELLED", "DISPUTED"].includes(
                            trade?.status
                          )
                        ).length
                      }
                    </Text>
                  </View>
                  <View style={globalStyles.middle}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Image
                        source={{ uri: btcDetails?.image }}
                        style={{ width: 20, height: 20 }}
                      />
                      <Text
                        style={{
                          fontWeight: 400,
                          fontSize: ms(14),
                          color: colors.secondary,
                        }}
                      >
                        Trade volume
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontWeight: 400,
                        fontSize: ms(14),
                        color: colors.secondary,
                      }}
                    >
                      {[
                        ...(user?.tradesAsBuyer ?? []),
                        ...(user?.tradesAsSeller ?? []),
                      ]
                        .filter(
                          (trade) =>
                            trade?.offer?.crypto?.toUpperCase() == "BTC" &&
                            trade?.status == "COMPLETED"
                        )
                        .reduce((acc, t) => acc + t.amountCrypto, 0)}{" "}
                      {btcDetails?.symbol?.toUpperCase()}
                    </Text>
                  </View>
                  <View style={globalStyles.middle}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Image
                        source={{ uri: ethDetails?.image }}
                        style={{ width: 20, height: 20 }}
                      />
                      <Text
                        style={{
                          fontWeight: 400,
                          fontSize: ms(14),
                          color: colors.secondary,
                        }}
                      >
                        Trade volume
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontWeight: 400,
                        fontSize: ms(14),
                        color: colors.secondary,
                      }}
                    >
                      {[
                        ...(user?.tradesAsBuyer ?? []),
                        ...(user?.tradesAsSeller ?? []),
                      ]
                        .filter(
                          (trade) =>
                            trade?.offer?.crypto?.toUpperCase() == "ETH" &&
                            trade?.status == "COMPLETED"
                        )
                        .reduce((acc, t) => acc + t.amountCrypto, 0)}{" "}
                      {ethDetails?.symbol?.toUpperCase()}
                    </Text>
                  </View>
                  <View style={globalStyles.middle}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Image
                        source={{ uri: usdtDetails?.image }}
                        style={{ width: 20, height: 20 }}
                      />
                      <Text
                        style={{
                          fontWeight: 400,
                          fontSize: ms(14),
                          color: colors.secondary,
                        }}
                      >
                        Trade volume
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontWeight: 400,
                        fontSize: ms(14),
                        color: colors.secondary,
                      }}
                    >
                      {[
                        ...(user?.tradesAsBuyer ?? []),
                        ...(user?.tradesAsSeller ?? []),
                      ]
                        .filter(
                          (trade) =>
                            trade?.offer?.crypto?.toUpperCase() == "USDT" &&
                            trade?.status == "COMPLETED"
                        )
                        .reduce((acc, t) => acc + t.amountCrypto, 0)}{" "}
                      {usdtDetails?.symbol?.toUpperCase()}
                    </Text>
                  </View>
                  <View style={globalStyles.middle}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Image
                        source={{ uri: usdcDetails?.image }}
                        style={{ width: 20, height: 20 }}
                      />
                      <Text
                        style={{
                          fontWeight: 400,
                          fontSize: ms(14),
                          color: colors.secondary,
                        }}
                      >
                        Trade volume
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontWeight: 400,
                        fontSize: ms(14),
                        color: colors.secondary,
                      }}
                    >
                      {[
                        ...(user?.tradesAsBuyer ?? []),
                        ...(user?.tradesAsSeller ?? []),
                      ]
                        .filter(
                          (trade) =>
                            trade?.offer?.crypto?.toUpperCase() == "USDC" &&
                            trade?.status == "COMPLETED"
                        )
                        .reduce((acc, t) => acc + t.amountCrypto, 0)}{" "}
                      {usdcDetails?.symbol?.toUpperCase()}
                    </Text>
                  </View>
                  <View style={globalStyles.bottom}>
                    <View style={styles.trustBadge}>
                      <Text style={styles.trustText}>
                        Trusted by {trustedBy}{" "}
                        {trustedBy == 1 ? "person" : "people"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={globalStyles.divider} />

              <View style={{ gap: 10, marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: ms(14),
                    color: colors.gray4,
                  }}
                >
                  Payment Methods
                </Text>
                <View
                  style={{
                    maxWidth: "100%",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {paymentMethods?.map((paymentMethod) => (
                    <View
                      style={{
                        backgroundColor: "#3A3A3A",
                        alignSelf: "flex-start",
                        borderRadius: 100,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                      key={paymentMethod.id}
                    >
                      <AntDesign
                        name="checkcircle"
                        size={15}
                        color={colors.accent}
                      />
                      <Text
                        style={{
                          fontWeight: 500,
                          fontSize: ms(14),
                          color: colors.secondary,
                        }}
                      >
                        {paymentMethod.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={globalStyles.divider} />

              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: ms(14),
                    color: colors.gray4,
                  }}
                >
                  Info
                </Text>
                <View style={[globalStyles.sectionBox]}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: ms(12),
                        color: colors.secondary,
                      }}
                    >
                      Joined
                    </Text>
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: ms(12),
                        color: colors.white2,
                      }}
                    >
                      {new Date(user?.createdAt).toLocaleDateString("en-US", {
                        month: "short", // "Feb"
                        day: "numeric", // 27
                        year: "numeric", // 2025
                      })}
                    </Text>
                  </View>
                </View>
                <View style={[globalStyles.sectionBox]}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: ms(12),
                        color: colors.secondary,
                      }}
                    >
                      Location
                    </Text>
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: ms(12),
                        color: colors.white2,
                      }}
                    >
                      {user?.country}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={globalStyles.divider} />

              <View>
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: ms(14),
                    color: colors.gray4,
                  }}
                >
                  Active Offers
                </Text>

                {offers?.map((offer) => (
                  <View style={styles.card} key={offer?.id}>
                    <OfferCardUI
                      onAction={handleTrade}
                      isUserDetails={false}
                      offer={offer}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default TraderProfile;

const styles = StyleSheet.create({
  icon: {
    backgroundColor: "#4A4A4A",
    width: ms(50),
    height: ms(50),
    borderRadius: ms(50) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
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
  trustBadge: {
    backgroundColor: "#E0F7E9", // light green
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  trustText: {
    color: "#2E7D32", // dark green
    fontWeight: "600",
    fontSize: 13,
  },
});
