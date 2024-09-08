import React, { useState, useEffect } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { colors } from "../../utils";
import { RfH, RfW } from "../../utils/helper";
import SearchInput from "../../Component/commoninputs/SearchInput";
import Header from "../../utils/Header";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchchatgrouplist,
	fetchchatlist,
} from "../../redux/ChatReducerSlice";
import { fetchProfileData } from "../../redux/ProfileSlice";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import { useNavigation } from "@react-navigation/native";

const MassageScreen = () => {
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const chatData = useSelector((state) => state.chat.datas);
	const groupchatData = useSelector((state) => state.chat.groupdata);

	const [selectedTab, setSelectedTab] = useState("All");
	const [loading, setLoading] = useState(true);
	useAndroidBackHandler(() => {
		if (navigation.canGoBack()) {
			navigation.goBack();
			return true;
		}
		return false;
	});

	useEffect(() => {
		const fetchData = async () => {
			await dispatch(fetchchatlist());
			await dispatch(fetchchatgrouplist());
			setLoading(false);
		};

		if (loading) {
			fetchData();
		}
	}, [dispatch, loading]);

	const { datas } = useSelector((state) => state.profile);

	useEffect(() => {
		dispatch(fetchProfileData());
	}, [dispatch]);

	const renderItem = ({ item }) => (
		<View style={styles.item}>
			<TouchableOpacity
				onPress={() => navigation.navigate("ChatScreen", { item })}
				activeOpacity={0.8}
				style={{ flexDirection: "row", justifyContent: "space-between" }}
			>
				<View style={{ flexDirection: "row" }}>
					<View style={styles.profileimagecon}>
						{item?.image ? (
							<Image
								source={{
									uri: `https://stage.suniyenetajee.com${item?.image}`,
								}}
								style={styles.imgsty}
							/>
						) : (
							<Image
								source={require("../../assets/images/dummyplaceholder.png")}
								style={styles.imgsty}
							/>
						)}
					</View>
					<View
						style={{ paddingHorizontal: RfW(8), width: "79%", bottom: RfH(4) }}
					>
						<Text style={styles.namesty}>{item?.display_name}</Text>
						{item?.last_message ? (
							<Text style={styles.msgsty}>
								{item?.last_message.content || "Attached File 🗂️"}
							</Text>
						) : (
							<Text style={styles.msgsty}>There is no message about this</Text>
						)}
					</View>
				</View>
				{item.unread_count > 0 && (
					<View>
						<Text
							style={
								([styles.msgsty],
								{ top: RfH(2), color: colors.skyblue, right: RfW(20) })
							}
						>
							{item.unread_count} msg
						</Text>
					</View>
				)}
			</TouchableOpacity>
		</View>
	);

	const handleTabPress = (tab) => {
		setSelectedTab(tab);
		if (tab === "Group") {
			navigation.navigate("GroupScreen");
		}
	};

	if (loading) {
		// Show loader while loading
		return (
			<View style={styles.loaderContainer}>
				<ActivityIndicator size="small" color={colors.skyblue} />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.headingcontainer}>
				<Text style={styles.heading}>Messages</Text>
			</View>

			<View style={styles.homecontainer}>
				<View style={{ flexDirection: "row" }}>
					<View>
						<View>
							{datas?.picture ? (
								<Image
									source={{
										uri: `https://stage.suniyenetajee.com${datas?.picture}`,
									}}
									style={styles.userpicsty}
								/>
							) : (
								<Image
									source={require("../../assets/images/dummyplaceholder.png")}
									style={styles.userpicsty}
								/>
							)}
						</View>
					</View>
					<View>
						<SearchInput placeholder={"Search group/chat"} />
					</View>
				</View>

				<View
					style={[
						selectedTab === "All" && "Group"
							? styles.tabContainer
							: styles.tabContainer2,
					]}
				>
					<TouchableOpacity
						style={[
							styles.tabButton,
							selectedTab === "All"
								? styles.activeTabButton
								: styles.deactiveTabButton,
						]}
						onPress={() => handleTabPress("All")}
					>
						<Text
							style={[
								styles.tabText,
								selectedTab === "All" && styles.activeTabText,
							]}
						>
							All
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.tabButton,
							selectedTab === "Group"
								? styles.activeTabButton
								: styles.deactiveTabButton,
							,
						]}
						onPress={() => handleTabPress("Group")}
					>
						<Text
							style={[
								styles.tabText,
								selectedTab === "Group" && styles.activeTabText,
							]}
						>
							Group
						</Text>
					</TouchableOpacity>
				</View>

				{selectedTab === "All" && (
					<FlatList
						data={chatData?.results}
						renderItem={renderItem}
						keyExtractor={(item) => item.id.toString()}
						ItemSeparatorComponent={() => <View style={styles.separator} />}
					/>
				)}
				{selectedTab === "Group" && (
					<FlatList
						data={groupchatData?.results}
						renderItem={renderItem}
						keyExtractor={(item) => item.id.toString()}
						ItemSeparatorComponent={() => <View style={styles.separator} />}
					/>
				)}
			</View>
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() => navigation.navigate("CreateGroup")}
				style={styles.flotbtncon}
			>
				<View style={styles.flotbtnsty}>
					<Image
						source={require("../../assets/images/groupimg.png")}
						style={{ height: 60, width: 60 }}
					/>
				</View>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default MassageScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.WHITE,
	},
	loaderContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.WHITE,
	},
	tabContainer: {
		flexDirection: "row",
		marginVertical: 10,
	},
	tabContainer2: {
		flexDirection: "row",
		marginVertical: 10,
		right: 10,
	},
	heading: {
		fontSize: 20,
		color: colors.skyblue,
		fontWeight: "500",
	},
	headingcontainer: {
		paddingHorizontal: 20,
		marginTop: RfH(20),
	},
	tabButton: {
		height: 36,
		paddingHorizontal: RfW(30),
		borderRadius: RfH(18),
		minWidth: RfW(90),
		justifyContent: "center",
	},
	activeTabButton: {
		backgroundColor: colors.skyblue,
	},
	deactiveTabButton: {
		borderWidth: 1,
		marginHorizontal: RfW(10),
		borderColor: colors.GRAY,
		height: 36,
		borderRadius: RfH(18),
	},
	tabText: {
		fontSize: 16,
		fontWeight: "400",
		color: colors.DARK_GRAY,
		alignSelf: "center",
	},
	activeTabText: {
		color: colors.WHITE,
	},
	homecontainer: {
		paddingHorizontal: RfW(20),
	},
	item: {
		paddingVertical: RfH(10),
		borderBottomWidth: 1,
		borderBottomColor: colors.LIGHT_GRAY,
	},
	imgsty: {
		height: RfH(50),
		width: RfW(50),
		borderRadius: RfH(25),
	},
	profileimagecon: {
		height: RfH(50),
		width: RfW(50),
		borderWidth: 1,
		borderRadius: RfH(35),
		borderColor: colors.GRAY,
	},
	namesty: {
		fontSize: 14,
		fontWeight: "400",
		fontFamily: "Poppins-Medium",
		color: colors.black,
		marginTop: RfH(3),
		top: RfH(2),
	},
	msgsty: {
		fontSize: 12,
		fontWeight: "400",
		fontFamily: "Poppins-Regular",
		color: colors.DARK_GRAY,
		top: RfH(3),
		left: 1,
	},
	separator: {
		height: 1,
		backgroundColor: colors.LIGHT_GRAY,
	},
	flotbtncon: {
		position: "absolute",
		bottom: 0,
		alignSelf: "flex-end",
		bottom: RfH(70),
		right: RfW(30),
	},
	flotbtnsty: {
		justifyContent: "center",
	},
	flotbtntxt: { fontSize: 30, alignSelf: "center", color: colors.WHITE },
	headersty: {
		fontSize: 18,
		fontWeight: "500",
		color: colors.black,
		lineHeight: 30,
	},
	userpicsty: {
		height: RfH(40),
		width: RfW(40),
		borderRadius: RfH(22),
		resizeMode: "cover",
		top: RfH(17),
	},
});
