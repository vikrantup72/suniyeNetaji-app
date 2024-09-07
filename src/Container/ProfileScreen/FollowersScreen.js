import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { colors } from "../../utils";
import { RfH, RfW, getKey } from "../../utils/helper";
import Icon from "react-native-vector-icons/AntDesign";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import { useNavigation } from "@react-navigation/native";

const FollowersScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFollower, setSelectedFollower] = useState(null);

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false; // Let the system handle the back button event
  });

  const getFollowersList = async (url) => {
    if (loading || loadingMore) return;

    if (url) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      url =
        "https://stage.suniyenetajee.com/api/v1/account/follow-unfollow/?type=follower_detail";
    }

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
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        const responseData = await response.json();
        setFollowers((prevFollowers) => [
          ...prevFollowers,
          ...responseData.results[0].followers,
        ]);
        setNextPageUrl(responseData.next);
      } else {
        console.error("Error response:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    getFollowersList();
  }, []);

  const confirmRemoveFollower = (follower) => {
    setSelectedFollower(follower);
    setModalVisible(true);
  };

  const handleRemoveFollower = async () => {
    const id = selectedFollower?.id;
    console.log("Attempting to remove follower with ID:", id);
    const url =
      "https://stage.suniyenetajee.com/api/v1/account/follow-unfollow/";
    console.log("URL:", url);
    try {
      const token = await getKey("AuthKey");
      const formData = new FormData();
      formData.append("id", id);
      formData.append("type", "remove");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Token ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        setFollowers((prevFollowers) =>
          prevFollowers.filter((follower) => follower.id !== id)
        );
        console.log("Follower removed successfully");
      } else {
        const responseBody = await response.text();
        console.error(
          "Error response:",
          response.status,
          response.statusText,
          responseBody
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setModalVisible(false);
    }
  };

  const renderSeparator = () => <View style={styles.separator} />;

  const renderNoRepliesMessage = () => {
    if (followers.length === 0 && !loading) {
      return (
        <View style={styles.nodata}>
          <Text style={styles.txtsty}>
            You have no pending requests at the moment.
          </Text>
        </View>
      );
    }
    return null;
  };

  const handleLoadMore = () => {
    if (nextPageUrl) {
      getFollowersList(nextPageUrl);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.title}>Followers</Text>
        </View>
      </View>
      {loading && !loadingMore ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={colors.skyblue} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingTop: RfH(15),
            }}
          ></View>
          <View style={styles.container1}>
            <FlatList
              data={followers}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={renderNoRepliesMessage}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.flatlistcontainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.profileContainer}
                    onPress={() => navigation.navigate("UserProfile", { item })}
                  >
                    <View style={styles.imgcontainer}>
                      {item.picture ? (
                        <Image
                          source={{
                            uri: `https://stage.suniyenetajee.com/${item.picture}`,
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
                  <TouchableOpacity
                    style={styles.followContainer}
                    onPress={() => confirmRemoveFollower(item)}
                  >
                    <Text style={styles.followText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
              ItemSeparatorComponent={renderSeparator}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loadingMore ? (
                  <View style={styles.loadingMoreContainer}>
                    <ActivityIndicator size="small" color={colors.skyblue} />
                  </View>
                ) : null
              }
            />
          </View>
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to remove this follower?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonRemove]}
                onPress={handleRemoveFollower}
              >
                <Text style={styles.textStyle}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FollowersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
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
    top: RfH(3),
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    color: colors.black,
    fontFamily: "Poppins-Regular",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "45%",
  },
  buttonClose: {
    backgroundColor: colors.skyblue,
  },
  buttonRemove: {
    backgroundColor: "red",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
