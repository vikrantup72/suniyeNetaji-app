import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../utils/Header";
import { RfH, RfW, getKey } from "../../utils/helper";
import { styles } from "../AuthScreen/SignUpScreen/styles";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils";
import Icon from "react-native-vector-icons/Entypo";
import { launchImageLibrary } from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileData } from "../../redux/ProfileSlice";
import DatePicker from "react-native-date-picker";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  deleteExperience,
  fetchExperienceData,
  fetchExperienceDataById,
} from "../../redux/ExperienceSlice";
import Parties from "./Parties";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [full_name, setFull_name] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [email, setEmail] = useState("");
  const [date_of_birth, setDate_of_birth] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [newImageSelected, setNewImageSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [partyData, setPartyData] = useState([]);
  const [party, setParty] = useState("");
  const [partyIndex, setPartyIndex] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null); // State to hold the selected experience
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isPartySheetVisible, setIsPartySheetVisible] = useState(false);

  const { datas } = useSelector((state) => state.profile);
  console.log(datas, "datas");

  const { experiencedata, error } = useSelector((state) => state.experience);
  console.log(experiencedata, "experiencedataxyz");

  useEffect(() => {
    dispatch(fetchProfileData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchExperienceData());
  }, [dispatch]);

  useEffect(() => {
    if (datas) {
      setFull_name(datas.full_name?.trim() || "");
      setPhone_number(datas.phone_number?.trim() || "");
      setEmail(datas.user_email?.trim() || "");
      setDate_of_birth(datas.date_of_birth?.trim() || "");
      setLocation(datas.location?.trim() || "");
      setGender(datas.gender?.trim() || "");
      setParty(datas.party?.id || "");
      if (datas.picture) {
        const imageURL = `https://apis.suniyenetajee.com/${datas.picture.trim()}`;
        setSelectedImage({ uri: imageURL });
      } else {
        setSelectedImage(null);
      }
    }
  }, [datas]);

  const getParty = async () => {
    try {
      const token = await getKey("AuthKey");
      const requestOptions = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const response = await fetch(
        "https://apis.suniyenetajee.com/api/v1/master/party",
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();

      console.log(responseData, "responseData");
      responseData.unshift({
        id: -1,
        name: "No Party",
        symbol: "/media/Bharatiya_Janata_Party_logo.svg.webp",
      });

      setPartyData(responseData);
    } catch (error) {
      console.error("Fetch error:", error);
      ToastAndroid.show(
        "Failed to fetch party data. Please try again.",
        ToastAndroid.BOTTOM
      );
    }
  };

  useEffect(() => {
    getParty();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("full_name", full_name.trim());
      formData.append("phone_number", phone_number.trim());
      formData.append("email", email.trim());
      formData.append("date_of_birth", date_of_birth.trim());
      formData.append("location", location.trim());
      formData.append("gender", gender.trim());
      formData.append("party", party === -1 ? "" : party);

      if (newImageSelected && selectedImage) {
        formData.append("picture", {
          uri: selectedImage.uri,
          type: selectedImage.type || "image/jpeg",
          name: selectedImage.fileName || "profile.jpg",
        });
      }

      const token = await getKey("AuthKey");
      const response = await fetch(
        "https://apis.suniyenetajee.com/api/v1/account/profile/",
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log("update profile API response:", responseData);
      navigation.navigate("Menu");
    } catch (error) {
      console.error("Error updating profile:", error);
      ToastAndroid.show(
        "Please upload a valid or different profile picture. Please try again.",
        ToastAndroid.BOTTOM
      );
    } finally {
      setLoading(false);
    }
  };

  const openGallery = () => {
    const options = {
      mediaType: "photo",
      selectionLimit: 1,
      includeBase64: false,
      saveToPhotos: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User canceled image picker");
      } else if (response.error) {
        console.error("ImagePicker Error: ", response.error);
        Alert.alert("Error", "An error occurred while selecting image");
      } else if (response.assets && response.assets.length > 0) {
        const selected = response.assets[0];
        setSelectedImage({
          uri: selected.uri,
          type: selected.type,
          fileName: selected.fileName,
        });
        setNewImageSelected(true);
        console.log("Selected image URI:", selected.uri);
      }
    });
  };

  const confirmRemoveFollower = (item) => {
    setSelectedExperience(item);
    setModalVisible(true);
  };

  const handleEdit = (id) => {
    navigation.navigate("AddExperience", { id: id, flag: "EditExperience" });
  };

  const handleRemoveExperience = () => {
    console.log("Removing experience:", selectedExperience);
    const id = selectedExperience?.id;
    setModalVisible(false);
    dispatch(deleteExperience(id));
  };

  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  return (
    <SafeAreaView style={styles.editprocontainer}>
      <Header HeaderTxt={"Edit Profile"} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.tabVideo}>
          {selectedImage && selectedImage.uri ? (
            <View style={styles.tabVideo}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.profileimgsty}
              />
            </View>
          ) : (
            <View style={styles.tabVideo}>
              <Image
                source={require("../../assets/images/dummyplaceholder.png")}
                style={styles.profileimgsty}
              />
            </View>
          )}
        </View>
        <View>
          <TouchableOpacity onPress={openGallery} style={styles.icontainer}>
            <Icon
              name={"camera"}
              size={16}
              color={colors.skyblue}
              style={{ alignSelf: "center" }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: RfW(20), marginTop: RfH(30) }}>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text style={styles.placeholderheader}>Full Name.</Text>
              <View style={styles.inputfieldsty}>
                <TextInput
                  style={styles.profiletxt}
                  placeholder="Enter first-Name"
                  value={full_name}
                  onChangeText={(txt) => setFull_name(txt)}
                />
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.placeholderheader}>Mobile No.</Text>
          </View>
          <View style={styles.inputfieldsty}>
            <TextInput
              style={styles.profiletxt}
              placeholder="Enter mobile number"
              value={phone_number}
              maxLength={10}
              keyboardType="number-pad"
              onChangeText={(txt) => setPhone_number(txt)}
            />
          </View>
          <View>
            <Text style={styles.placeholderheader}>Email.</Text>
          </View>
          <View style={styles.inputfieldsty}>
            <TextInput
              style={styles.profiletxt}
              placeholder="Enter email"
              value={email}
              onChangeText={(txt) => setEmail(txt)}
            />
          </View>
          <View>
            <Text style={styles.placeholderheader}>DOB.</Text>
          </View>
          <View
            style={[
              styles.inputfieldsty,
              { height: RfH(45), justifyContent: "center" },
            ]}
          >
            <TouchableOpacity
              onPress={() => setOpen(true)}
              style={{ paddingHorizontal: RfW(5) }}
            >
              <Text style={{ color: colors.primary_black }}>
                {date_of_birth ? date_of_birth : "YYYY-MM-DD"}
              </Text>
            </TouchableOpacity>
          </View>
          <DatePicker
            modal
            open={open}
            date={date}
            mode="date"
            onConfirm={(date) => {
              setOpen(false);
              setDate(date);
              const formattedDate = date.toISOString().split("T")[0];
              setDate_of_birth(formattedDate);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />

          <View>
            <Text style={styles.placeholderheader}>Location.</Text>
          </View>
          <View style={styles.inputfieldsty}>
            <TextInput
              style={styles.profiletxt}
              placeholder="Enter location"
              value={location}
              onChangeText={(txt) => setLocation(txt)}
            />
          </View>
          <View>
            <Text style={styles.placeholderheader}>Gender.</Text>
          </View>
          <View style={styles.inputfieldsty}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
              style={styles.gendersty}
            >
              <Picker.Item label="Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>
          <View>
            <Text style={styles.placeholderheader}>Select Party.</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setIsPartySheetVisible(true)} // Open the party bottom sheet
            style={[
              styles.inputfieldsty,
              {
                justifyContent: "center",
                height: RfH(50),
                paddingLeft: RfW(15),
              },
            ]}
          >
            <Text>
              {partyData.find((p) => p.id === party)?.name || "Select Party"}
            </Text>
          </TouchableOpacity>
          {/* <View style={styles.inputfieldsty}>
            <Picker
              selectedValue={party}
              onValueChange={(itemValue, itemIndex) => {
                setParty(itemValue);
                setPartyIndex(itemIndex);
              }}
              style={styles.partyinputcon}
            >
              {partyData.map((party, index) => (
                <Picker.Item
                  key={party.id}
                  label={party.name}
                  value={party.id}
                />
              ))}
            </Picker>
          </View> */}
          <Parties
            visible={isPartySheetVisible}
            onClose={() => setIsPartySheetVisible(false)}
            onSelect={setParty}
            partyData={partyData}
          />
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text style={styles.placeholderheader}>Experience</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate("AddExperience")}
              >
                <Image
                  source={require("../../assets/images/plush.png")}
                  style={styles.plushiconsty}
                />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: RfW(17), marginTop: RfH(10) }}>
              <FlatList
                data={experiencedata?.results}
                renderItem={({ item }) => (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <Text
                          style={[styles.camponytxtsty, { width: RfW(220) }]}
                        >
                          {item.company}
                        </Text>
                        <Text
                          style={[
                            styles.datatxtsty,
                            { color: "#000", width: RfW(220) },
                          ]}
                        >
                          {item.title}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", left: RfW(5) }}>
                        <TouchableOpacity
                          onPress={() => confirmRemoveFollower(item)}
                          style={styles.iconcontainer}
                        >
                          <AntDesign
                            name={"delete"}
                            size={15}
                            color={colors.black}
                            style={{ alignSelf: "center" }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.iconcontainer}
                          onPress={() => handleEdit(item?.id)}
                        >
                          <AntDesign
                            name={"edit"}
                            size={15}
                            color={colors.black}
                            style={{ alignSelf: "center" }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{ flexDirection: "row", paddingVertical: RfH(3) }}
                    >
                      <Text style={styles.datatxtsty}>{item.start_date}</Text>
                      {item.end_date ? (
                        <Text
                          style={[
                            styles.datatxtsty,
                            { paddingHorizontal: RfW(5) },
                          ]}
                        >
                          - {item.end_date}
                        </Text>
                      ) : (
                        <Text
                          style={[
                            styles.datatxtsty,
                            { paddingHorizontal: RfW(5) },
                          ]}
                        >
                          - Present
                        </Text>
                      )}
                      <Text style={styles.datatxtsty}>{item.total_work}</Text>
                    </View>
                    <View>
                      <Text style={styles.disctxtsty}>{item.description}</Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={renderSeparator}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleUpdateProfile}
          activeOpacity={0.8}
          style={styles.updatebtn}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.WHITE} />
          ) : (
            <Text style={styles.updatetxt}>Update Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to remove this experience?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonRemove]}
                onPress={handleRemoveExperience}
              >
                <Text style={styles.textStyle}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
