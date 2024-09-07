import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Container/HomeScreen/Home";
import MenuScreen from "../Container/Menu";
import SearchScreen from "../Container/SearchScreen";
import PostScreen from "../Container/PostScreen"; // Ensure correct import path
import MassageScreen from "../Container/MassageScreen";
import { colors } from "../utils";
import { getKey, RfH, RfW } from "../utils/helper";

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        top: -20,
        justifyContent: "center",
        alignItems: "center",
        ...styles.shadow,
      }}
      onPress={onPress}
    >
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: colors.skyblue,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};

function BottomTabStack({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [requestcountdata, setRequestcountdata] = useState();

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handlePost = () => {
    setIsModalVisible(false);
    navigation.navigate("PostScreen");
  };

  const handleKyc = () => {
    setIsModalVisible(false);
    navigation.navigate("KycVarifyScreen");
  };

  const handlewRequest = () => {
    setIsModalVisible(false);
    navigation.navigate("Notification");
  };

  const fetchRequestdata = async () => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/cms/get-request-count/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return setRequestcountdata(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchRequestdata();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconSource;
            let iconStyle = {
              width: RfW(24),
              height: RfH(25),
              marginTop: RfH(12),
              tintColor: "#000",
            };

            if (route.name === "Home") {
              iconSource = focused
                ? require("../assets/images/home.png")
                : require("../assets/images/home.png");
            } else if (route.name === "SearchScreen") {
              iconSource = focused
                ? require("../assets/images/poll.png")
                : require("../assets/images/poll.png");
              iconStyle = {
                ...iconStyle,
                width: RfW(21),
                height: RfH(22),
                resizemode: "cover",
              };
            } else if (route.name === "ChatScreen") {
              iconSource = focused
                ? require("../assets/images/selectedchat.png")
                : require("../assets/images/chat.png");
            } else if (route.name === "MassageScreen") {
              iconSource = focused
                ? require("../assets/images/msg.png")
                : require("../assets/images/msg.png");
            } else if (route.name === "PostScreen") {
              iconSource = focused
                ? require("../assets/images/postimg.png")
                : require("../assets/images/plush.png");
            } else if (route.name === "MenuScreen") {
              iconSource = focused
                ? require("../assets/images/menu.png")
                : require("../assets/images/menu.png");
            }

            return <Image source={iconSource} style={iconStyle} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: colors.blue,
          inactiveTintColor: colors.black,
          animationDirection: "horizontal",
          transitionSpec: {
            open: { animation: "timing", config: { duration: 500 } },
            close: { animation: "timing", config: { duration: 500 } },
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "",
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{
            tabBarLabel: "",
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="PostScreen"
          component={PostScreen}
          options={{
            tabBarLabel: "",
            headerShown: false,
            tabBarButton: (props) => (
              <CustomTabBarButton {...props} onPress={toggleModal}>
                <Image
                  source={require("../assets/images/plush.png")}
                  style={{
                    width: RfW(28),
                    height: RfH(29),
                    tintColor: "#fff",
                  }}
                />
              </CustomTabBarButton>
            ),
          }}
        />
        <Tab.Screen
          name="MassageScreen"
          component={MassageScreen}
          options={{
            tabBarLabel: "",
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="MenuScreen"
          component={MenuScreen}
          options={{
            tabBarLabel: "",
            headerShown: false,
          }}
        />
      </Tab.Navigator>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: RfH(10),
              }}
            >
              <TouchableOpacity onPress={handlePost}>
                <View style={styles.imgcon}>
                  <Image
                    source={require("../assets/images/post.png")}
                    style={styles.imgstyle}
                  />
                </View>
                <Text style={styles.txtsty}>New Post</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleKyc}>
                <View style={styles.imgcon}>
                  <Image
                    source={require("../assets/images/KYC.png")}
                    style={styles.imgstyle}
                  />
                </View>
                <Text style={styles.txtsty}>Add Kyc</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlewRequest}>
                {requestcountdata?.total_pending_request > 0 ? (
                  <View style={styles.counterContainer}>
                    <Text style={styles.counterText}>
                      {requestcountdata?.total_pending_request}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.imgcon}>
                  <Image
                    source={require("../assets/images/Pending.png")}
                    style={styles.imgstyle}
                  />
                </View>
                <Text style={styles.txtsty}>Request</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={toggleModal} style={styles.modalbtnsty}>
              <Text style={styles.btntxtsty}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default BottomTabStack;

const styles = StyleSheet.create({
  bottomsheetcontainer: {
    height: RfH(200),
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  headersty: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 21,
    color: colors.black,
    fontFamily: "Poppins-Medium",
    alignSelf: "center",
    marginTop: RfH(10),
  },
  counterText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 10,
  },
  counterContainer: {
    position: "absolute",
    left: 35,
    top: -17,
    backgroundColor: "red",
    paddingHorizontal: 4,
    borderRadius: 10,
    paddingVertical: 2,
    alignItems: "flex-end",
  },
  bordersty: {
    borderBottomWidth: 1,
    borderColor: colors.DARK_GRAY,
    marginVertical: RfH(10),
    opacity: 0.2,
  },
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  modalbtnsty: {
    backgroundColor: colors.skyblue,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  imgstyle: {
    height: RfH(20),
    width: RfW(20),
    alignSelf: "center",
  },
  btntxtsty: {
    color: colors.WHITE,
    fontWeight: 14,
    fontWeight: "400",
  },
  imgcon: {
    borderWidth: 1,
    height: RfH(35),
    width: RfW(35),
    justifyContent: "center",
    borderRadius: 5,
    borderColor: colors.GRAY,
    backgroundColor: colors.shadwo_blue,
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: RfH(150),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  txtsty: {
    fontSize: 12,
    color: colors.primary_black,
    fontWeight: "500",
    top: 3,
  },
});
