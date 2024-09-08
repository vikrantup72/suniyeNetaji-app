import React, { useState, useCallback, useEffect, useRef } from "react";
import {
	View,
	Modal,
	TouchableOpacity,
	Image,
	Text,
	StyleSheet,
	TouchableWithoutFeedback,
	Keyboard,
	TextInput,
	SafeAreaView,
	Platform,
} from "react-native";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import GroupHeader from "./components/GroupHeader";
import { getKey, SCREEN_HEIGHT } from "../../utils/helper";
import Video from "react-native-video";
import { colors } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { GroupList, Groupmsglisting } from "../../redux/ChatReducerSlice";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAndroidBackHandler } from "react-navigation-backhandler";
const ChatScreen = ({ route }) => {
	const { item } = route?.params || [];
	const navigation = useNavigation();
	useAndroidBackHandler(() => {
		if (navigation.canGoBack()) {
			navigation.goBack();
			return true;
		}
		return false;
	});
	const room_id = item?.room_id || item?.id;

	const dispatch = useDispatch();
	const { datas } = useSelector((state) => state.profile);
	const groupmassage = useSelector((state) => state.chat.groupmsg);
	const groupData = useSelector((state) => state.chat.groupinfo);
	const resultMessage = groupmassage?.results?.messages || [];
	useFocusEffect(
		useCallback(() => {
			if (room_id && item?.room_type === "group") {
				dispatch(Groupmsglisting(room_id));
				if (room_id) {
					console.log(room_id, "room_id");
					dispatch(GroupList(room_id));
				}
			}
		}, [room_id, item?.room_type, dispatch])
	);

	const formattedMessages = resultMessage.map((result) => ({
		_id: result?.id,
		text: result?.content,
		image: result?.image || "",
		video: result?.video || "",
		createdAt: new Date(result.timestamp),
		user: {
			_id: result.sender == datas?.userid ? 1 : result.sender,
			name: result.sender_full_name,
		},
	}));
	const [messages, setMessages] = useState(formattedMessages);

	const [previewVisible, setPreviewVisible] = useState(false);
	const [isModalVisible, setModalVisible] = useState(false);
	const [selectedMedia, setSelectedMedia] = useState(null);

	const onSend = useCallback((newMessages = []) => {
		setMessages((previousMessages) =>
			GiftedChat.append(previousMessages, newMessages)
		);
	}, []);
	const togglePreview = () => setPreviewVisible(!previewVisible);
	const toggleModal = () => {
		Keyboard.dismiss();
		setTimeout(() => {
			setModalVisible(!isModalVisible);
		}, 100);
	};

	// Handle media picking
	const handleCameraLaunch = () => {
		setModalVisible(false);
		launchCamera({ mediaType: "photo" }, (response) => {
			if (!response.didCancel && !response.errorCode) {
				handleMediaUpload(response.assets[0].uri, response.assets[0]?.type);
			}
		});
	};

	const handleGalleryLaunch = () => {
		setModalVisible(false);
		launchImageLibrary({ mediaType: "photo" }, (response) => {
			if (!response.didCancel && !response.errorCode) {
				handleMediaUpload(response.assets[0].uri, response.assets[0]?.type);
			}
		});
	};

	const handleDocumentPick = async () => {
		setModalVisible(false);
		try {
			const result = await DocumentPicker.pick({
				type: [DocumentPicker.types.allFiles],
			});
			handleMediaUpload(result[0].uri, result[0]?.type);
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
				console.log("User canceled the document picker");
			} else {
				throw err;
			}
		}
	};

	// Handle media upload and add to the chat
	const handleMediaUpload = (uri, type) => {
		setSelectedMedia({ uri, type });
		toggleModal();
		togglePreview();
	};

	const uploadMediaWithText = async () => {
		try {
			const token = await getKey("AuthKey");
			const formData = new FormData();
			formData.append("file", {
				uri:
					Platform.OS === "android"
						? selectedMedia.uri
						: selectedMedia.uri.replace("file://", ""),
				name: `media_${new Date().getTime()}`,
				type: selectedMedia.type,
			});

			formData.append("file_type", "Image");
			formData.append("chat_room_id", "2");
			formData.append("content", selectedMedia?.text || "Hello");

			// Do not manually set the Content-Type for multipart/form-data
			const response = await fetch(
				"https://stage.suniyenetajee.com/api/v1/chat/upload-media/",
				{
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "multipart/form-data",
						Authorization: `Token ${token}`,
					},
					body: formData,
				}
			);
			if (!response.ok) {
				throw new Error(`Server error: ${response.statusText}`);
			}
			const result = await response.json();
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	const confirmSendMedia = () => {
		uploadMediaWithText();
		const newMessage = {
			_id: Math.random().toString(36).substr(2, 9),
			createdAt: new Date(),
			user: {
				_id: 1,
				name: "You",
			},
			text: selectedMedia?.text || "",
			image: selectedMedia?.type?.includes("image") ? selectedMedia.uri : null,
			video: selectedMedia?.type?.includes("video") ? selectedMedia.uri : null,
		};
		const data = JSON.stringify({
			action: "send_media_message",
			message_id: 19,
			file_url:
				"https://stage.suniyenetajee.com/media/chat_images/Screenshot_2024-08-31_at_9.03.50PM.png",
		});
		socketRef.current.send(data);
		setMessages((previousMessages) =>
			GiftedChat.append(previousMessages, [newMessage])
		);
		setSelectedMedia(null);
		togglePreview(); // Hide preview
	};

	const socketRef = useRef(null);
	useEffect(() => {
		socketRef.current = new WebSocket(
			"wss://stage.suniyenetajee.com/ws/chat/open"
		);

		socketRef.current.onopen = () =>
			console.log("WebSocket connection opened.");

		socketRef.current.onmessage = (event) => {
			const receivedMessage = JSON.parse(event.data);
			console.log(receivedMessage, "receivedMessage");
		};

		socketRef.current.onclose = () =>
			console.log("WebSocket connection closed.");

		socketRef.current.onerror = (error) =>
			console.error("WebSocket error:", error);

		return () => {
			if (
				socketRef.current &&
				socketRef.current.readyState === WebSocket.OPEN
			) {
				socketRef.current.close();
			}
		};
	}, [room_id]);

	const navigateToGroupDetails = () => {
		navigation.navigate("GroupInfo", room_id);
	};
	const renderBubble = (props) => {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					left: {
						backgroundColor: "#f0f0f0", // Background color for received messages
					},
					right: {
						backgroundColor: colors.skyblue, // Background color for sent messages
					},
				}}
				textStyle={{
					left: {
						color: "#000", // Text color for received messages
					},
					right: {
						color: "#fff", // Text color for sent messages
					},
				}}
			/>
		);
	};

	const renderMessageMedia = (props) => {
		const { currentMessage } = props;

		if (currentMessage.image) {
			return (
				<TouchableOpacity>
					<Image
						source={{ uri: currentMessage.image }}
						style={styles.messageImage}
					/>
				</TouchableOpacity>
			);
		} else if (currentMessage.video) {
			return (
				<TouchableOpacity>
					<Video
						source={{ uri: currentMessage.video }}
						style={styles.messageImage}
						controls={false} // Disable controls for the small preview
					/>
				</TouchableOpacity>
			);
		}

		return null;
	};

	return (
		<View style={styles.container}>
			<GroupHeader
				groupName={groupData?.name}
				participants={groupData?.total_participants}
				groupAvatar={groupData?.image}
				onPress={navigateToGroupDetails}
			/>
			<GiftedChat
				messages={messages}
				onSend={(newMessages) => onSend(newMessages)}
				user={{ _id: 1, name: "You" }}
				renderSend={(props) => (
					<Send {...props}>
						<View style={styles.sendButton}>
							<Ionicons name="send" size={24} color="white" />
						</View>
					</Send>
				)}
				renderActions={() => (
					<TouchableOpacity style={styles.uploadButton} onPress={toggleModal}>
						<Ionicons name="attach" size={24} color={colors.skyblue} />
					</TouchableOpacity>
				)}
				renderBubble={renderBubble}
				renderMessageImage={renderMessageMedia}
				renderMessageVideo={renderMessageMedia}
			/>
			<Modal
				transparent={true}
				visible={isModalVisible}
				animationType="fade"
				onRequestClose={toggleModal}
			>
				<TouchableWithoutFeedback onPress={toggleModal}>
					<View style={styles.modalOverlay}>
						<TouchableWithoutFeedback>
							<View style={styles.modalcontainers}>
								<TouchableOpacity
									style={styles.option}
									onPress={handleDocumentPick}
								>
									<View style={styles.iconcontainer}>
										<MaterialIcons
											name="insert-drive-file"
											size={24}
											color="white"
										/>
									</View>
									<Text style={styles.optionText}>Document</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.option}
									onPress={handleCameraLaunch}
								>
									<View style={styles.iconcontainer}>
										<MaterialIcons
											name="photo-camera"
											size={24}
											color="white"
										/>
									</View>
									<Text style={styles.optionText}>Camera</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.option}
									onPress={handleGalleryLaunch}
								>
									<View style={styles.iconcontainer}>
										<MaterialIcons
											name="photo-library"
											size={24}
											color="white"
										/>
									</View>
									<Text style={styles.optionText}>Gallery</Text>
								</TouchableOpacity>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
			</Modal>

			<Modal
				transparent={true}
				visible={previewVisible}
				animationType="fade"
				onRequestClose={togglePreview}
			>
				<View style={styles.previewOverlay}>
					<Text
						onPress={togglePreview}
						style={{
							color: "#fff",
							fontSize: 34,
							alignSelf: "flex-start",
							position: "absolute",
							top: 0,
							left: 10,
						}}
					>
						⛌
					</Text>
					{/* media secion */}
					<View
						style={{
							height: SCREEN_HEIGHT * 0.4,
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "rgba(255,255,255, 0.2)",
						}}
					>
						{selectedMedia?.type?.includes("image") ? (
							<Image
								source={{
									uri: selectedMedia?.uri,
								}}
								resizeMode="contain"
								style={{ width: "100%", height: "100%" }}
							/>
						) : (
							<Video
								source={{
									uri: selectedMedia?.uri,
								}}
								style={{ width: "100%", height: "100%" }}
								volume={10}
							/>
						)}
					</View>

					<View
						style={{
							backgroundColor: "#fff",
							marginTop: 20,
							position: "absolute",
							bottom: 0,
							width: "100%",
							borderRadius: 8,
							paddingHorizontal: 10,
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<TextInput
							placeholder="Add Description here..."
							placeholderTextColor={"gray"}
							onChangeText={(text) =>
								setSelectedMedia((prev) => ({
									...prev,
									text: text,
								}))
							}
							style={{ width: "90%" }}
						/>
						<View
							style={{
								backgroundColor: colors.skyblue,
								width: 40,
								height: 34,
								borderRadius: 12,
								alignItems: "center",
								justifyContent: "center",
								paddingBottom: 4,
							}}
						>
							<Text
								onPress={confirmSendMedia}
								style={{ color: "#fff", fontSize: 20 }}
							>
								➤
							</Text>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "white" },
	sendButton: {
		backgroundColor: "#007AFF",
		padding: 10,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10,
	},
	selectedMediaContainer: { marginTop: 10, marginBottom: 10 },
	selectimagecon: { width: 300, height: 300, borderRadius: 10 },
	removeIconContainer: { position: "absolute", right: 20, top: 10 },
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.1)",
		justifyContent: "flex-end",
	},
	previewOverlay: {
		flex: 1,
		backgroundColor: colors.skyblue,
		justifyContent: "center",
		position: "relative",
	},
	modalcontainers: {
		backgroundColor: "white",
		flexDirection: "row",
		padding: 40,
		borderRadius: 20,
		alignItems: "flex-start",
		justifyContent: "space-between",
		bottom: 50,
	},
	option: { alignItems: "center" },
	iconcontainer: {
		backgroundColor: colors.skyblue,
		padding: 15,
		borderRadius: 50,
		marginBottom: 10,
	},
	optionText: { color: colors.skyblue },
	uploadButton: {
		marginLeft: 10,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	messageImage: {
		width: 200,
		height: 200,
		borderRadius: 10,
		margin: 5,
	},
});

export default ChatScreen;
