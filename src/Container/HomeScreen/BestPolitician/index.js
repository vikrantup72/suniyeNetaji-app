import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../../utils";
import { RfW } from "../../../utils/helper";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { fetchnearbyData } from "../../../redux/SocialReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Skeleton } from "../../../Component/Skeleton";
import { setFollowedUserId } from "../../../redux/DataSource";
import { useNavigation } from "@react-navigation/native";

const getKey = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error("Failed to fetch the input key", e);
  }
};

const BestPolitician = () => {
  const dispatch = useDispatch();
  const { nearbyData, loading: socialLoading } = useSelector(
    (state) => state.social
  );
  const { isFollowedUserId } = useSelector((state) => state.dataSource);

  const navigation = useNavigation();
  const [loadingButtons, setLoadingButtons] = useState({}); // Local state to track button loading

  const toggleFollow = async (id) => {
    if (loadingButtons[id]) return; // Prevent multiple clicks

    setLoadingButtons((prevState) => ({
      ...prevState,
      [id]: true,
    }));

    try {
      const token = await getKey("AuthKey");
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("type", "follow");

      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/account/follow-unfollow/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.status === 200) {
        const postItem = [
          {
            id: id,
            isPending: true,
          },
        ];
        dispatch(setFollowedUserId(postItem));
        ToastAndroid.show(result?.Message, ToastAndroid.BOTTOM);
      } else {
        throw new Error(`Failed to toggle follow status: ${result}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingButtons((prevState) => ({
        ...prevState,
        [id]: false,
      }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {nearbyData?.length > 0 && (
          <Text style={styles.headersty}>Best Creators to Follow</Text>
        )}
      </View>
      {socialLoading ? (
        <FlatList
          data={[1, 2, 3]}
          horizontal
          renderItem={({ item }) => {
            return (
              <Skeleton
                width={RfW(100)}
                height={100}
                style={[
                  styles.contantcontainer,
                  { backgroundColor: colors.skyblue },
                ]}
              />
            );
          }}
        />
      ) : (
        <FlatList
          data={nearbyData}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("UserProfile", { item })}
              activeOpacity={0.8}
              style={styles.contantcontainer}
            >
              {!item?.picture ? (
                <Image
                  source={require("../../../assets/images/dummyplaceholder.png")}
                  style={styles.imgsty}
                />
              ) : (
                <Image
                  source={{
                    uri: `https://stage.suniyenetajee.com${item?.picture}`,
                  }}
                  style={styles.imgsty}
                />
              )}
              <View>
                <Text style={styles.txtsty}>
                  {item.full_name.length > 13
                    ? item.full_name.slice(0, 13) + ".."
                    : item.full_name}
                </Text>
                <Text
                  style={{
                    color: colors.skyblue,
                    fontSize: 10,
                    alignSelf: "center",
                  }}
                >
                  {item?.total_following > 0
                    ? `${
                        item?.total_following > 1
                          ? `${item?.total_following} Followers`
                          : `${item?.total_following} Follower`
                      }`
                    : " "}{" "}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleFollow(item?.id)}
                disabled={isFollowedUserId[item?.id]?.isPending || loadingButtons[item?.id]} // Disable button if follow is pending or button is loading
              >
                <View
                  style={[
                    styles.followBtn,
                    {
                      left: RfW(12),
                      backgroundColor: isFollowedUserId[item?.id]?.isPending
                        ? colors.skyblue
                        : "transparent",
                    },
                  ]}
                >
                  {loadingButtons[item?.id] ? (
                    <ActivityIndicator size="small" color={colors.skyblue} />
                  ) : (
                    <Text
                      style={[
                        styles.followtxt,
                        {
                          color: isFollowedUserId[item?.id]?.isPending
                            ? colors.WHITE
                            : colors.black,
                        },
                      ]}
                    >
                      {isFollowedUserId[item?.id]?.isPending
                        ? "Pending"
                        : "Follow"}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </SafeAreaView>
  );
};

export default React.memo(BestPolitician);
