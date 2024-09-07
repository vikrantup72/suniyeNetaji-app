import React, { useState, useCallback } from "react";
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
} from "react-native";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import GroupHeader from "./components/GroupHeader";
import { SCREEN_HEIGHT } from "../../utils/helper";
import Video from "react-native-video";
import { colors } from "../../utils";

const ChatScreen = () => {
	const [messages, setMessages] = useState([
		{
			_id: 1,
			text: "Hello! How are you?",
			createdAt: new Date(),
			user: {
				_id: 2,
				name: "John Doe",
			},
		},
		{
			_id: 2,
			text: "I'm good, thanks! What about you?",
			createdAt: new Date(),
			user: {
				_id: 1,
				name: "You",
			},
		},
	]);
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
				handleMediaUpload(response.assets[0].uri, "image");
			}
		});
	};

	const handleGalleryLaunch = () => {
		setModalVisible(false);
		launchImageLibrary({ mediaType: "photo" }, (response) => {
			if (!response.didCancel && !response.errorCode) {
				handleMediaUpload(response.assets[0].uri, "image");
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

	const confirmSendMedia = () => {
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
		setMessages((previousMessages) =>
			GiftedChat.append(previousMessages, [newMessage])
		);
		setSelectedMedia(null);
		togglePreview(); // Hide preview
	};

	const groupName = "React Native Devs";
	const participants = 120;
	const groupAvatar =
		"https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"; // Replace with your image URL

	// Customize message bubble background color
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
				groupName={groupName}
				participants={participants}
				groupAvatar={groupAvatar}
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
