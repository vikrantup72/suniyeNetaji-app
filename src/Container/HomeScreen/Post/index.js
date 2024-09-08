import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	View,
	FlatList,
	Image,
	Text,
	TouchableOpacity,
	Dimensions,
	SafeAreaView,
	RefreshControl,
	Platform,
	PermissionsAndroid,
	Linking,
	Alert,
} from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { RfH, RfW, getUserId, hp } from "../../../utils/helper";
import SocialActivityes from "../../../Component/socialactivityes/SocialActivityes";
import styles from "./styles";
import { colors } from "../../../utils";
import PostActivities from "./postactivities";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, deletePost } from "../../../redux/PostReducer";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import ImageViewing from "react-native-image-viewing";
import { BottomSheet } from "react-native-btr";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFetchBlob from "rn-fetch-blob";
import BestPolitician from "../BestPolitician";
import BannerScreen from "../Banner";
import SwiperFlatList from "react-native-swiper-flatlist";
import { fetchAdvertisementdata } from "../../../redux/SocialReducer";

const Post = () => {
	const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
	const [isPaused, setIsPaused] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);
	const [editItem, setEditItem] = useState(null);
	const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
	const [imageSizes, setImageSizes] = useState({});
	const [localPosts, setLocalPosts] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [isImageViewerVisible2, setImageViewerVisible2] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);

	const swiperFlatListRef = useRef(null);

	const { HomeDashboardData, mainDataSource } = useSelector(
		(state) => state.dataSource
	);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		dispatch(fetchData()).finally(() => setRefreshing(false));
	}, []);

	const [userId, setUserId] = useState(null);
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const { data, loading } = useSelector((state) => state.post);
	const focused = useIsFocused();
	useEffect(() => {
		dispatch(fetchData());
	}, [focused]);

	useEffect(() => {
		setLocalPosts(data);
	}, [data]);

	useEffect(() => {
		dispatch(fetchData(dispatch));
		getUserId("Home")
			.then((userId) => {
				setUserId(userId);
			})
			.catch((error) => {
				console.error("Error getting user ID:", error);
			});
	}, []);

	const handleComment = (item) => {
		const updatedPosts = localPosts.map((post) => {
			if (post.id === item.id) {
				return { ...post, total_comments: post.total_comments + 1 };
			}
			return post;
		});
		setLocalPosts(updatedPosts);
		setSelectedPost(item.id);
		setEditItem(item);
		setBottomSheetVisible(true);
	};

	const confirmDeletePost = () => {
		dispatch(deletePost(selectedPost));
		setLocalPosts((prevPosts) =>
			prevPosts.filter((post) => post.id !== selectedPost)
		);
		setBottomSheetVisible(false);
	};

	const onViewableItemsChanged = useRef(({ viewableItems }) => {
		const visibleVideo = viewableItems.find((item) => item.item.video);
		if (visibleVideo) {
			setCurrentVideoIndex(visibleVideo.index);
			setIsPaused(false);
		} else {
			setIsPaused(true);
		}
	}).current;

	const playVideo = (index) => {
		setCurrentVideoIndex(index);
		setIsPaused(false);
	};

	const handlePause = () => {
		setIsPaused(!isPaused);
	};

	const screenHeight = Dimensions.get("window").height;
	const screenWidth = Dimensions.get("window").width;

	const onLayout = (id) => (e) => {
		const containerWidth = e.nativeEvent?.layout?.width;
		if (containerWidth && data && data.length > 0) {
			const item = data.find((result) => result.id === id);
			Image.getSize(
				item.banner_image,
				(width, height) => {
					const imageAspectRatio = width / height;
					const imageWidth = containerWidth;
					const imageHeight = containerWidth / imageAspectRatio;
					setImageSizes((prevState) => ({
						...prevState,
						[id]: { width: imageWidth, height: imageHeight },
					}));
				},
				() => {},
				{ cache: "force-cache" }
			);
		}
	};

	const handleNavigation = async (editItem) => {
		await AsyncStorage.setItem("isEdit", "true");

		navigation.navigate("PostScreen", {
			flag: "isEdit",
			item: editItem,
		});
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
					// Inform the user about the need for storage permission
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
			// For platforms other than Android, assume permission is granted
			return true;
		}
	};

	const openImageViewer = (imageUri) => {
		setSelectedImage([{ uri: imageUri }]);
		setImageViewerVisible2(true);
	};

	const downloadFile = async (url, fileName) => {
		if (!Platform.Version > 30) {
			const hasPermission = await requestDownloadPermission();
			if (!hasPermission) {
				Alert.alert("Permission Denied", "No storage permission granted");
				console.error("No storage permission granted");
				return;
			}
		}

		const { config, fs } = RNFetchBlob;
		const downloadDest = `${fs.dirs.DownloadDir}/${fileName}`;

		config({
			fileCache: true,
			path: downloadDest,
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
	// console.log("postScrren");
	const handleSave = async (editItem) => {
		console.log("editItem:", editItem);

		if (!editItem) {
			console.error("No editItem provided");
			return;
		}

		const { banner_image, video } = editItem;

		if (!banner_image && !video) {
			console.error("No banner_image or video to download");
			return;
		}

		const downloadMedia = async (url) => {
			const fileName = url.split("/").pop();
			console.log("Downloading:", fileName);
			await downloadFile(url, fileName);
		};

		if (banner_image) {
			await downloadMedia(banner_image);
		}
		if (video) {
			await downloadMedia(video);
		}
		setBottomSheetVisible(false);
	};

	const { advertisementData } = useSelector((state) => state.social);
	useEffect(() => {
		dispatch(fetchAdvertisementdata());
	}, [dispatch]);

	const renderHeaderComponent = useCallback(() => {
		return (
			<>
				{advertisementData?.length === 0 ? null : <BannerScreen />}
				<BestPolitician />
			</>
		);
	}, [HomeDashboardData]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<FlatList
				viewabilityConfig={{
					waitForInteraction: true,
					itemVisiblePercentThreshold: 50,
					minimumViewTime: 1000,
				}}
				removeClippedSubviews={true}
				ListHeaderComponent={renderHeaderComponent}
				legacyImplementation={true}
				data={HomeDashboardData}
				keyExtractor={(item) => item.toString()}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={[colors.skyblue]}
					/>
				}
				renderItem={({ item, index }) => {
					const data = mainDataSource[item];
					return (
						<View>
							<View style={styles.massagepostcontainer}>
								<TouchableOpacity
									onPress={() =>
										navigation.navigate("UserProfile", { id: data })
									}
									activeOpacity={0.8}
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
									}}
								>
									<View style={styles.postcontainer}>
										<View style={styles.imgcontainer}>
											{data?.created_by?.picture ? (
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
											) : (
												<Image
													source={require("../../../assets/images/dummyplaceholder.png")}
													style={{
														height: RfH(30),
														width: RfW(30),
														borderRadius: RfH(16),
														alignSelf: "center",
														resizeMode: "cover",
													}}
												/>
											)}
										</View>
										<View>
											<Text style={styles.namesty}>
												{data?.created_by?.full_name?.length > 15
													? `${data.created_by.full_name.slice(0, 15)}...`
													: data.created_by.full_name}
											</Text>
											<Text style={styles.timesty}>{data?.date_created}</Text>
										</View>
									</View>
									<View style={styles.followcontainer}>
										<View style={styles.followcontainer}>
											{userId != data?.created_by?.user_id ? (
												<PostActivities item={data} />
											) : null}

											<TouchableOpacity
												style={{
													height: RfH(25),
													width: RfW(20),
													left: RfW(0),
												}}
												onPress={() => handleComment(data)}
											>
												<Image
													source={require("../../../assets/images/dots.png")}
													style={{
														height: RfH(12.54),
														width: RfW(3),
														top: RfH(5),
														resizeMode: "contain",
														alignSelf: "center",
													}}
												/>
											</TouchableOpacity>
										</View>
									</View>
								</TouchableOpacity>
								<View>
									<Text style={styles.msgtextsty}>{data?.description}</Text>
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
											onScroll={(e) => {
												const contentOffsetX = e?.nativeEvent?.contentOffset?.x;
												if (contentOffsetX !== undefined) {
													const newIndex = Math.round(
														contentOffsetX / screenWidth
													);
													setCurrentIndex(newIndex);
												}
											}}
										/>
										<View style={styles.imageindexsty}>
											<Text style={styles.indextxtsty}>
												{currentIndex + 1}/{data.media.length}
											</Text>
										</View>
									</>
								)}

								{data?.video && (
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
											paused={currentVideoIndex !== data.id || isPaused}
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
												if (currentVideoIndex === data.id) {
													handlePause();
												} else {
													playVideo(data.id);
												}
											}}
										>
											{currentVideoIndex === data.id && !isPaused ? (
												<Icon name={"pause"} size={32} color="#128C78" />
											) : (
												<Icon name={"play-arrow"} size={32} color="#128C78" />
											)}
										</TouchableOpacity>
									</View>
								)}
								<View style={styles.othercontainer}>
									<SocialActivityes
										Commentimg={require("../../../assets/images/comment.png")}
										numofcomment={data?.total_comments}
										CommentAction={() => handleComment(data)}
										item={data}
									/>
								</View>
							</View>
						</View>
					);
				}}
				onViewableItemsChanged={onViewableItemsChanged}
				viewabilityConfig={{
					itemVisiblePercentThreshold: 50,
				}}
			/>
			{/* )} */}

			<BottomSheet
				visible={bottomSheetVisible}
				onBackButtonPress={() => setBottomSheetVisible(false)}
				editItem={editItem}
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
						{userId == editItem?.created_by?.user_id ? (
							<>
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
									onPress={() => handleNavigation(editItem)}
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
											Click to edit caption or image
										</Text>
									</View>
								</TouchableOpacity>
							</>
						) : null}
						<TouchableOpacity
							style={styles.bottombtncon}
							onPress={() => handleSave(editItem)}
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
			</BottomSheet>
			<ImageViewing
				images={[
					{
						uri: `https://stage.suniyenetajee.com${data?.picture}`,
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
		</SafeAreaView>
	);
};

export default Post;
