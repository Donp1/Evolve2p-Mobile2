import { colors } from "@/constants";
import { divide } from "lodash";
import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";
import { ms } from "react-native-size-matters";

const { width } = Dimensions.get("window");
const itemWidth = (width - 40) / 2;

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray2,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topBar: {
    width: "100%",
    height: "auto",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    flexDirection: "row",
  },
  form: {
    display: "flex",
    gap: 10,
  },
  formLabel: {
    fontWeight: 200,
    color: colors.white,
    fontSize: ms(14),
    lineHeight: 24,
    marginTop: 10,
  },
  formInputContainer: {
    backgroundColor: colors.gray2,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  formInput: {
    flex: 1,
    color: colors.secondary,
    fontSize: 14,
    fontWeight: 200,
  },
  bottomContainer: {
    marginVertical: "auto",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 20,
    paddingHorizontal: 20,
    // paddingBottom: 20,
    flex: 1,
    position: "fixed",
    bottom: 0,
    width: "100%",
  },
  eye: {
    color: colors.secondary,
    fontWeight: 500,
    fontSize: 16,
    padding: 10,
  },
  btn: {
    backgroundColor: "#4DF2BE",
    width: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    paddingVertical: 12,
  },
  btnText: {
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: 1,
    color: colors.primary,
  },
  link: {
    fontWeight: 700,
    color: colors.secondary,
    fontSize: 14,
  },
  card: {
    width: "40%",
    height: 120,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 10,
  },
  sectionBox: {
    borderRadius: 8,
    backgroundColor: colors.gray2,
    padding: 10,
    marginTop: 10,
  },
  sectionMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: ms(15),
    width: "100%",
  },

  top: {
    backgroundColor: colors.gray2,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  middle: {
    backgroundColor: colors.gray2,
    // borderTopRightRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottom: {
    backgroundColor: colors.gray2,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
