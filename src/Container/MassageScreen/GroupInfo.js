import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal, // Use this if you're using the built-in modal
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GroupList } from "../../redux/ChatReducerSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RfH, RfW } from "../../utils/helper";
import { colors } from "../../utils";
// If using react-native-modal
// import Modal from "react-native-modal";

const GroupInfo = ({ route }) => {
  const { item } = route.params;
  const id = item?.id;
  const dispatch = useDispatch();
  const groupData = useSelector((state) => state.chat.groupinfo);
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (id) {
      dispatch(GroupList(id));
    }
  }, [id, dispatch]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderParticipant = ({ item }) => (
    <View style={styles.participantItem}>
      <TouchableOpacity activeOpacity={0.8} style={styles.participantTouchable}>
        <View style={styles.profileImageContainer}>
          {item.picture[0] ? (
            <Image
              source={{
                uri: `https://stage.suniyenetajee.com${item.picture[0]}`,
              }}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={require("../../assets/images/dummyplaceholder.png")}
              style={styles.profileImage}
            />
          )}
        </View>
        <View style={styles.participantTextContainer}>
          <Text style={styles.participantName}>{item.full_name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const ListHeaderComponent = () => (
    <View>
      {groupData ? (
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrowleft"
              size={25}
              color={colors.black}
              style={styles.leftIcon}
            />
          </TouchableOpacity>
          <View style={styles.groupInfoContainer}>
            <View style={styles.groupImageContainer}>
              {groupData.image ? (
                <Image
                  source={{
                    uri: `https://stage.suniyenetajee.com${groupData.image}`,
                  }}
                  style={styles.groupImage}
                />
              ) : (
                <Image
                  source={require("../../assets/images/dummyplaceholder.png")}
                  style={styles.groupImage}
                />
              )}
            </View>
            <Text style={styles.groupName}>{groupData.name}</Text>
            {groupData.description ? (
              <Text style={styles.groupDescription}>
                {groupData.description}
              </Text>
            ) : null}
            <Text style={styles.groupDate}>
              Group. {groupData?.total_participants} members
            </Text>
          </View>
          <TouchableOpacity onPress={toggleModal}>
            <Feather
              name="more-vertical"
              size={25}
              color={colors.black}
              style={styles.dotIcon}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
      <View style={styles.participantsHeaderContainer}>
        <View style={styles.participantsHeader}>
          <Text style={styles.participantsHeaderText}>
            {groupData?.total_participants} members
          </Text>
        </View>
        <Feather
          name="search"
          size={18}
          color={colors.DARK_GRAY}
          style={styles.searchIcon}
        />
      </View>
      <View style={styles.addPersonContainer}>
        <View style={styles.addPersonIconContainer}>
          <Ionicons
            name="person-add"
            size={25}
            color={colors.WHITE}
            style={styles.addPersonIcon}
          />
        </View>
        <View>
          <Text style={styles.addPersonText}>Add Person</Text>
        </View>
      </View>
      <View style={styles.adminContainer}>
        <TouchableOpacity activeOpacity={0.8} style={styles.adminTouchable}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require("../../assets/images/dummyplaceholder.png")}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.participantTextContainer}>
            <Text style={styles.participantName}>
              {groupData?.created_by?.name}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.adminBadge}>
          <Text style={styles.adminText}>Group Admin</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={groupData?.participants}
        renderItem={renderParticipant}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={ListHeaderComponent}
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalText}>Option 1</Text>
                <Text style={styles.modalText}>Option 2</Text>
                <Text style={styles.modalText}>Option 3</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default GroupInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: RfH(10),
  },
  groupInfoContainer: {
    padding: RfH(10),
    alignItems: "center",
  },
  groupImageContainer: {
    height: RfH(80),
    width: RfW(80),
    borderWidth: 1,
    borderRadius: RfH(45),
    borderColor: colors.GRAY,
    marginBottom: RfH(10),
  },
  groupImage: {
    height: "100%",
    width: "100%",
    borderRadius: RfH(40),
  },
  groupName: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
    marginBottom: RfH(5),
  },
  groupDescription: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Poppins-Regular",
    color: colors.GRAY,
    marginBottom: RfH(5),
    textAlign: "center",
  },
  groupDate: {
    fontSize: 14,
    fontWeight: "300",
    fontFamily: "Poppins-Light",
    color: colors.DARK_GRAY,
    marginBottom: RfH(15),
  },
  leftIcon: {
    top: RfH(20),
    left: RfW(20),
  },
  dotIcon: {
    right: 10,
    top: RfH(20),
  },
  participantsHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: RfW(20),
  },
  participantsHeader: {
    backgroundColor: colors.WHITE,
    paddingVertical: RfH(10),
  },
  participantsHeaderText: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.DARK_GRAY,
  },
  searchIcon: {
    top: RfH(12),
  },
  addPersonContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: RfH(10),
  },
  addPersonIconContainer: {
    backgroundColor: colors.skyblue,
    height: RfH(50),
    width: RfW(50),
    borderRadius: RfH(25),
    justifyContent: "center",
  },
  addPersonIcon: {
    alignSelf: "center",
  },
  addPersonText: {
    left: 10,
    top: RfH(12),
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Poppins-Medium",
    color: colors.black,
  },
  adminContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: RfH(10),
  },
  adminTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    height: RfH(50),
    width: RfW(50),
    borderWidth: 1,
    borderRadius: RfH(25),
    borderColor: colors.GRAY,
    overflow: "hidden",
  },
  profileImage: {
    height: "100%",
    width: "100%",
    borderRadius: RfH(25),
  },
  participantTextContainer: {
    marginLeft: RfW(10),
  },
  participantItem: {
    paddingVertical: RfH(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: RfW(20),
  },
  participantTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantName: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
    color: colors.black,
  },
  separator: {
    height: 1,
    backgroundColor: colors.LIGHT_GRAY,
    marginHorizontal: 20,
  },
  adminBadge: {
    backgroundColor: colors.shadwo_red,
    paddingHorizontal: 8,
    borderRadius: 8,
    height: RfH(30),
    justifyContent: "center",
  },
  adminText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Poppins-SemiBold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: colors.WHITE,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: RfW(150),
    position: "absolute",
    top: RfH(60),
    alignSelf: "flex-end",
    right: RfW(35),
  },
  modalText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
    marginVertical: 10,
  },
});
