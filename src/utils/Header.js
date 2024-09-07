import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { RfH, RfW } from "./helper";
import { useNavigation } from "@react-navigation/native";
import { colors } from ".";
import { useDispatch, useSelector } from "react-redux";
import { RequestCount } from "../redux/SocialReducer";
import FeatherIcon from "react-native-vector-icons/Feather";

const Header = ({
  HeaderTxt,
  onPress,
  ProfileImage,
  HomeheaderTxt,
  EditKyc,
  showNotificationIcon = true,
  showEditIcon = false,
}) => {
  const dispatch = useDispatch();
  const requestcountdata = useSelector(
    (state) => state.social.requestcountData
  );
console.log(requestcountdata,'requestcountdata');


  useEffect(() => {
    dispatch(RequestCount());
  }, [dispatch]);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {!HomeheaderTxt && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.leftItem}
        >
          <Icon name="left" size={20} color={colors.black} />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { left: HomeheaderTxt ? 3 : null }]}>
        {HomeheaderTxt || HeaderTxt}
      </Text>

      <View style={styles.profileContainer}>
        {showNotificationIcon && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("TotalNotification")}
            style={styles.bellicon}
          >
            <Image source={ProfileImage} style={styles.profileImage} />
            {ProfileImage && requestcountdata?.total_notification_count > 0 ? (
              <View style={styles.counterContainer}>
                <Text style={styles.counterText}>
                  {requestcountdata?.total_notification_count}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        )}

        {showEditIcon && (
          <TouchableOpacity activeOpacity={0.8} onPress={EditKyc}>
            <FeatherIcon
              name="edit"
              size={20}
              color={colors.black}
              style={{ alignSelf: "center", top: 3 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: RfW(15),
    paddingVertical: RfH(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY,
  },
  leftItem: {
    padding: RfH(5),
    top: 3,
  },
  title: {
    fontSize: 20,
    top: RfH(3),
    fontWeight: "500",
    color: colors.black,
  },
  profileContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  profileImage: {
    height: RfH(20),
    width: RfW(20),
    alignSelf: "center",
  },
  counterContainer: {
    position: "absolute",
    left: 10,
    top: -8,
    backgroundColor: "red",
    paddingHorizontal: 4,
    borderRadius: 10,
    paddingVertical: 2,
  },
  counterText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 10,
  },
  plushiconsty: {
    fontSize: RfH(18),
    fontWeight: "500",
    alignSelf: "center",
    color: colors.WHITE,
    bottom: RfH(2.8),
  },
  plusiconcon: {
    backgroundColor: "#000",
    height: 22,
    width: 22,
    borderRadius: 12,
    justifyContent: "center",
    borderWidth: 1,
  },
  bellicon: {
    // right: RfW(2),
  },
});
