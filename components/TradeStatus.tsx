import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type StatusProps = {
  status: "PENDING" | "PAID" | "COMPLETED" | "CANCELLED";
  type?: string;
};

const TradeStatus: React.FC<StatusProps> = ({ status, type }) => {
  let iconName: keyof typeof MaterialIcons.glyphMap = "hourglass-empty";
  let color = "gray";
  let label: string = status; // ✅ allow string

  switch (status) {
    case "PENDING":
      iconName = "hourglass-empty";
      color = "#facc15"; // yellow
      label = type == "seller" ? "Awaiting payment" : "Pending";
      break;
    case "PAID":
      iconName = "attach-money";
      color = "#3b82f6"; // blue
      label = "Paid";
      break;
    case "COMPLETED":
      iconName = "check-circle";
      color = "#22c55e"; // green
      label = "Completed";
      break;
    case "CANCELLED":
      iconName = "cancel";
      color = "#ef4444"; // red
      label = "Cancelled";
      break;
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "center", padding: 4 }}>
      <MaterialIcons name={iconName} size={20} color={color} />
      <Text style={{ marginLeft: 6, fontSize: 14, color, fontWeight: 500 }}>
        {label}
      </Text>
    </View>
  );
};

export default TradeStatus;
