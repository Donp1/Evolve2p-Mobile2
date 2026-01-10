import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";
import { Country, useCountryStore } from "@/store/countryStore";

export type SelectedCurrency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
};

type Props = {
  visible: boolean;
  onClose?: () => void;
  onSelect: (currency: SelectedCurrency) => void;
};

export default function CurrencySelectorModal({
  visible,
  onClose,
  onSelect,
}: Props) {
  const [filtered, setFiltered] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<
    SelectedCurrency | null | undefined
  >(null);

  const { countries, loading, error } = useCountryStore();

  /*  
    🔥 Process & set filtered list when countries change  
    Set default USD just once on first fetch  
  */
  useEffect(() => {
    if (countries.length === 0) return;

    const withCurrency = countries.filter((c) => c.currencies);
    setFiltered(withCurrency);

    // Set default USD only if user hasn't selected anything yet
    if (!selectedCurrency) {
      const usdCountry = withCurrency?.find(
        (c) => c.currencies?.USD && c.cca2 === "US"
      );

      if (usdCountry) {
        const defaultCurrency: SelectedCurrency = {
          code: "USD",
          name: usdCountry.currencies?.["USD"]?.name ?? "",
          symbol: usdCountry.currencies?.["USD"]?.symbol ?? "",
          flag: usdCountry.flags.png,
        };

        setSelectedCurrency(defaultCurrency);
        onSelect(defaultCurrency);
      }
    }
  }, [countries]);
  /*  
    🔥 Filter when user types OR modal opens  
  */
  useEffect(() => {
    if (!visible) return;

    const lower = search.toLowerCase();

    const list = search
      ? countries.filter((c) => {
          const nameMatch = c.name?.common?.toLowerCase().includes(lower);

          const currencyCode = Object.keys(c.currencies || {})[0]; // e.g. "USD", "NGN"
          const currencyMatch = currencyCode?.toLowerCase().includes(lower);

          return nameMatch || currencyMatch;
        })
      : countries;

    setFiltered(list);
  }, [search, visible, countries]);

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const handleSelect = (item: Country) => {
    const code = Object.keys(item.currencies ?? {})[0];
    const currencyObj: SelectedCurrency = {
      code,
      name: item.currencies?.[code]?.name ?? "",
      symbol: item.currencies?.[code]?.symbol ?? "",
      flag: item.flags.png,
    };

    setSelectedCurrency(currencyObj);
    setSearch("");
    onSelect(currencyObj);
    onClose?.();
  };

  const renderItem: ListRenderItem<Country> = useCallback(
    ({ item }) => {
      const code = Object.keys(item.currencies || {})[0];
      return (
        <TouchableOpacity
          style={[
            styles.item,
            selectedCurrency?.code === code && styles.selectedItem,
          ]}
          onPress={() => handleSelect(item)}
        >
          <Image source={{ uri: item.flags.png }} style={styles.flag} />
          <View style={styles.textGroup}>
            <Text style={styles.name}>{item.name.common}</Text>
            <Text style={styles.code}>{code}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [selectedCurrency]
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={globalStyles.container}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Select preferred currency</Text>
              <Pressable onPress={onClose} style={{ padding: 10 }}>
                <Text style={styles.close}>✕</Text>
              </Pressable>
            </View>

            {selectedCurrency && (
              <View style={styles.selectedInfo}>
                <Image
                  source={{ uri: selectedCurrency.flag }}
                  style={styles.flagLarge}
                />
                <Text style={styles.selectedText}>
                  {selectedCurrency.name} ({selectedCurrency.code})
                </Text>
              </View>
            )}

            <TextInput
              style={styles.search}
              placeholder="Search your currency..."
              placeholderTextColor="#ccc"
              value={search}
              onChangeText={handleSearch}
            />

            {loading ? (
              <ActivityIndicator size="large" color="#00ffcc" />
            ) : (
              <FlashList
                data={filtered}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.cca2}-${index}`}
                contentContainerStyle={{ paddingBottom: 24 }}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#121212",
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 18,
  },
  close: {
    color: "#fff",
    fontSize: 20,
  },
  selectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#1e1e1e",
    padding: 10,
    borderRadius: 8,
  },
  selectedText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  flagLarge: {
    width: 40,
    height: 25,
    borderRadius: 4,
  },
  search: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: "#fff",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: "#263238",
  },
  flag: {
    width: 32,
    height: 20,
    marginRight: 10,
    borderRadius: 3,
  },
  textGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  name: {
    color: "#fff",
    fontSize: 16,
  },
  code: {
    color: "#00ffcc",
    fontSize: 14,
  },
});
