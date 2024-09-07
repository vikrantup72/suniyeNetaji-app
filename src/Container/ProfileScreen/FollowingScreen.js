import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";

import { RfH, RfW, getKey } from "../../utils/helper";
import { colors } from "../../utils";
import { useNavigation } from "@react-navigation/native";
import { useAndroidBackHandler } from "react-navigation-backhandler";

const FollowingScreen = () => {
  const navigation = useNavigation();
  const [datas, setDatas] = useState([]);
  const [loader, setLoader] = useState(false);
  console.log(JSON.stringify(datas), "FollowingScreengchgcg");

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false; // Let the system handle the back button event
  });

  const FollowRequest = async () => {
    setLoader(true);
    try {
      const token = await getKey("AuthKey");
      const requestOptions = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/account/follow-unfollow/?type=following_detail",
        requestOptions
      );
      if (response.ok) {
        const responseData = await response.json();
        // Extract the followers list from the response data
        const followers = responseData.results?.[0]?.following ?? [];
        setDatas(followers);
      } else {
        console.error("Error response:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    FollowRequest();
  }, []);

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.container}>
      {loader ? (
        <ActivityIndicator
          size="small"
          color={colors.skyblue}
          style={styles.loadersty}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: RfW(15),
              paddingVertical: RfH(10),
              borderBottomWidth: 1,
              borderBottomColor: colors.GRAY,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftItem}
            >
              <Icon name="left" size={20} color={colors.black} />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Following</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingTop: RfH(15),
            }}
          ></View>
          <View style={styles.container1}>
            <FlatList
              data={datas}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.flatlistcontainer}>
                  <TouchableOpacity
                    style={styles.profileContainer}
                    onPress={() => navigation.navigate("UserProfile", { item })}
                  >
                    <View style={styles.imgcontainer}>
                      {item.picture ? (
                        <Image
                          source={{
                            uri: `https://stage.suniyenetajee.com${item.picture}`,
                          }}
                          style={styles.profileImage}
                        />
                      ) : (
                        <Image
                          source={require("../../assets/images/dummyplaceholder.png")}
                          style={styles.profileImage}
                        />
                      )}
                    </View>
                    <View style={styles.msgcontainer}>
                      <Text style={styles.namesty}>
                        {item.full_name.length > 16
                          ? `${item.full_name.slice(0, 16)}...`
                          : item.full_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.followContainer}>
                    <Text style={styles.followText}>Following</Text>
                  </View>
                </View>
              )}
              ItemSeparatorComponent={renderSeparator}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FollowingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  loadersty: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingMoreContainer: {
    paddingVertical: RfH(10),
    alignItems: "center",
  },
  container1: {
    flex: 1,
    paddingHorizontal: RfW(20),
    // marginTop: RfH(15),
  },
  leftItem: {
    padding: RfH(5),
  },
  nodata: {
    alignSelf: "center",
    marginTop: "90%",
  },
  separator: {
    height: 1,
    width: "97%",
    backgroundColor: colors.primary_black,
    opacity: 0.1,
  },
  title: {
    fontSize: 20,
    top: RfH(3),
    fontWeight: "500",
    color: colors.black,
    fontFamily: "Poppins-Medium",
    alignSelf: "center",
    position: "absolute",
    left: RfW(90),
  },
  flatlistcontainer: {
    flexDirection: "row",
    marginVertical: RfH(15),
    width: "100%",
    justifyContent: "space-between",
  },
  txtsty: {
    color: colors.black,
    fontFamily: "Poppins-Regular",
  },
  msgcontainer: {
    paddingHorizontal: RfW(10),
    justifyContent: "center",
    bottom: RfH(5),
  },
  imgcontainer: {
    backgroundColor: colors.GRAY,
    height: RfH(32),
    width: RfW(32),
    borderRadius: RfH(16),
    justifyContent: "center",
  },
  profileImage: {
    height: RfH(34),
    width: RfW(34),
    borderRadius: RfH(16),
    alignSelf: "center",
    resizeMode: "cover",
  },
  namesty: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22.5,
    color: colors.primary_blue,
    fontFamily: "Poppins-Regular",
    top: 4,
  },
  followContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: RfW(10),
    backgroundColor: colors.backgroundfadeColor,
    paddingHorizontal: RfW(8),
    borderRadius: RfH(8),
  },
  followText: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 22.5,
    color: colors.black,
    fontFamily: "Poppins-Regular",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
