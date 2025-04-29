import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "expo-router/build/hooks";
import { globalStyles } from "@/utils/globalStyles";
import { getVerificationStatus, updateUser } from "@/utils/countryStore";
import Spinner from "@/components/Spinner";
import { ms } from "react-native-size-matters";
import { colors } from "@/constants";
import KycSuccess from "@/components/KycSuccess";
import KycFailed from "@/components/KyCFailed";
import { useAlert } from "@/components/AlertService";
import { getItemAsync, setItemAsync } from "expo-secure-store";

const KYCCompleted = () => {
  const [status, setStatus] = useState("");
  const [loading, setIsLoading] = useState(false);

  const { showAlert, AlertComponent } = useAlert();
  const router = useRouter();

  const path = useSearchParams();
  const id = path.get("inquiry_id");

  useEffect(() => {
    (async () => {
      if (!id) {
        router.push("/kycVerification");
        return;
      }
      setIsLoading(true);
      const data = await getVerificationStatus(id);
      if (data?.status == "completed") {
        const res = await updateUser({ kycVerified: true });
        if (res?.success) {
          setStatus(data?.status);
          const res = await getItemAsync("authToken");
          if (res) {
            const parsedUser = JSON.parse(res);
            parsedUser.user.kycVerified = true;
            await setItemAsync("authToken", JSON.stringify(parsedUser));
            setIsLoading(false);
          }
        } else {
          showAlert(
            "Error",
            res?.message,
            [
              {
                text: "Retry Verification",
                onPress() {
                  router.push("/kycVerification");
                },
              },
            ],
            "error"
          );
        }
      } else {
        setStatus(data?.status);
        setIsLoading(false);
      }
    })();
  }, [id]);
  return (
    <SafeAreaView style={globalStyles.container}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Spinner width={40} height={40} />
          </View>
        ) : (
          <View>
            {status == "completed" ? (
              <KycSuccess status={status} />
            ) : (
              <KycFailed status={status} />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default KYCCompleted;

const styles = StyleSheet.create({});
