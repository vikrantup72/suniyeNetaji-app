import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { RfH, RfW } from "../../utils/helper";
import { colors } from "../../utils";
import Icon from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { Groupmsglisting } from "../../redux/ChatReducerSlice";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import { useNavigation } from "@react-navigation/native";
import DocumentPicker from "react-native-document-picker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const ChatScreen = ({ route }) => {
  const { item } = route?.params || [];
  console.log(item, "bnb");

  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [message, setMessage] = useState("");

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  });

  const room_id = item?.room_id || item?.id;
  console.log(room_id, "room_id");

  const dispatch = useDispatch();
  const groupmassage = useSelector((state) => state.chat.groupmsg);
  const messages = groupmassage?.results?.messages || [];

  useEffect(() => {
    if (room_id && item?.room_type === "group") {
      dispatch(Groupmsglisting(room_id));
    }
  }, [room_id, dispatch]);

  const renderItem = ({ item }) => (
    <View style={styles.msgcontainer}>
      <Text style={styles.namesty}>{item.sender_full_name}</Text>
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.timesty}>
        {new Date(item.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </Text>
    </View>
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setSelectedMedia({ uri: result[0].uri, type: "document" });
      toggleModal();
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User canceled the document picker");
      } else {
        throw err;
      }
    }
  };

  const handleCameraLaunch = () => {
    launchCamera({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setSelectedMedia({ uri: response.assets[0].uri, type: "image" });
        toggleModal();
      }
    });
  };

  const handleGalleryLaunch = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setSelectedMedia({ uri: response.assets[0].uri, type: "image" });
        toggleModal();
      }
    });
  };

  const handleSend = () => {
    if (selectedMedia) {
      console.log("Selected Media URI:", selectedMedia.uri);
    } else if (message.trim()) {
      console.log("Message:", message);
    } else {
      console.log("No media or message to send.");
    }

    // Reset after sending
    setSelectedMedia(null);
    setMessage("");
  };

  const removeSelectedMedia = () => {
    setSelectedMedia(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headersty}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="left"
              size={20}
              color={colors.black}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={
              item?.room_type === "group"
                ? () => navigation.navigate("GroupInfo", { item })
                : null
            }
            style={styles.headerTouchable}
          >
            <View style={styles.profileimagecon}>
              {item?.image ? (
                <Image
                  source={{
                    uri: `https://stage.suniyenetajee.com${item.image}`,
                  }}
                  style={styles.imgsty}
                />
              ) : item?.picture ? (
                <Image
                  source={{
                    uri: `https://stage.suniyenetajee.com${item.picture}`,
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
            <View>
              <Text
                style={[
                  item?.room_type === "group"
                    ? styles.headername2
                    : styles.headername,
                ]}
              >
                {item?.display_name}
                {item?.full_name}
              </Text>
              {item?.room_type === "group" && (
                <Text style={styles.infotxtsty}>tap here for group info</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {item?.room_type === "group" && (
        <View style={styles.homecontainer}>
          <FlatList
            data={messages}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      )}

      {selectedMedia && (
        <View style={styles.selectedMediaContainer}>
          {selectedMedia.type === "image" && (
            <Image
              source={{ uri: selectedMedia.uri }}
              resizeMethod="resize"
              style={styles.selectimagecon}
            />
          )}
          {selectedMedia.type === "document" && (
            <View style={styles.documentPreview}>
              <Image
                source={{ uri: selectedMedia.uri }}
                resizeMethod="resize"
                style={styles.selectimagecon}
              />
            </View>
          )}
          <TouchableOpacity
            style={styles.removeIconContainer}
            onPress={removeSelectedMedia}
          >
            <Ionicons name="close-circle" size={28} color={"red"} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputsty}>
        <TouchableOpacity
          onPress={toggleModal}
          style={styles.mediaIconContainer}
        >
          <MaterialIcons name="perm-media" size={25} color={colors.skyblue} />
        </TouchableOpacity>
        <View style={styles.inputcontainer}>
          <TextInput
            placeholder="write your message.."
            style={styles.inputtxtsty}
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
        </View>
        <TouchableOpacity
          onPress={handleSend}
          style={styles.sendButtonContainer}
        >
          <Ionicons
            name="send"
            size={18}
            color={colors.WHITE}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>

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
                      color={colors.WHITE}
                      style={{ alignSelf: "center" }}
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
                      color={colors.WHITE}
                      style={{ alignSelf: "center" }}
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
                      color={colors.WHITE}
                      style={{ alignSelf: "center" }}
                    />
                  </View>
                  <Text style={styles.optionText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  homecontainer: {
    marginTop: RfH(20),
    paddingHorizontal: RfW(20),
  },
  headersty: {
    flexDirection: "row",
    paddingHorizontal: RfW(15),
    paddingVertical: RfH(15),
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY,
  },
  selectimagecon: {
    height: RfW(320),
    width: RfW(330),
    alignSelf: "center",
    borderColor: colors.GRAY,
    borderWidth: 2,
    borderRadius: 10,
  },
  modalcontainers: {
    backgroundColor: colors.WHITE,
    flexDirection: "row",
    height: RfH(150),
    width: "94%",
    justifyContent: "space-around",
    borderRadius: 20,
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    top: RfH(3),
  },
  backIcon: {
    top: RfH(10),
  },
  headerTouchable: {
    flexDirection: "row",
    width: "100%",
  },
  selectimg: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  removeIconContainer: {
    position: "absolute",
    alignSelf: "flex-end",
    right: 20,
    top: -15,
  },
  msgcontainer: {
    padding: RfH(10),
    marginVertical: RfH(10),
    maxWidth: Dimensions.get("window").width * 0.7,
    minWidth: RfW(100),
    alignSelf: "flex-start",
    backgroundColor: colors.shadwo_blue,
    borderBottomRightRadius: RfH(20),
    borderTopLeftRadius: RfH(20),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  imgsty: {
    height: RfH(36),
    width: RfW(36),
    borderRadius: RfH(18),
    resizeMode: "cover",
  },
  namesty: {
    fontSize: 12,
  },
  timesty: {
    alignSelf: "flex-end",
    color: colors.skyblue,
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    top: 2,
  },
  iconcontainer: {
    alignSelf: "center",
    backgroundColor: colors.skyblue,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    marginTop: RfH(35),
  },
  inputsty: {
    position: "absolute",
    bottom: RfH(0),
    flexDirection: "row",
    paddingHorizontal: RfW(20),
    backgroundColor: colors.WHITE,
    paddingVertical: RfH(5),
  },
  profileimagecon: {
    height: RfH(36),
    width: RfW(36),
    borderWidth: 1,
    borderRadius: RfH(18),
    resizeMode: "cover",
    borderColor: colors.GRAY,
    marginHorizontal: 10,
    top: 1,
  },
  messageText: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: colors.skyblue,
  },
  infotxtsty: {
    fontSize: 11,
    color: colors.DARK_GRAY,
    left: 2,
  },
  sendmsgcontainer: {
    padding: RfH(10),
    marginVertical: RfH(5),
    maxWidth: Dimensions.get("window").width * 0.7,
    alignSelf: "flex-end",
    backgroundColor: "#EBEAEA",
  },
  sendmsgtxt: {
    color: colors.black,
  },
  flatListContent: {
    paddingBottom: RfH(130),
  },
  inputcontainer: {
    backgroundColor: "#EBEBEB",
    width: "80%",
    paddingHorizontal: RfW(10),
    flexDirection: "row",
    borderRadius: RfH(8),
    left: RfW(10),
    height: RfH(40),
  },
  inputtxtsty: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Poppins-Regular",
    justifyContent: "center",
    top: RfH(1),
  },
  mediaIconContainer: {
    top: RfH(5),
  },
  sendButtonContainer: {
    backgroundColor: colors.skyblue,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    left: RfW(14),
    bottom: RfH(3),
  },
  sendIcon: {
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: RfH(20),
    backgroundColor: "white",
    borderRadius: RfH(20),
    padding: RfH(35),
    width: RfW(220),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headername: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "500",
    top: RfH(7),
  },
  headername2: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "500",
  },
});
