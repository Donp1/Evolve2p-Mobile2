import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";
import { colors } from "@/constants";
import { ms, vs } from "react-native-size-matters";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BottomSheet from "./BottomSheet";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import { openDispute } from "@/utils/countryStore";
import { useAlert } from "./AlertService";
import Spinner from "./Spinner";
import { set } from "lodash";

interface DisputeViewProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentTrade: any;
  setRefreshKey: Dispatch<SetStateAction<number>>;
  type?: string;
}

const DisputeView = ({
  isOpen,
  setIsOpen,
  currentTrade,
  setRefreshKey,
  type,
}: DisputeViewProps) => {
  const [reasons, setReasons] = React.useState<string[]>([]);
  const [openReason, setOpenReason] = React.useState(false);
  const [selectedReason, setSelectedReason] = React.useState(reasons[0]);

  const [file, setFile] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [description, setDescription] = useState("");
  const [isDisputing, setIsDisputing] = useState(false);
  const { AlertComponent, showAlert } = useAlert();

  useEffect(() => {
    setReasons(
      type == "seller"
        ? [
            "Payment not received",
            "Paid wrong amount",
            "Received wrong payment details",
            "Transaction Limit",
            "Other (please specify)",
          ]
        : [
            "I paid, but the seller hasn’t released the funds",
            "Seller is not releasing payment despite the completed transfer.",
            "Payment done, waiting for seller to release funds.",
            "Seller ignoring me and not releasing funds.",
            "I’ve completed payment; seller hasn’t released crypto.",
            "Other (please specify)",
          ]
    );

    setSelectedReason(
      type == "seller"
        ? "Payment not received"
        : "I paid, but the seller hasn’t released the funds"
    );
  }, [currentTrade, type]);

  // Pick file (image or PDF)
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*"],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (
      result.assets &&
      result.assets[0].size &&
      result.assets[0].size > 5 * 1024 * 1024
    ) {
      Alert.alert("File too large", "Please select a file smaller than 5MB.");
      return;
    }

    if (!result.canceled && result.assets?.length > 0) {
      setFile(result.assets[0]);
    }
  };

  const handleDisputeSubmit = async () => {
    setIsDisputing(true);
    if (!selectedReason || !file) {
      showAlert(
        "Error",
        "Please select a reason and upload a file.",
        [{ text: "Close", onPress: () => {} }],
        "error"
      );
      setIsDisputing(false);
      return;
    }
    const res = await openDispute(
      selectedReason,
      currentTrade?.id,
      file,
      description
    );

    if (res?.error) {
      showAlert(
        "Error",
        res?.message,
        [{ text: "Close", onPress: () => {} }],
        "error"
      );
      setIsDisputing(false);
      return;
    }

    if (res?.success) {
      showAlert(
        "Success",
        res?.message || "Dispute opened successfully.",
        [
          {
            text: "Continue",
            onPress: () => {
              setIsOpen(false);
              setRefreshKey((prevKey) => prevKey + 1);
            },
          },
        ],
        "success"
      );
      setIsDisputing(false);
      // Reset form
      setSelectedReason(reasons[0]);
      setFile(null);
      setDescription("");
    }
  };

  return (
    <>
      <Modal animationType="slide" transparent visible={isOpen}>
        <SafeAreaView style={globalStyles.container}>
          {AlertComponent}
          <View style={styles.container}>
            <KeyboardAwareScrollView
              contentContainerStyle={{ flexGrow: 1, padding: 20 }}
              enableOnAndroid={true}
              extraScrollHeight={20} // pushes content above keyboard
            >
              <View>
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: ms(16),
                    color: colors.white2,
                    marginBottom: 20,
                  }}
                >
                  Open a Dispute
                </Text>
                <Text
                  style={{
                    fontWeight: 400,
                    fontSize: ms(14),
                    color: colors.gray4,
                    lineHeight: 20,
                    marginBottom: 20,
                  }}
                >
                  Disputes help protect you when something goes wrong during a
                  trade.
                </Text>
                <Text
                  style={{
                    fontWeight: 400,
                    fontSize: ms(14),
                    color: colors.gray4,
                    lineHeight: 20,
                    marginBottom: 20,
                  }}
                >
                  Please provide clear details and supporting documents so we
                  can resolve this quickly.
                </Text>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: 400,
                    fontSize: ms(14),
                    color: colors.gray4,
                    lineHeight: 20,
                  }}
                >
                  Reason for Dispute
                </Text>
                <Pressable
                  onPress={() => setOpenReason(true)}
                  style={globalStyles.sectionBox}
                >
                  <View style={globalStyles.sectionMain}>
                    <Text
                      style={{
                        fontWeight: 400,
                        fontSize: ms(14),
                        color: colors.white2,
                        lineHeight: 20,
                      }}
                    >
                      {selectedReason}
                    </Text>
                    <Entypo
                      name="chevron-down"
                      size={24}
                      color={colors.secondary}
                    />
                  </View>
                </Pressable>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: 400,
                    fontSize: ms(14),
                    color: colors.gray4,
                    lineHeight: 20,
                  }}
                >
                  Explain the issue (Optional)
                </Text>
                <View style={[globalStyles.sectionBox, { paddingTop: 0 }]}>
                  <TextInput
                    placeholder="Describe what happened during the trade"
                    multiline
                    style={{
                      height: ms(150),
                      fontWeight: 400,
                      fontSize: ms(14),
                      color: colors.gray4,
                    }}
                    placeholderTextColor={colors.gray3}
                    textAlignVertical="top"
                    onChangeText={(text) => setDescription(text)}
                    defaultValue={description}
                  />
                </View>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: 400,
                    fontSize: ms(14),
                    color: colors.gray4,
                    lineHeight: 20,
                  }}
                >
                  Upload Evidence
                </Text>
                <Pressable
                  onPress={pickFile}
                  style={[
                    globalStyles.sectionBox,
                    { padding: 0, overflow: "hidden" },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Ionicons
                        name="document-text-outline"
                        size={20}
                        color={colors.secondary}
                      />
                      <Text
                        style={{
                          fontWeight: 500,
                          fontSize: ms(14),
                          color: colors.white2,
                          lineHeight: 20,
                        }}
                      >
                        Click to Upload
                      </Text>
                    </View>
                    <Feather
                      name="upload"
                      size={ms(20)}
                      color={colors.secondary}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: colors.gray,
                      paddingVertical: 4,
                      paddingHorizontal: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 400,
                        fontSize: ms(12),
                        color: colors.secondary,
                        lineHeight: 20,
                      }}
                    >
                      Max size: 5MB, Max 1 files, JPEG, PNG, or PDF only
                    </Text>
                  </View>
                </Pressable>
                {file && (
                  <>
                    {/* Preview for Images */}
                    {file.mimeType?.startsWith("image/") ? (
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Pressable
                          style={{ alignSelf: "center" }}
                          onPress={() => setModalVisible(true)}
                        >
                          <Image
                            source={{ uri: file.uri }}
                            style={styles.preview}
                          />
                        </Pressable>
                      </View>
                    ) : (
                      // Preview for PDF
                      <View style={styles.pdfPreview}>
                        <Ionicons
                          name="document-text-outline"
                          size={40}
                          color="#4DF2BE"
                        />
                        <Text style={{ color: "white", marginTop: 5 }}>
                          {file.name}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </View>
            </KeyboardAwareScrollView>

            <View style={styles.bottom}>
              <Pressable
                onPress={handleDisputeSubmit}
                disabled={!selectedReason || !file || isDisputing}
                style={[
                  globalStyles.btn,
                  {
                    width: "100%",
                    backgroundColor: colors.red,
                    opacity: !selectedReason || !file || isDisputing ? 0.5 : 1,
                  },
                ]}
              >
                {isDisputing ? (
                  <Spinner width={20} height={20} />
                ) : (
                  <Text style={globalStyles.btnText}>Submit Dispute</Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => setIsOpen(false)}
                style={[
                  globalStyles.btn,
                  { width: "100%", backgroundColor: colors.gray2 },
                ]}
              >
                <Text style={[globalStyles.btnText, { color: colors.white2 }]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Fullscreen Modal for Image */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={28} color="white" />
          </Pressable>
          <Image
            contentFit="fill"
            source={{ uri: file?.uri }}
            style={styles.fullImage}
          />
        </View>
      </Modal>

      <BottomSheet setVisible={setOpenReason} visible={openReason}>
        <View>
          {reasons.map((reason, index) => {
            const isSelected = selectedReason === reason;

            return (
              <Pressable
                key={index}
                onPress={() => {
                  setSelectedReason(reason);
                  setOpenReason(false);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: vs(12),
                  paddingHorizontal: ms(20),
                  borderRadius: ms(8),
                  marginVertical: vs(4),
                  backgroundColor: isSelected ? "#2D2D2D" : "transparent",
                }}
              >
                <Text
                  style={{
                    color: isSelected ? "#4DF2BE" : colors.white2,
                    fontWeight: isSelected ? "600" : "400",
                  }}
                >
                  {reason}
                </Text>

                {isSelected && (
                  <Ionicons name="checkmark" size={20} color="#4DF2BE" />
                )}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </>
  );
};

export default DisputeView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
    flex: 1,
  },
  bottom: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    marginTop: "auto",
    gap: 10,
  },
  preview: {
    width: 100,
    height: 100,
    marginTop: vs(20),
    borderRadius: ms(8),
  },
  pdfPreview: {
    marginTop: vs(20),
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
});
