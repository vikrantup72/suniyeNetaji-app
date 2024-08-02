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
import React, { useEffect } from "react";
import { colors } from "../../../utils";
import { RfW } from "../../../utils/helper";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { fetchnearbyData } from "../../../redux/SocialReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Skeleton } from "../../../Component/Skeleton";
import { setFollowedUserId } from "../../../redux/DataSource";

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

	// useEffect(() => {
	// 	dispatch(fetchnearbyData());
	// }, [dispatch]);

	const toggleFollow = async (id) => {
		try {
			const token = await getKey("AuthKey");
			const formData = new FormData();
			formData.append("id", id.toString());
			formData.append("type", "follow");

			const response = await fetch(
				"https://apis.suniyenetajee.com/api/v1/account/follow-unfollow/",
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
						<View style={styles.contantcontainer}>
							{!item?.picture ? (
								<Image
									source={require("../../../assets/images/dummyplaceholder.png")}
									style={styles.imgsty}
								/>
							) : (
								<Image
									source={{
										uri: `https://apis.suniyenetajee.com${item?.picture}`,
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
							<TouchableOpacity onPress={() => toggleFollow(item?.id)}>
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
											? "pending"
											: "follow"}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					)}
					keyExtractor={(item) => item.id.toString()}
				/>
			)}
		</SafeAreaView>
	);
};

export default React.memo(BestPolitician);
