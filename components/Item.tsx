import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants";
import { Image } from "expo-image";
import { memo } from "react";

interface DataProp {
  name: string;
  flag: string;
  phoneCode?: string;
}
const Item = ({ item }: { item: DataProp }) => (
  <View
    style={{
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
    }}
  >
    <View style={{ width: 30, height: 30 }}>
      <Image
        priority={"high"}
        contentFit="scale-down"
        style={{ width: "100%", flex: 1, height: "100%" }}
        source={{ uri: item?.flag }}
      />
    </View>
    <Text style={styles.itemText}>{item?.name}</Text>
  </View>
);

export default memo(Item);

const styles = StyleSheet.create({
  item: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 16,
    color: colors.secondary,
    maxWidth: "80%",
  },
});
