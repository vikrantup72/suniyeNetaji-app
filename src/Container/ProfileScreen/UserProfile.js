import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../utils";
import { RfH, RfW, getKey, getUserId, hp } from "../../utils/helper";
import { useNavigation } from "@react-navigation/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import styles from "./styles";
import Header from "../../utils/Header";
import { useDispatch, useSelector } from "react-redux";
import { GetProfile } from "../../redux/ProfileSlice";
import CustomImage from "../../Component/CustomImage";
import SocialActivityes from "../../Component/socialactivityes/SocialActivityes";
import Video from "react-native-video";
import { BottomSheet } from "react-native-btr";
import AntDesign from "react-native-vector-icons/AntDesign";
import { deletePost } from "../../redux/PostReducer";
import { addProfileData, addToDataSource } from "../../redux/DataSource";
import ImageViewing from "react-native-image-viewing";
import { personalmsg } from "../../redux/ChatReducerSlice";
import SwiperFlatList from "react-native-swiper-flatlist";
import { useAndroidBackHandler } from "react-navigation-backhandler";

const UserProfile = ({ route }) => {
  const item = route.params || {};

  // console.log(item, "bchabvb");
  const userid =
    item?.id?.created_by?.user_id ||
    item?.item?.userid ||
    item?.item?.user_id ||
    item?.item?.id;

  console.log(userid, "jsgaksjga");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { datas, loading } = useSelector((state) => state.profile);
  const { profileData, mainDataSource } = useSelector(
    (state) => state.dataSource
  );

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  });

  const [data, setData] = useState([]);
  // console.log(data, "getuseridwisedata");
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [imageSizes, setImageSizes] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [isImageViewerVisible2, setImageViewerVisible2] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [user2, setUser2] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const swiperFlatListRef = useRef(null);

  useEffect(() => {
    getUserId()
      .then((user2) => {
        setUser2(user2);
      })
      .catch((error) => {
        console.error("Error getting user ID:", error);
      });
  });
  console.log(user2, "xcsjbcj");

  const handleDeletePost = (id) => {
    setSelectedPostId(id);
    setBottomSheetVisible(true);
  };

  const openImageViewer = (imageUri) => {
    setSelectedImage([{ uri: imageUri }]);
    setImageViewerVisible2(true);
  };

  const confirmDeletePost = () => {
    if (selectedPostId) {
      dispatch(deletePost(selectedPostId))
        .then(() => {
          setData((prevData) =>
            prevData.filter((item) => item.id !== selectedPostId)
          );
          setBottomSheetVisible(false);
          setSelectedPostId(null);
        })
        .catch((error) => {
          console.error("Error deleting post:", error);
        });
    }
  };
  const getAllPost = async () => {
    try {
      setInitialLoading(true);
      const token = await getKey("AuthKey");
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/post/id-wise/${userid}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      const res = await response.json();
      console.log(res, "hvngvgvgv");
      if (res.results.length > 0) {
        const newIds = res.results.map((post) => post.id);
        dispatch(addToDataSource(res.results));
        dispatch(addProfileData(newIds));
        setData(res.results);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log(userid, "useridbylike");
      dispatch(GetProfile(userid));
      await getAllPost();
    };

    const unsubscribe = navigation.addListener("focus", fetchData);

    return () => {
      unsubscribe();
    };
  }, [navigation, dispatch, userid]);

  useEffect(() => {
    if (datas?.id === item?.id?.created_by?.user_id) {
      getAllPost();
    }
  }, [datas, item]);

  const playVideo = (index) => {
    setCurrentVideoIndex(index);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handlewmsg = (userid, datas) => {
    dispatch(
      personalmsg({
        user1: userid,
        user2,
        navigation,
        datas,
      })
    );
  };

  const renderListItem = ({ item, index }) => {
    const data = mainDataSource[item];
    const isCurrentVideo = currentVideoIndex === index;
    const imageSize = imageSizes[data.id];
    const isPostOwner = datas?.userid === data?.created_by?.user_id;
    return (
      <View key={data.id} style={styles.homecontainer}>
        {isPostOwner && (
          <View style={styles.massagepostcontainer}>
            <View style={styles.postcontainer}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.imgcontainer}>
                  <Image
                    source={{
                      uri: `https://stage.suniyenetajee.com${data?.created_by?.picture}`,
                    }}
                    style={{
                      height: RfH(34),
                      width: RfW(34),
                      borderRadius: RfH(16),
                      alignSelf: "center",
                      resizeMode: "cover",
                    }}
                  />
                </View>
                <View>
                  <Text style={styles.namesty}>
                    {data?.created_by?.full_name?.length > 15
                      ? `${data.created_by.full_name.slice(0, 15)}...`
                      : data.created_by.full_name}
                  </Text>
                  <Text style={styles.timesty}>{data?.created_date}</Text>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => handleDeletePost(data.id)}
                  style={{ width: RfW(25) }}
                >
                  <Image
                    source={require("../../assets/images/dots.png")}
                    style={{
                      height: RfH(12.54),
                      width: RfW(3),
                      top: RfH(5),
                      left: RfW(3),
                      resizeMode: "contain",
                      alignSelf: "center",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={styles.msgtextsty}>{data.description}</Text>
            </View>
            <>
              {data.media && data.media.length > 0 && (
                <>
                  <SwiperFlatList
                    ref={swiperFlatListRef}
                    data={data.media}
                    autoplay={false}
                    keyExtractor={(mediaItem) => mediaItem.id.toString()}
                    renderItem={({ item: mediaItem }) => (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => openImageViewer(mediaItem.media)}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          marginVertical: RfH(5),
                          overflow: "hidden",
                          height: RfH(300),
                          width: screenWidth - RfH(62),
                        }}
                      >
                        <Image
                          source={{
                            uri: mediaItem.media,
                            cache: "force-cache",
                          }}
                          resizeMode="contain"
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: colors.LIGHT_GRAY,
                            marginTop: hp("0.1%"),
                            borderRadius: RfH(10),
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    // contentContainerStyle={{ paddingHorizontal: 10 }}
                    onMomentumScrollEnd={(e) => {
                      const contentOffsetX = e?.nativeEvent?.contentOffset?.x;
                      if (contentOffsetX !== undefined) {
                        const newIndex = Math.round(
                          contentOffsetX / screenWidth
                        );
                        setCurrentIndex(newIndex);
                      }
                    }}
                  />
                  <View
                    style={{
                      alignItems: "center",
                      position: "absolute",
                      alignSelf: "flex-end",
                      top: RfH(55),
                      right: RfW(10),
                      marginTop: RfH(20),
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      height: RfH(25),
                      width: RfW(40),
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: colors.WHITE,
                        alignSelf: "center",
                        justifyContent: "center",
                      }}
                    >
                      {currentIndex + 1}/{data.media.length}
                    </Text>
                  </View>
                </>
              )}
            </>
            {data.video && (
              <View
                style={[
                  styles.tabVideo,
                  {
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    backgroundColor: colors.shadwo_blue,
                    borderRadius: RfH(8),
                    marginVertical: RfH(10),
                    padding: RfH(8),
                  },
                ]}
              >
                <Video
                  source={{ uri: data.video }}
                  paused={!isCurrentVideo || isPaused}
                  style={[
                    styles.video,
                    {
                      height: screenHeight * 0.5,
                      width: screenWidth * 0.8,
                      alignSelf: "center",
                      left: RfW(0),
                      borderRadius: RfH(10),
                    },
                  ]}
                  resizeMode="cover"
                  onEnd={() => {}}
                />
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.playButton}
                  onPress={() => {
                    if (isCurrentVideo) {
                      handlePause();
                    } else {
                      playVideo(index);
                    }
                  }}
                >
                  {isCurrentVideo && !isPaused ? (
                    <MaterialIcon name={"pause"} size={32} color="#128C78" />
                  ) : (
                    <MaterialIcon
                      name={"play-arrow"}
                      size={32}
                      color="#128C78"
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.othercontainer}>
              <SocialActivityes
                Commentimg={require("../../assets/images/comment.png")}
                numofcomment={data?.total_comments}
                item={data}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  const ListHeaderItem = () => {
    return (
      <View>
        <View>
          <View
            style={{
              backgroundColor: colors.shadwo_blue,
              height: RfH(120),
              width: "100%",
            }}
          ></View>
          <View style={{}}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setIsImageViewerVisible(true)}
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    height: RfH(120),
                    width: RfW(110),
                    borderWidth: 1,
                    marginTop: RfH(-70),
                    marginLeft: RfW(20),
                    borderRadius: RfH(10),
                    borderColor: colors.skyblue,
                  }}
                >
                  {datas?.picture ? (
                    <Image
                      source={{
                        uri: `https://stage.suniyenetajee.com${datas?.picture}`,
                      }}
                      resizeMode="cover"
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: RfH(10),
                        borderColor: colors.skyblue,
                      }}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/images/dummyplaceholder.png")}
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: RfH(10),
                        borderColor: colors.skyblue,
                      }}
                    />
                  )}
                </View>
                <View
                  style={
                    datas?.private_account === false
                      ? { marginTop: RfH(-50), left: RfW(10) }
                      : { marginTop: RfH(-40), left: RfW(10) }
                  }
                >
                  <View style={{ marginHorizontal: RfW(5) }}>
                    <Text
                      style={{
                        fontFamily: "Poppins-Medium",
                        color: colors.black,
                      }}
                    >
                      {datas?.full_name?.length > 15
                        ? `${datas?.full_name.slice(0, 15)}...`
                        : datas?.full_name}
                    </Text>

                    {console.log(datas, "bxcbhzbbbb")}

                    {/* {datas?.private_account == false ? (
                      <Text
                        style={{
                          color: colors.black,
                          fontFamily: "Poppins-Medium",
                        }}
                      >
                        {datas?.phone_number}
                      </Text>
                    ) : null} */}

                    {/* {datas.account_privacy !== "public" ? (
                      <Text style={styles.profilePhoneNumber}>
                        {datas.phone_number}
                      </Text>
                    ) : null} */}

                    {/* {datas.account_privacy !== "public" &&
                    datas.account_privacy !== "friends" ? null : (
                      <Text style={styles.profilePhoneNumber}>
                        {datas.phone_number}
                      </Text>
                    )} */}
                  </View>
                  <View
                    style={
                      datas?.private_account === false
                        ? {
                            flexDirection: "row",
                            paddingVertical: 8,
                            alignSelf: "flex-start",
                          }
                        : {
                            flexDirection: "row",
                            paddingVertical: 22,
                            alignSelf: "flex-start",
                          }
                    }
                  >
                    <View
                      style={{
                        alignItems: "center",
                        marginHorizontal: RfW(5),
                      }}
                    >
                      <Text
                        style={{
                          color: colors.black,
                          fontFamily: "Poppins-Medium",
                          fontSize: 12,
                        }}
                      >
                        {datas?.total_post}
                      </Text>
                      <Text
                        style={{
                          color: colors.black,
                          fontFamily: "Poppins-Medium",
                          fontSize: 12,
                        }}
                      >
                        Post
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 0.2,
                        borderColor: colors.DARK_GRAY,
                        marginHorizontal: RfW(15),
                      }}
                    ></View>
                    <Pressable style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          color: colors.black,
                          fontFamily: "Poppins-Medium",
                          fontSize: 12,
                        }}
                      >
                        {datas?.total_followers}
                      </Text>
                      <Text
                        style={{
                          color: colors.black,
                          fontFamily: "Poppins-Medium",
                          fontSize: 12,
                        }}
                      >
                        Followers
                      </Text>
                    </Pressable>
                    <View
                      style={{
                        borderWidth: 0.2,
                        borderColor: colors.DARK_GRAY,
                        marginHorizontal: RfW(15),
                      }}
                    ></View>
                    <Pressable style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          color: colors.black,
                          fontFamily: "Poppins-Medium",
                          fontSize: 12,
                        }}
                      >
                        {datas?.total_following}
                      </Text>
                      <Text
                        style={{
                          color: colors.black,
                          fontFamily: "Poppins-Medium",
                          fontSize: 12,
                        }}
                      >
                        Followings
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {user2 != datas?.userid ? (
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  left: RfW(77),
                }}
              >
                {datas?.is_following == true && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.followbtn}
                  >
                    <Text
                      style={{ color: colors.skyblue, alignSelf: "center" }}
                    >
                      followi..
                    </Text>
                  </TouchableOpacity>
                )}
                {datas?.is_following == true && (
                  <TouchableOpacity
                    style={styles.msgbtn}
                    onPress={() => handlewmsg(datas?.userid, datas)}
                  >
                    <Text
                      style={{ color: colors.skyblue, alignSelf: "center" }}
                    >
                      message
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}

            <View
              style={{
                borderBottomWidth: 1,
                borderColor: colors.GRAY,
                marginTop: RfH(15),
              }}
            ></View>
          </View>
        </View>
      </View>
    );
  };

  const keyExtractor = (item, index) => `${item.id}-${index}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <StatusBar backgroundColor={colors.GRAY} />
      <Header HeaderTxt={"Profile"} />
      <View style={{ flex: 1, paddingBottom: RfH(20) }}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.WHITE}
            style={{
              flex: 1,
              justifyContent: "center",
              alignSelf: "center",
            }}
          />
        ) : (
          <FlatList
            data={profileData}
            renderItem={renderListItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={ListHeaderItem}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore && (
                <ActivityIndicator
                  size="small"
                  color={colors.skyblue}
                  style={{ marginTop: RfH(70) }}
                />
              )
            }
            contentContainerStyle={{ paddingBottom: RfH(10) }}
          />
        )}
      </View>

      {!initialLoading && data.length == 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignSelf: "center",
            bottom: RfH(150),
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: "#000",
              height: RfH(100),
              width: RfW(100),
              borderRadius: RfH(50),
              alignSelf: "center",
              marginBottom: RfH(10),
              justifyContent: "center",
            }}
          >
            <EvilIcons
              name={"camera"}
              size={100}
              color="#000"
              style={{ alignSelf: "center" }}
            />
          </View>
          <Text style={{ color: colors.black }}>
            These user is not following you.
          </Text>
        </View>
      )}

      {initialLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignSelf: "center",
            bottom: RfH(190),
          }}
        >
          <ActivityIndicator size="small" color={colors.skyblue} style={{}} />
        </View>
      )}

      <>
        <BottomSheet
          visible={bottomSheetVisible}
          onBackButtonPress={() => setBottomSheetVisible(false)}
          onBackdropPress={() => setBottomSheetVisible(false)}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderTopRightRadius: RfH(20),
              borderTopLeftRadius: RfH(25),
              paddingVertical: RfH(20),
            }}
          >
            <View>
              <View>
                <TouchableOpacity style={styles.bottombtncon}>
                  <View>
                    <AntDesign
                      name={"download"}
                      size={22}
                      color={colors.black}
                      style={{ top: RfH(6) }}
                    />
                  </View>
                  <View style={{ left: RfW(12) }}>
                    <Text style={styles.btntxt}>Save</Text>
                    <Text style={styles.disbtntxt}>
                      This image/video saved to the Gallery
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BottomSheet>
        <ImageViewing
          images={[
            {
              uri: `https://stage.suniyenetajee.com${datas?.picture}`,
            },
          ]}
          imageIndex={0}
          visible={isImageViewerVisible}
          onRequestClose={() => setIsImageViewerVisible(false)}
        />
        <ImageViewing
          images={selectedImage}
          imageIndex={0}
          visible={isImageViewerVisible2}
          onRequestClose={() => setImageViewerVisible2(false)}
        />
      </>
    </SafeAreaView>
  );
};

export default UserProfile;
