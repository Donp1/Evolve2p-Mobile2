import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { DataProp, myCountriesDataProps } from "./SelectDropdown";
import { FlashList } from "@shopify/flash-list";
import { colors } from "@/constants";
import Item from "./Item";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ms } from "react-native-size-matters";

interface pageProps {
  data: myCountriesDataProps;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedItem: Dispatch<SetStateAction<DataProp | null>>;
  selectedItem: DataProp | null;
}
const CustomeDropdown = ({
  data,
  isOpen,
  setIsOpen,
  selectedItem,
  setSelectedItem,
}: pageProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // Clear search input function
  const clearSearchInput = () => {
    setSearchQuery("");
  };

  const handleItemSelect = useCallback((item: DataProp) => {
    setSelectedItem(item);
    setIsOpen(false);
    clearSearchInput();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={styles.dropdownButton}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          {selectedItem && (
            <View>
              <Image
                source={{ uri: selectedItem.flag }}
                contentFit="contain"
                contentPosition="center"
                style={{ width: 30, height: 50 }}
              />
            </View>
          )}
          <Text style={styles.selectedValue}>
            {selectedItem?.name ? selectedItem.name : "Select a Country"}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color="#ccc" />
      </Pressable>

      <Modal transparent={false} animationType="slide" visible={isOpen}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Search Input */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholderTextColor={colors.secondary}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                keyboardType="web-search"
              />

              {/* Clear Button (X Icon) */}
              {searchQuery ? (
                <Pressable
                  onPress={clearSearchInput}
                  style={styles.clearButton}
                >
                  <Ionicons name="close" size={30} color="#ccc" />
                </Pressable>
              ) : null}
            </View>
            <FlashList
              showsVerticalScrollIndicator={false}
              data={filteredData}
              scrollEnabled
              estimatedItemSize={20}
              renderItem={({ item }) => (
                <Pressable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 10,
                  }}
                  onPress={() => handleItemSelect(item)}
                >
                  <Item item={item} />
                  <View
                    style={[
                      styles.radio,
                      selectedItem?.name === item.name && {
                        borderColor: "green",
                      },
                    ]}
                  />
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomeDropdown;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  modalContent: {
    backgroundColor: colors.gray2,
    width: "100%",
    borderRadius: 5,
    padding: 10,
    flex: 1,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: ms(56),
  },
  selectedValue: {
    fontSize: 16,
    color: colors.secondary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingLeft: 10,
    borderRadius: 5,
    flex: 1,
    color: colors.secondary,
    paddingEnd: 30,
  },
  clearButton: {
    padding: 5,
    position: "absolute",
    right: 5,
  },
  radio: {
    width: 20,
    height: 20,
    backgroundColor: colors.gray2,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.gray,
  },
});
