import { StyleSheet } from "react-native";
import { colors } from "../../utils";
import { RfH, RfW } from "../../utils/helper";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.WHITE,
    },
    homecontainer: {
      paddingHorizontal: RfW(20),
      marginTop: RfH(20),
    },
    prooftxtsty: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.black,
    },
    suggesttxt: {
      fontSize: 12,
      color: colors.black,
      marginTop: RfH(5),
    },
    proofimgcon: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: RfH(20),
      marginHorizontal: RfW(20),
    },
    idproofsty: {
      borderWidth: 1,
      borderColor: colors.skyblue,
      borderRadius: RfH(10),
      padding: RfH(20),
      alignItems: "center",
      justifyContent: "center",
      width: RfW(120),
      height: RfH(120),
    },
    mediatxt: {
      fontSize: 14,
      color: colors.DARK_GRAY,
      marginTop: RfH(5),
    },
    btnsty: {
      position: "absolute",
      // bottom: 10,
      alignSelf: "center",
      backgroundColor: colors.skyblue,
      height: RfH(40),
      width: "92%",
      borderRadius: 8,
      justifyContent: "center",
    },
    btnsty1: {
      position: "absolute",
      bottom: 0,
      alignSelf: "center",
      backgroundColor: colors.WHITE,
      height: RfH(40),
      width: "100%",
      borderRadius: 8,
      justifyContent: "center",
      height: 60,
    },
    btntxtsty: {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 19.5,
      color: colors.WHITE,
      alignSelf: "center",
    },
    imagePreview: {
      width: RfH(120),
      height: RfH(113),
      borderRadius: RfH(10),
      marginVertical: RfH(10),
    },
    placeholderContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    videocontainer: {
      borderWidth: 1,
      height: RfH(40),
      justifyContent: "center",
      paddingHorizontal: RfW(10),
      marginTop: RfH(20),
      borderRadius: RfH(8),
      borderColor: colors.skyblue,
    },
    recordtxtsty: {
      fontSize: 16,
      fontWeight: "400",
    },
    videoPreviewContainer: {
      marginTop: RfH(10),
      marginBottom: RfH(90),
    },
    videotxt: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.black,
      paddingVertical: RfH(10),
    },
    videoPreview: {
      width: "100%",
      height: 200,
      borderRadius: 10,
      resizeMode: "cover",
      borderWidth: 0.8,
      borderRadius: 8,
      borderColor: colors.skyblue,
    },
  });