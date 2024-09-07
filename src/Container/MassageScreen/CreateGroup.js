import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { colors } from "../../utils";
import Header from "../../utils/Header";
import { RfH, RfW } from "../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { launchImageLibrary } from "react-native-image-picker";
import { followerslist, createGroupChat } from "../../redux/ChatReducerSlice";
import Icon from "react-native-vector-icons/AntDesign";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import { useNavigation } from "@react-navigation/native";

const CreateGroup = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const followes = useSelector((state) => state.chat.data);
  const [groupname, setGroupname] = useState();
  const [image, setImage] = useState(null);
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(followerslist());
  }, [dispatch]);

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  });

  const handleSelectImage = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleSelectFollower = (item) => {
    setSelectedFollowers((prevSelected) => {
      if (prevSelected.includes(item.user_id)) {
        return prevSelected.filter((id) => id !== item.user_id);
      } else {
        return [...prevSelected, item.user_id];
      }
    });
  };

  const handleCreateGroup = () => {
    setIsLoading(true);
    dispatch(
      createGroupChat({
        name: groupname,
        participants: selectedFollowers,
        image,
      })
    ).finally(() => {
      setIsLoading(false);
    });
  };

  const handleText = (text) => {
    setGroupname(text);
  };

  const ListHeaderComponent = () => {
    return (
      <View style={styles.inputcon}>
        <TouchableOpacity onPress={handleSelectImage} style={styles.imgcon}>
          {image ? (
            <Image source={{ uri: image }} style={styles.groupimgsty} />
          ) : (
            <Image
              source={require("../../assets/images/dummyplaceholder.png")}
              style={styles.groupimgsty}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.choosetxtsty}>Choose your group image</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedFollowers.includes(item.user_id);
    return (
      <View style={styles.itemconsty}>
        <View style={styles.rowContainer}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.profileimagecon}>
              {item?.picture ? (
                <Image
                  source={{
                    uri: `https://stage.suniyenetajee.com${item?.picture}`,
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
            <View style={styles.nametxt}>
              <Text style={styles.headertxtsty}>{item?.full_name}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor: isSelected
                  ? colors.shadwo_blue
                  : colors.skyblue,
              },
            ]}
            onPress={() => handleSelectFollower(item)}
          >
            {isSelected ? (
              <View style={{ flexDirection: "row" }}>
                <Icon
                  name="check"
                  size={15}
                  color={colors.black}
                  style={{ top: 1 }}
                />
                <Text style={[styles.addButtonText, { color: "#000" }]}>
                  Added
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.plushicon}>+</Text>
                <Text style={styles.addButtonText}>Add</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header HeaderTxt={"Create Group"} showNotificationIcon={false} />
        <View>
          <ListHeaderComponent />
          <View style={styles.bordersty}>
            <TextInput
              placeholder="Name your group"
              // value={groupname}
              onChangeText={handleText}
              placeholderTextColor={colors.DARK_GRAY}
              style={styles.placeholdersty}
            />
          </View>
          <View style={styles.inputcontaint}>
            <View style={{ justifyContent: "center" }}>
              <Icon
                name="search1"
                size={18}
                color={colors.DARK_GRAY}
                style={{ top: 1 }}
              />
            </View>
            <View style={{ top: RfH(2), left: RfW(2), width: "100%" }}>
              <TextInput
                placeholder={"Search for people to add"}
                placeholderTextColor={colors.DARK_GRAY}
              />
            </View>
          </View>
          <FlatList
            data={followes?.results?.[0]?.followers || []}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.homecontainer}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>Wait if you have followers..</Text>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </SafeAreaView>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.btnsty}
        onPress={handleCreateGroup}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.WHITE} />
        ) : (
          <Text style={styles.btntxtsty}>Create Group</Text>
        )}
      </TouchableOpacity>
    </>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  inputcontaint: {
    flexDirection: "row",
    paddingHorizontal: RfW(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.skyblue,
    marginVertical: 20,
    backgroundColor: colors.shadwo_blue,
    height: 40,
    width: RfW(330),
    alignSelf: "center",
  },
  imgcon: {
    borderWidth: 1,
    height: 75,
    width: 75,
    borderRadius: 38,
    alignSelf: "center",
    justifyContent: "center",
    borderColor: colors.skyblue,
  },
  placeholdersty: {
    top: RfH(5),
    color: colors.black,
  },
  homecontainer: {
    paddingHorizontal: RfW(20),
    marginTop: "5%",
  },
  groupimgsty: {
    height: RfH(72),
    width: RfW(70),
    alignSelf: "center",
    borderRadius: RfH(35),
    resizeMode: "contain",
  },
  inputsty: {
    borderWidth: 1,
    height: RfH(40),
    borderRadius: RfH(8),
    borderColor: colors.GRAY,
    marginTop: RfH(10),
    paddingHorizontal: RfW(10),
    color: colors.black,
    justifyContent: "center",
  },
  choosetxtsty: {
    alignSelf: "center",
    fontSize: 14,
    fontWeight: "500",
    color: colors.skyblue,
    top: RfH(3),
  },

  inputcon: { marginVertical: RfH(5) },
  headertxtsty: {
    fontSize: 16,
    fontWeight: "500",
    color: "#242424",
    fontFamily: "Poppins-Medium",
  },
  itemconsty: {
    marginTop: RfH(15),
    backgroundColor: colors.shadwo_blue,
    paddingVertical: RfH(10),
    paddingHorizontal: RfW(10),
    borderRadius: RfH(8),
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  imgsty: {
    height: RfH(45),
    width: RfW(45),
    borderRadius: RfH(25),
    resizeMode: "cover",
    alignSelf: "center",
  },
  profileimagecon: {
    height: RfH(46),
    width: RfW(46),
    borderWidth: 1,
    borderRadius: RfH(35),
    borderColor: colors.GRAY,
    justifyContent: "center",
  },
  nametxt: { justifyContent: "center", bottom: RfH(5), left: RfW(10) },
  btnsty: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: colors.skyblue,
    height: RfH(40),
    width: "90%",
    borderRadius: 8,
    justifyContent: "center",
  },
  btntxtsty: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 19.5,
    color: colors.WHITE,
    alignSelf: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: colors.GRAY,
  },
  bordersty: {
    borderStyle: "dashed",
    borderBottomWidth: 1.2,
    borderBottomColor: colors.skyblue,
    width: RfW(330),
    alignSelf: "center",
    marginTop: RfH(40),
    backgroundColor: colors.shadwo_blue,
    height: RfH(40),
    paddingHorizontal: 10,
  },
  addButton: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: RfW(70),
    height: RfH(30),
  },
  addButtonText: {
    color: colors.WHITE,
    fontWeight: "400",
    alignSelf: "center",
    left: 2,
  },
  plushicon: {
    fontSize: 20,
    fontWeight: "400",
    color: colors.WHITE,
    right: RfW(3),
    bottom: 1,
  },
});
