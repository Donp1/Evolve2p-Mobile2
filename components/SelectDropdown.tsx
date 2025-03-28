import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getAllCountries } from "@/utils/countryStore";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { Image } from "expo-image";
import CustomDropdown from "./CustomeDropdown";

interface pageProps {
  setSelectedCountry: React.Dispatch<React.SetStateAction<DataProp | null>>;
  selectedCountry: DataProp | null;
}
export interface DataProp {
  name: string;
  flag: string;
  phoneCode?: string;
  abbrev: any;
}

export type myCountriesDataProps = DataProp[];

const SelectDropdown = ({ selectedCountry, setSelectedCountry }: pageProps) => {
  const [countries, setCountries] = useState<myCountriesDataProps>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  //   <Pressable
  //     style={{
  //       width: "100%",
  //       flexDirection: "row",
  //       alignItems: "center",
  //       paddingVertical: 10,
  //       paddingHorizontal: 10,
  //       justifyContent: "space-between",
  //     }}
  //     onPress={() => handleItemSelect(item)}
  //   >
  //     <Item
  //       onPress={() => handleItemSelect(item)}
  //       selected={selected}
  //       selectedItem={item}
  //       item={item}
  //     />
  //     <View
  //       style={[
  //         styles.radio,
  //         selectedItem?.name == item.name && { borderColor: "green" },
  //       ]}
  //     />
  //   </Pressable>
  // );

  const {
    data: countriesData,
    error,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["countries"], queryFn: getAllCountries });

  if (isError) console.log(error);

  useEffect(() => {
    if (!isLoading && !isError && countriesData) {
      const myCountriesData: myCountriesDataProps = [];

      countriesData.map((country: any) => {
        const countryData: DataProp = {
          name: country?.name.common,
          flag: country?.flags.png,
          phoneCode:
            country?.idd?.root +
            "" +
            String(country?.idd?.suffixes).split(",", 1)[0],
          abbrev: String(country?.cca2),
        };
        myCountriesData.push(countryData);
      });
      setCountries(
        myCountriesData.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
      );
    }
  }, [isLoading, isError, countriesData]);

  return (
    <View style={styles.container}>
      <View
        style={[
          {
            backgroundColor: colors.gray2,
            borderWidth: 0,
            width: "100%",
            borderRadius: 5,
            overflow: "hidden",
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
          },
          selectedCountry && { borderWidth: 1, borderColor: "green" },
        ]}
      >
        <View
          style={{
            width: 50,
            height: 20,
            position: "absolute",
          }}
        >
          <Image
            source={{ uri: selectedCountry?.flag }}
            contentFit="contain"
            contentPosition="center"
            style={{ flex: 1 }}
          />
        </View>

        <CustomDropdown
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          selectedItem={selectedCountry}
          setSelectedItem={setSelectedCountry}
          data={countries}
        />
      </View>
    </View>
  );
};

export default SelectDropdown;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  selectButton: {
    padding: 12,
    backgroundColor: colors.gray2,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    height: ms(50),
  },
  buttonText: {
    color: colors.secondary,
    fontSize: ms(14),
    fontWeight: 500,
  },
  dropdown: {
    width: "100%",
    overflow: "hidden",
    marginTop: 10,
    backgroundColor: colors.gray2,
    borderRadius: 8,
    elevation: 5,
  },

  item: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
