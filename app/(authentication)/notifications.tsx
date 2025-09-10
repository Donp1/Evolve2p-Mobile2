import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";
import { colors } from "@/constants";
import { useUserStore } from "@/store/userStore";
import { Entypo, FontAwesome, Fontisto, Ionicons } from "@expo/vector-icons";
import { ms } from "react-native-size-matters";
import { useNotificationStore } from "@/context";
import { router } from "expo-router";
import { groupNotificationsByDate } from "@/utils/countryStore";
import { formatDistanceToNow } from "date-fns";

const goBack = () => {
  if (router.canGoBack()) router.back();
};

const Notifications = () => {
  const user = useUserStore((state) => state.user);
  const notifications = useNotificationStore((state) => state.notifications);

  const groupedNotifications = groupNotificationsByDate(notifications);
  const groupedArray = Object.entries(groupedNotifications);

  // console.log("groupedNotifications", groupedNotifications);

  function timeAgo(createdAt: string | Date) {
    return formatDistanceToNow(new Date(createdAt), {
      addSuffix: true,
    }).replace(/^about /, ""); // remove "about "
  }

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={[globalStyles.topBar, { padding: 10 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable onPress={goBack} style={{ padding: 6 }}>
            <Entypo name="chevron-left" size={ms(25)} color={colors.white2} />
          </Pressable>
          <Text
            style={{
              fontWeight: 400,
              fontSize: ms(16),
              color: colors.white2,
            }}
          >
            Notifications
          </Text>
        </View>
        <View style={styles.notiContainer}>
          <Fontisto
            name="player-settings"
            size={ms(17)}
            color={colors.secondary}
          />
        </View>
      </View>

      {notifications.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary,
          }}
        >
          <Text style={{ color: colors.secondary, marginTop: 20 }}>
            No notifications yet
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            style={{
              padding: 10,
              flex: 1,
              width: "100%",
              backgroundColor: colors.primary,
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={groupedArray}
            keyExtractor={(item) => item[0]} // group label as key
            renderItem={({ item }) => {
              const [label, groupNotifs] = item;

              return (
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: ms(14),
                      fontWeight: 600,
                      marginBottom: 8,
                      color: colors.secondary,
                    }}
                  >
                    {groupNotifs.label}
                  </Text>

                  {groupNotifs.notifications.map((notif) => (
                    <View
                      key={notif.id}
                      style={{
                        padding: 12,
                        backgroundColor: "#2D2D2D",
                        borderRadius: 8,
                        marginBottom: 6,
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <View style={{}}>
                          <Ionicons
                            name="notifications-circle"
                            size={24}
                            color={colors.accent}
                          />
                        </View>
                        <Text
                          style={{
                            fontWeight: 700,
                            color: colors.white2,
                            fontSize: ms(14),
                          }}
                        >
                          {notif.title}
                        </Text>
                      </View>

                      <Text
                        style={{
                          fontWeight: 400,
                          fontSize: ms(12),
                          color: colors.secondary,
                          lineHeight: 18,
                        }}
                      >
                        {notif.message}
                      </Text>

                      <View style={globalStyles.divider} />

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 400,
                            fontSize: ms(12),
                            color: colors.white2,
                            lineHeight: 18,
                          }}
                        >
                          {timeAgo(notif.createdAt)}
                        </Text>

                        {notif.category !== "SYSTEM" && (
                          <Pressable
                            style={{
                              gap: 10,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: 700,
                                fontSize: ms(14),
                                color: colors.accent,
                                lineHeight: 18,
                              }}
                            >
                              View
                            </Text>
                            <FontAwesome
                              name="chevron-right"
                              size={ms(14)}
                              color={colors.accent}
                            />
                          </Pressable>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              );
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  notiContainer: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.white,
  },
});
