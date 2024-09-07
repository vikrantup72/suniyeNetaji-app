import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
// import BestPolitician from "./BestPolitician";
import Post from "./Post";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchData } from "../../redux/PostReducer";
import { RequestCount, fetchnearbyData } from "../../redux/SocialReducer";
import { RfH, RfW } from "../../utils/helper";
import mobileAds from "react-native-google-mobile-ads";
import Header from "../../utils/Header";

const Home = () => {
  // useEffect(() => {
  // 	mobileAds()
  // 		.initialize()
  // 		.then((adapterStatuses) => {
  // 			console.log(adapterStatuses, "adapterStatuses");
  // 		});
  // }, []);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  // const renderItem = useCallback(
  //   ({ item }) => <View style={styles.item}>{item.component}</View>,
  //   []
  // );

  const keyExtractor = useCallback((item) => item.key, []);

  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   Promise.all([
  //     dispatch(fetchData()),
  //     dispatch(fetchnearbyData()),
  //     dispatch(RequestCount()),
  //   ]).finally(() => setRefreshing(false));
  // }, []);

  useEffect(() => {
    const fetchDataOnMount = async () => {
      await Promise.all([
        dispatch(fetchData()),
        dispatch(fetchnearbyData()),
        dispatch(RequestCount()),
      ]);
      setLoading(false);
    };

    fetchDataOnMount();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        HomeheaderTxt={"Home"}
        
        ProfileImage={require("../../assets/images/notificationbell.png")}
        onPress={() => navigation.navigate("Notification")}
      />

      {loading ? (
        <View style={styles.loadersty}>
          <ActivityIndicator size="small" color={colors.skyblue} />
          <Text style={styles.loadertxtsty}>Please wait</Text>
        </View>
      ) : (
        <>
          <Post />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  containertwo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: RfW(15),
    paddingVertical: RfH(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY,
  },
  loadertxtsty: {
    fontSize: 14,
    top: RfH(7),
    color: colors.skyblue,
    fontFamily: "Poppins-Medium",
  },
  title: {
    fontSize: 20,
    top: RfH(3),
    fontWeight: "500",
    color: colors.black,
    fontFamily: "Poppins-Medium",
    left: RfW(4),
  },
  loadersty: {
    flex: 1,
    justifyContent: "center",
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
});

export default React.memo(Home);
