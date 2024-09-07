import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../../utils";
import Header from "../../utils/Header";
import { RfH, RfW, getKey } from "../../utils/helper";
import Icon from "react-native-vector-icons/AntDesign";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import Video from "react-native-video";
import { styles } from "./styles";
import { setKycStatus } from "../../redux/KYCReducer";
import { useDispatch } from "react-redux";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import { useNavigation } from "@react-navigation/native";

const KycVarifyScreen = () => {
  const [aadhar_front, setAadhar_front] = useState(null);
  const [aadhar_back, setAadhar_back] = useState(null);
  const [paper_cutting1, setPaper_cutting1] = useState(null);
  const [paper_cutting2, setPaper_cutting2] = useState(null);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false; // Let the system handle the back button event
  });

  const handleSelectImage = (side) => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        if (side === "front") {
          setAadhar_front(selectedImage);
        } else {
          setAadhar_back(selectedImage);
        }
      }
    });
  };

  const handleSelectImage2 = (side) => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage2 = response.assets[0].uri;
        if (side === "front") {
          setPaper_cutting1(selectedImage2);
        } else {
          setPaper_cutting2(selectedImage2);
        }
      }
    });
  };

  const dispatch = useDispatch();

  const handleRecordVideo = () => {
    launchCamera(
      {
        mediaType: "video",
        videoQuality: "high",
        durationLimit: 10,
      },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setVideo(response.assets[0].uri);
        }
      }
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = await getKey("AuthKey");
      const formData = new FormData();
      if (aadhar_front) {
        formData.append("aadhar_front", {
          uri: aadhar_front,
          type: "image/jpeg",
          name: "aadhar_front.jpg",
        });
      }
      if (aadhar_back) {
        formData.append("aadhar_back", {
          uri: aadhar_back,
          type: "image/jpeg",
          name: "aadhar_back.jpg",
        });
      }
      if (paper_cutting1) {
        formData.append("paper_cutting1", {
          uri: paper_cutting1,
          type: "image/jpeg",
          name: "paper_cutting1.jpg",
        });
      }
      if (paper_cutting2) {
        formData.append("paper_cutting2", {
          uri: paper_cutting2,
          type: "image/jpeg",
          name: "paper_cutting2.jpg",
        });
      }
      if (video) {
        formData.append("video", {
          uri: video,
          type: "video/mp4",
          name: "video.mp4",
        });
      }

      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/account/kyc/",
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
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit KYC");
      }
      console.log("KYC submitted successfully!");
      navigation.navigate("Home");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <>
        <Header HeaderTxt={"KYC"} showNotificationIcon={false} />
      </>
      <ScrollView>
        <View style={styles.homecontainer}>
          {/* Aadhar Card */}

          <View>
            <Text style={styles.prooftxtsty}>
              Upload ID Proof (Aadhar Card) *
            </Text>
            <Text style={styles.suggesttxt}>
              It's important to prioritize your privacy and security online.
            </Text>
          </View>
          <View style={styles.proofimgcon}>
            <TouchableOpacity
              style={styles.idproofsty}
              onPress={() => handleSelectImage("front")}
            >
              {aadhar_front ? (
                <Image
                  source={{ uri: aadhar_front }}
                  style={styles.imagePreview}
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.mediatxt}>Front</Text>
                  <Icon
                    name={"camerao"}
                    size={32}
                    color={colors.skyblue}
                    style={{ alignSelf: "center" }}
                  />
                  <Text style={styles.mediatxt}>Browse</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.idproofsty}
              onPress={() => handleSelectImage("back")}
            >
              {aadhar_back ? (
                <Image
                  source={{ uri: aadhar_back }}
                  style={styles.imagePreview}
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.mediatxt}>Back</Text>
                  <Icon
                    name={"camerao"}
                    size={32}
                    color={colors.skyblue}
                    style={{ alignSelf: "center" }}
                  />
                  <Text style={styles.mediatxt}>Browse</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          {/* Aadhar Card */}

          {/* Other Proof */}

          <View style={{ marginTop: RfH(20) }}>
            <Text style={styles.prooftxtsty}>Upload Any Other ID Proof.</Text>
            <Text style={styles.suggesttxt}>
              In this you can upload a card or a paper cutting of the political
              party you are associated with (this is optional)
            </Text>
          </View>
          <View style={styles.proofimgcon}>
            <TouchableOpacity
              style={styles.idproofsty}
              onPress={() => handleSelectImage2("front")}
            >
              {paper_cutting1 ? (
                <Image
                  source={{ uri: paper_cutting1 }}
                  style={styles.imagePreview}
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.mediatxt}>Paper</Text>
                  <Icon
                    name={"camerao"}
                    size={32}
                    color={colors.skyblue}
                    style={{ alignSelf: "center" }}
                  />
                  <Text style={styles.mediatxt}>Cutting 1</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.idproofsty}
              onPress={() => handleSelectImage2("Back")}
            >
              {paper_cutting2 ? (
                <Image
                  source={{ uri: paper_cutting2 }}
                  style={styles.imagePreview}
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.mediatxt}>Paper</Text>
                  <Icon
                    name={"camerao"}
                    size={32}
                    color={colors.skyblue}
                    style={{ alignSelf: "center" }}
                  />
                  <Text style={styles.mediatxt}>Cutting 2</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Other Proof */}

          <View
            style={{
              borderWidth: 0.8,
              borderRadius: 8,
              padding: RfH(10),
              marginTop: RfH(20),
              borderColor: colors.GRAY,
            }}
          >
            <Text style={styles.prooftxtsty}>Video Upload</Text>
            <Text style={styles.suggesttxt}>
              For a smooth video KYC process, introduce yourself by mentioning
              your Full name, your father's name and any one of the following
              documents: PAN card, Aadhar card, or Party Id for example:
            </Text>
            <Text style={styles.suggesttxt}>
              Hello, I am Shivam Upadhayay my father name is Ram Kripal
              Upadhayay. I live at Pratapgarh(up) here is my Aadhar
              verification.
            </Text>
          </View>
          <View style={styles.videocontainer}>
            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "space-between" }}
              onPress={handleRecordVideo}
            >
              <Text style={styles.recordtxtsty}>Record video</Text>
              <Icon
                name={"videocamera"}
                size={22}
                color={colors.skyblue}
                style={{ alignSelf: "center" }}
              />
            </TouchableOpacity>
          </View>
          {video && (
            <View style={styles.videoPreviewContainer}>
              <Text style={styles.videotxt}>Recorded Video:</Text>
              <Video
                source={{ uri: video }}
                style={styles.videoPreview}
                controls={true}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.btnsty1}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.btnsty}
          onPress={handleSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.WHITE} />
          ) : (
            <Text style={styles.btntxtsty}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default KycVarifyScreen;
