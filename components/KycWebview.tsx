import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { colors } from "@/constants";
import WebView from "react-native-webview";
import * as Linking from "expo-linking";
import Spinner from "./Spinner";

interface pageProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  inquiry_id: string;
}
const KycWebview = ({ setShow, show, inquiry_id }: pageProps) => {
  const [url, setUrl] = useState<string | null>(null);

  const redirectUri = Linking.createURL("kyc-completed", {
    queryParams: { inquiry_id },
  });

  return (
    <>
      <Modal
        style={{ backgroundColor: colors.primary, flex: 1 }}
        transparent={true}
        visible={show}
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <WebView
            allowsBackForwardNavigationGestures
            mediaCapturePermissionGrantType="grant"
            javaScriptEnabled={true}
            source={{
              uri: `https://withpersona.com/verify?inquiry-id=${inquiry_id}&redirect-uri=${encodeURIComponent(
                redirectUri
              )}`,
            }}
            startInLoadingState
            style={{ flex: 1, width: "100%", height: "100%" }}
            renderLoading={() => (
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator
                  color="#0000ff"
                  size="large"
                  style={{ justifyContent: "center" }}
                />
              </View>
            )}
          />
        </View>
      </Modal>
    </>
  );
};

export default KycWebview;

const styles = StyleSheet.create({});
