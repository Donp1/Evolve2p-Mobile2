import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "@/utils/globalStyles";
import { router } from "expo-router";
import { colors } from "@/constants";
import { FontAwesome } from "@expo/vector-icons";
import { ms } from "react-native-size-matters";
import SelectDropdown from "@/components/SelectDropdown";
import { CountryDataProp } from "@/context";
import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";
import {
  deleteAccount,
  getAllCountries,
  updateUser,
} from "@/utils/countryStore";
import { useQuery } from "@tanstack/react-query";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import { useAlert } from "@/components/AlertService";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useUserStore } from "@/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentCountry, setCurrentCountry] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] =
    useState<CountryDataProp | null>(null);

  const { AlertComponent, showAlert } = useAlert();
  const user = useUserStore((state: any) => state.user);

  const {
    data: countriesData,
    error,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["countries"], queryFn: getAllCountries });

  useEffect(() => {
    setEmail(user?.email);
    setUsername(user?.username);
    setCurrentCountry(user?.country);
    setPhoneNumber(user?.phone);
    setDate(new Date(user?.DOB));
  }, []);

  useEffect(() => {
    if (!isLoading && !isError && countriesData) {
      const country = countriesData.find(
        (country: any) =>
          country?.name.common?.toLocaleLowerCase() ===
          currentCountry.toLocaleLowerCase()
      );

      const countryData: CountryDataProp = {
        name: country?.name.common,
        flag: country?.flags.png,
        phoneCode:
          country?.idd?.root +
          "" +
          String(country?.idd?.suffixes).split(",", 1)[0],
        abbrev: String(country?.cca2),
      };
      setSelectedCountry(countryData);
    }
  }, [phoneNumber, countriesData]);

  const handleUpdate = async () => {
    if (!phoneNumber || !selectedCountry || !date) {
      setLoading(false);
      showAlert(
        "Error",
        "Please fill in all fields",
        [{ onPress: () => {}, text: "Close" }],
        "error"
      );
      return;
    }

    const isNumberValid = isValidPhoneNumber(phoneNumber, {
      defaultCallingCode: selectedCountry?.phoneCode,
      defaultCountry: selectedCountry?.abbrev,
    });

    if (!isNumberValid) {
      setLoading(false);
      showAlert(
        "Error",
        "Phone number invalid format",
        [{ onPress: () => {}, text: "Close" }],
        "error"
      );
      return;
    }

    
    setLoading(true);
    const userUpdate = await updateUser({
      country: selectedCountry.name,
      DOB: date,
      phone: phoneNumber,
    });

    console.log(updateUser);

    if (!userUpdate?.success) {
      setLoading(false);
      showAlert(
        "Error",
        userUpdate?.message,
        [{ onPress: () => {}, text: "Close" }],
        "error"
      );
      return;
    }

    const res = await getItemAsync("authToken");
    if (res) {
      const parsedUser = JSON.parse(res);
      parsedUser.user.DOB = date;
      parsedUser.user.country = selectedCountry?.name;
      parsedUser.user.phone = phoneNumber;

      setDate(parsedUser.user.DOB);
      setCurrentCountry(parsedUser.user.country);
      setPhoneNumber(parsedUser.user.phone);

      await setItemAsync("authToken", JSON.stringify(parsedUser));
    }

    showAlert(
      "Successfull",
      userUpdate?.message,
      [{ onPress: () => {}, text: "Close" }],
      "success"
    );
    setLoading(false);
  };

  const hanldeDelete = async () => {
    try {
      showAlert(
        "Account Deletion: Not reversable",
        "Are you sure?",
        [
          {
            onPress: async () => {
              const res = await deleteAccount();
              if (res?.success) {
                await deleteItemAsync("authToken");
                router.replace("/");
              }
            },
            text: "Yes",
            style: { backgroundColor: colors.red },
            textStyle: { color: colors.primary },
          },
          {
            onPress: () => {},
            text: "No",
            style: { backgroundColor: colors.accent },
            textStyle: { color: colors.primary },
          },
        ],
        "info"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const goBack = () => {
    if (router.canGoBack()) router.back();
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      {AlertComponent}
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
            Edit Profile
          </Text>
        </Pressable>
        {loading ? (
          <View style={{ paddingHorizontal: 15 }}>
            <ActivityIndicator size="large" color="#4caf50" />
          </View>
        ) : (
          <Pressable style={{ paddingVertical: 10 }} onPress={handleUpdate}>
            <Text
              style={{
                fontSize: ms(14),
                fontWeight: 700,
                color: colors.accent,
                paddingHorizontal: 15,
              }}
            >
              Save
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.primary }}
      >
        <View style={{ paddingHorizontal: 15, marginVertical: 20 }}>
          <View style={globalStyles.form}>
            <View style={{ gap: 10 }}>
              <Text style={globalStyles.formLabel}>Email</Text>
              <View style={globalStyles.formInputContainer}>
                <TextInput
                  defaultValue={email}
                  editable={false}
                  style={globalStyles.formInput}
                />
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <Text style={styles.formLabel}>Username</Text>
              <View style={styles.formContainer}>
                <View style={styles.formInputContainer}>
                  <Text
                    style={{
                      color: colors.secondary,
                      fontWeight: 400,
                      fontSize: ms(14),
                    }}
                  >
                    @
                  </Text>
                  <TextInput
                    style={globalStyles.formInput}
                    placeholder="Enter your username"
                    placeholderTextColor={colors.secondary}
                    onChangeText={(e) => setUsername(e)}
                    defaultValue={username}
                    editable={false}
                  />
                </View>

                <View style={styles.formContainerBottom}>
                  <Text
                    style={{
                      fontSize: ms(12),
                      fontWeight: 400,
                      color: colors.secondary,
                      lineHeight: 20,
                    }}
                  >
                    Your unique identity
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <Text style={styles.formLabel}>Country</Text>

              <SelectDropdown
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
              />
            </View>

            <View style={{ gap: 10 }}>
              <Text style={styles.formLabel}>Date of Birth</Text>
              <View style={styles.formInputContainer}>
                <Pressable
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  onPress={() => {
                    DateTimePickerAndroid.open({
                      value: date || new Date(),
                      mode: "date",
                      display: "calendar",
                      onChange: (event, selectedDate) => {
                        if (selectedDate) setDate(selectedDate);
                      },
                      maximumDate: new Date(),
                    });
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Image
                      priority={"high"}
                      source={require("@/assets/images/dateIcon.png")}
                      contentFit="contain"
                      style={{ width: 18, height: 18 }}
                    />
                    <Text style={{ color: colors.secondary }}>
                      {date
                        ? date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                        : "Select DOB"}
                    </Text>
                  </View>
                  <FontAwesome
                    name="chevron-down"
                    color={colors.secondary}
                    size={ms(15)}
                  />
                </Pressable>
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <Text style={styles.formLabel}>Phone Number</Text>
              <View style={styles.phonenumberContainer}>
                <Pressable style={styles.phoneCode}>
                  <Text style={styles.phoneCodeText}>
                    {selectedCountry?.phoneCode}
                  </Text>
                </Pressable>
                <TextInput
                  keyboardType="phone-pad"
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.secondary}
                  style={styles.phoneInput}
                  onChangeText={(e) => setPhoneNumber(e)}
                  defaultValue={phoneNumber}
                />
              </View>
            </View>

            <View>
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: ms(12),
                  color: colors.secondary,
                  width: "90%",
                }}
              >
                Deleting your account is permanent and cannot be undone. All
                your data, including transaction history and saved preferences,
                will be erased. You will no longer have access to your account.
              </Text>

              <Pressable
                onPress={hanldeDelete}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 20,
                  justifyContent: "center",
                  paddingVertical: 10,
                }}
              >
                <FontAwesome size={ms(13)} color={colors.red} name="trash" />
                <Text
                  style={{
                    fontWeight: 700,
                    fontSize: ms(12),
                    color: colors.red,
                  }}
                >
                  Delete Account
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  form: {
    display: "flex",
    gap: 10,
  },
  formLabel: {
    fontWeight: 200,
    color: colors.secondary,
    fontSize: ms(14),
    lineHeight: 24,
  },
  formInputContainer: {
    backgroundColor: colors.gray2,
    paddingHorizontal: 10,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  formContainer: {
    display: "flex",
    borderRadius: 8,
    overflow: "hidden",
  },
  formContainerBottom: {
    marginVertical: "auto",
    backgroundColor: colors.gray,
    paddingVertical: 4,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  formInput: {
    flex: 1,
    color: colors.secondary,
    fontSize: ms(14),
    fontWeight: 500,
  },
  phonenumberContainer: {
    backgroundColor: colors.gray2,
    height: ms(56),
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  phoneCode: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.gray,
    borderRadius: 100,
  },
  phoneCodeText: {
    color: colors.secondary,
    fontWeight: 400,
  },
  phoneInput: {
    flex: 1,
    color: colors.secondary,
    fontWeight: 400,
  },
});
