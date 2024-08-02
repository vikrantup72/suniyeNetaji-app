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
import BestPolitician from "./BestPolitician";
import Post from "./Post";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchData } from "../../redux/PostReducer";
import { RequestCount, fetchnearbyData } from "../../redux/SocialReducer";
import { RfH, RfW } from "../../utils/helper";
import mobileAds from "react-native-google-mobile-ads";

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
	const renderItem = useCallback(
		({ item }) => <View style={styles.item}>{item.component}</View>,
		[]
	);

	const keyExtractor = useCallback((item) => item.key, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		Promise.all([
			dispatch(fetchData()),
			dispatch(fetchnearbyData()),
			dispatch(RequestCount()),
		]).finally(() => setRefreshing(false));
	}, []);

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

	const { requestcountData } = useSelector(
		(state) => state.social,
		shallowEqual
	);

	// console.log(requestcountData, 'requestcountData Home..');

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.containertwo}>
				<View>
					<Text style={styles.title}>Home</Text>
				</View>
				<View>
					<TouchableOpacity onPress={() => navigation.navigate("Notification")}>
						<Image
							source={require("../../assets/images/notificationbell.png")}
							style={{
								height: RfH(20),
								width: RfW(20),
								alignSelf: "center",
							}}
						/>
					</TouchableOpacity>
					{requestcountData?.total_pending_request > 0 && (
						<View style={styles.counterContainer}>
							<Text style={styles.counterText}>
								{requestcountData?.total_pending_request}
							</Text>
						</View>
					)}
				</View>
			</View>

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
