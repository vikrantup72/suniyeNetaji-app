import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../utils";

const GroupHeader = ({ groupName, participants, groupAvatar }) => {
	const navigation = useNavigation();

	return (
		<View style={styles.headerContainer}>
			{/* Back button */}
			<TouchableOpacity
				onPress={() => navigation.goBack()}
				style={styles.backButton}
			>
				<Ionicons name="arrow-back" size={28} color="#fff" />
			</TouchableOpacity>

			{/* Group avatar */}
			<Image source={{ uri: groupAvatar }} style={styles.avatar} />

			{/* Group info (name + participants) */}
			<View style={styles.groupInfo}>
				<Text style={styles.groupName}>{groupName}</Text>
				<Text style={styles.participants}>{participants} participants</Text>
			</View>

			{/* Menu icon */}
			<TouchableOpacity style={styles.menuButton}>
				<MaterialIcons name="more-vert" size={28} color="#fff" />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.skyblue, // WhatsApp-like green color
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	backButton: {
		paddingRight: 10,
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 10,
	},
	groupInfo: {
		flex: 1,
		justifyContent: "center",
	},
	groupName: {
		fontSize: 18,
		color: "#fff",
		fontWeight: "bold",
	},
	participants: {
		fontSize: 14,
		color: "#D3D3D3",
	},
	menuButton: {
		paddingLeft: 10,
	},
});

export default GroupHeader;
