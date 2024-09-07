import React, { useEffect, useState, useCallback, useRef } from "react";
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
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../utils";
import { RfH, RfW, getKey, hp } from "../../utils/helper";
import { useNavigation } from "@react-navigation/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import styles from "./styles";
import Header from "../../utils/Header";
import { useDispatch, useSelector } from "react-redux";
import { GetProfile } from "../../redux/ProfileSlice";
import CustomImage from "../../Component/CustomImage";
import SocialActivityes from "../../Component/socialactivityes/SocialActivityes";
import Video from "react-native-video";
import { BottomSheet } from "react-native-btr";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { deletePost } from "../../redux/PostReducer";
import { addProfileData, addToDataSource } from "../../redux/DataSource";
import ImageViewing from "react-native-image-viewing";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import RNFetchBlob from "rn-fetch-blob";
import { useAndroidBackHandler } from "react-navigation-backhandler";

const Profile = ({ route }) => {
  const item = route.params || {};
  const userid = item?.id?.created_by?.user_id || item?.item?.userid;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    datas,
    loading: profileLoading,
    error,
  } = useSelector((state) => state.profile);
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [imageSizes, setImageSizes] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const swiperFlatListRef = useRef(null);

  const downloadFile = async (url, fileName) => {
    const { config, fs } = RNFetchBlob;
    const downloadDest = `${fs.dirs.DownloadDir}/${fileName}`;

    config({
      fileCache: true,
      path: downloadDest,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: downloadDest,
        description: "Downloading file.",
      },
    })
      .fetch("GET", url)
      .then((res) => {
        console.log("File downloaded successfully:", res.path());
        Alert.alert("Download Success", "File downloaded successfully");
      })
      .catch((err) => {
        console.error("Download error:", err);
        Alert.alert(
          "Download Error",
          "An error occurred while downloading the file"
        );
      });
  };

  const handleSave = async (mediaItem) => {
    if (!mediaItem) {
      console.error("No mediaItem provided");
      return;
    }

    const { media, video } = mediaItem;

    const downloadMedia = async (url) => {
      const fileName = url.split("/").pop();
      console.log("Downloading:", fileName);
      await downloadFile(url, fileName);
    };

    if (media) {
      await downloadMedia(media);
    }
    if (video) {
      await downloadMedia(video);
    }
    setBottomSheetVisible(false);
  };

  const requestDownloadPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message:
              "This app needs access to your storage to download Photos and Videos",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Storage permission granted");
          return true;
        } else {
          console.log("Storage permission denied");
          Alert.alert(
            "Permission Denied",
            "Storage permission is required to download files. Please grant the permission in the app settings.",
            [
              {
                text: "OK",
                onPress: () => console.log("OK Pressed"),
              },
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          return false;
        }
      } catch (err) {
        console.error("Error requesting storage permission:", err);
        return false;
      }
    } else {
      return true;
    }
  };

  const handleDeletePost = (id) => {
    setSelectedPostId(id);
    setBottomSheetVisible(true);
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

  const openImageViewer = (imageUri) => {
    setSelectedImage([{ uri: imageUri }]);
    setImageViewerVisible(true);
  };

  const getAllPost = async (newOffset) => {
    try {
      setLoadingMore(true);

      const token = await getKey("AuthKey");
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/post/user-wise/?limit=10&offset=${newOffset}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      const res = await response.json();
      if (res.results.length === 0) {
        setHasMore(false);
      } else {
        const newIds = res.results.map((post) => post.id);
        dispatch(addToDataSource(res.results));
        dispatch(addProfileData(newIds));
        setData((prevData) => [...prevData, ...res.results]);
        setOffset(newOffset);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      console.log(userid, "userid");
      dispatch(GetProfile(userid));
      await getAllPost(0);
      setInitialLoading(false);
    };

    const unsubscribe = navigation.addListener("focus", fetchData);

    return () => {
      unsubscribe();
    };
  }, [navigation, dispatch, userid]);

  useEffect(() => {
    if (datas?.id === item?.id?.created_by?.user_id) {
      getAllPost(0);
    }
  }, [datas, item]);

  const playVideo = (index) => {
    setCurrentVideoIndex(index);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleEditPost = (editItem) => {
    console.log("Editing Post:", editItem);
    setEditItem(editItem);
    setBottomSheetVisible(true);
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
                  onMomentumScrollEnd={(e) => {
                    if (e && e.nativeEvent && e.nativeEvent.contentOffset) {
                      const contentOffsetX = e.nativeEvent.contentOffset.x;
                      const newIndex = Math.round(
                        contentOffsetX / (screenWidth - RfH(62))
                      );

                      if (newIndex !== currentIndex) {
                        setCurrentIndex(newIndex);
                      }
                    }
                  }}
                />

                {data.media.length > 1 && (
                  <View style={styles.imageindexsty}>
                    <Text style={styles.indextxtsty}>
                      {currentIndex + 1}/{data.media.length}
                    </Text>
                  </View>
                )}
              </>
            )}

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
                  repeat={true}
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

  const keyExtractor = (item, index) => `${item.id}-${index}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <StatusBar backgroundColor={colors.GRAY} />
      <Header HeaderTxt={"Profile"} />
      <View style={{ flex: 1, paddingBottom: RfH(20) }}>
        <FlatList
          data={profileData}
          renderItem={renderListItem}
          keyExtractor={keyExtractor}
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
          ListEmptyComponent={
            !initialLoading && data?.length === 0 ? (
              <View style={{ marginTop: 20, alignItems: "center" }}>
                <Text>No posts found</Text>
              </View>
            ) : null
          }
        />
        {/* )} */}
      </View>

      <>
        <BottomSheet
          visible={bottomSheetVisible}
          editItem={editItem}
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
                <TouchableOpacity
                  style={styles.bottombtncon}
                  onPress={confirmDeletePost}
                >
                  <View>
                    <AntDesign
                      name={"delete"}
                      size={20}
                      color={colors.black}
                      style={{ top: RfH(8) }}
                    />
                  </View>
                  <View style={{ left: RfW(12) }}>
                    <Text style={styles.btntxt}>Delete</Text>
                    <Text style={styles.disbtntxt}>
                      This Post will be deleted permanently
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleEditPost(editItem)}
                  style={[styles.bottombtncon, { marginVertical: RfH(10) }]}
                >
                  <View>
                    <Feather
                      name={"edit"}
                      size={22}
                      color={colors.black}
                      style={{ top: RfH(6) }}
                    />
                  </View>
                  <View style={{ left: RfW(12) }}>
                    <Text style={styles.btntxt}>Edit</Text>
                    <Text style={styles.disbtntxt}>
                      Click for caption or image
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    requestDownloadPermission().then((granted) => {
                      if (granted) handleSave(mainDataSource[selectedPostId]);
                    })
                  }
                  style={styles.bottombtncon}
                >
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
      </>
      <ImageViewing
        images={selectedImage}
        imageIndex={0}
        visible={isImageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Profile;
