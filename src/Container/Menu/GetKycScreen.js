import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../utils";
import Header from "../../utils/Header";
import { getKey, RfH, RfW } from "../../utils/helper";
import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { fetchKycdata } from "../../redux/KYCReducer";
import Video from "react-native-video";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { styles } from "./styles";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import { useNavigation } from "@react-navigation/native";

const GetKycScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const kycData = useSelector((state) => state.kyc.data);
  const [video, setVideo] = useState(null);
  const [aadhar_front, setAadhar_front] = useState(null);
  const [aadhar_back, setAadhar_back] = useState(null);
  const [paper_cutting1, setPaper_cutting1] = useState(null);
  const [paper_cutting2, setPaper_cutting2] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // Add state for fetching
  const [noData, setNoData] = useState(false); // Add state for no data

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        await dispatch(fetchKycdata());
      } catch (error) {
        console.error("Error fetching KYC data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const data = Array.isArray(kycData?.results) ? kycData?.results[0] : {};
  console.log(data, "kycData");

  const id = data?.id;
  const isDataAvailable = Boolean(id);

  useEffect(() => {
    if (isFetching === false && !isDataAvailable) {
      setNoData(true);
    } else {
      setNoData(false);
    }
  }, [isFetching, isDataAvailable]);

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

  const handleEditKyc = () => {
    setShowUpdateButton(!showUpdateButton);
  };

  const handleSelectImage = (setImage) => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleUpdateKyc = async (id) => {
    setIsLoading(true);

    try {
      const token = await getKey("AuthKey");
      const formData = new FormData();

      if (aadhar_front) {
        formData.append("aadhar_front", {
          uri:
            Platform.OS === "android"
              ? aadhar_front
              : aadhar_front.replace("file://", ""),
          type: "image/jpeg",
          name: "aadhar_front.jpg",
        });
      }

      if (aadhar_back) {
        formData.append("aadhar_back", {
          uri:
            Platform.OS === "android"
              ? aadhar_back
              : aadhar_back.replace("file://", ""),
          type: "image/jpeg",
          name: "aadhar_back.jpg",
        });
      }

      if (paper_cutting1) {
        formData.append("paper_cutting1", {
          uri:
            Platform.OS === "android"
              ? paper_cutting1
              : paper_cutting1.replace("file://", ""),
          type: "image/jpeg",
          name: "paper_cutting1.jpg",
        });
      }

      if (paper_cutting2) {
        formData.append("paper_cutting2", {
          uri:
            Platform.OS === "android"
              ? paper_cutting2
              : paper_cutting2.replace("file://", ""),
          type: "image/jpeg",
          name: "paper_cutting2.jpg",
        });
      }

      if (video) {
        formData.append("video", {
          uri: Platform.OS === "android" ? video : video.replace("file://", ""),
          type: "video/mp4",
          name: "video.mp4",
        });
      }

      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/account/kyc/${id}/`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update KYC");
      }
      setShowUpdateButton(false);
      console.log("KYC updated successfully!", responseData);
    } catch (error) {
      console.error("Error updating KYC:", error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        HeaderTxt={"KYC"}
        showNotificationIcon={false}
        showEditIcon={noData ? false : true}
        EditKyc={handleEditKyc}
      />
      <ScrollView>
        {isFetching ? (
          <View>
            <ActivityIndicator
              size="small"
              color={colors.skyblue}
              style={{ marginTop: "80%" }}
            />
          </View>
        ) : noData ? (
          <View style={styles.noDataContainer}>
            <Text
              style={{
                color: colors.LIGHT_BLACK,
                marginTop: "80%",
                fontWeight: "500",
                alignSelf: "center",
                fontSize: 20,
                paddingHorizontal: RfW(20),
              }}
            >
              Please first verify your KYC then you can see your KYC details
              here...
            </Text>
          </View>
        ) : (
          <View style={styles.homecontainer}>
            {/* Aadhar Card */}
            <View>
              <Text style={styles.prooftxtsty}>
                Upload ID Proof (Aadhar Card)
              </Text>
              <Text style={styles.suggesttxt}>
                It's important to prioritize your privacy and security online.
              </Text>
            </View>
            <View style={styles.proofimgcon}>
              <TouchableOpacity
                disabled={!showUpdateButton}
                activeOpacity={0.8}
                style={styles.idproofsty}
                onPress={() => handleSelectImage(setAadhar_front)}
              >
                {aadhar_front || data?.aadhar_front ? (
                  <Image
                    source={{ uri: aadhar_front || data?.aadhar_front }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.mediatxt}>Na</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!showUpdateButton}
                activeOpacity={0.8}
                style={styles.idproofsty}
                onPress={() => handleSelectImage(setAadhar_back)}
              >
                {aadhar_back || data?.aadhar_back ? (
                  <Image
                    source={{ uri: aadhar_back || data?.aadhar_back }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.mediatxt}>Na</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {/* Aadhar Card */}
            {/* Other Proof */}
            <View style={{ marginTop: RfH(20) }}>
              <Text style={styles.prooftxtsty}>Upload Any Other ID Proof.</Text>
              <Text style={styles.suggesttxt}>
                In this you can upload a card or a paper cutting of the
                political party you are associated with (this is optional)
              </Text>
            </View>
            <View style={styles.proofimgcon}>
              <TouchableOpacity
                disabled={!showUpdateButton}
                activeOpacity={0.8}
                style={styles.idproofsty}
                onPress={() => handleSelectImage(setPaper_cutting1)}
              >
                {paper_cutting1 || data?.paper_cutting1 ? (
                  <Image
                    source={{ uri: paper_cutting1 || data?.paper_cutting1 }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.mediatxt}>N/A</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!showUpdateButton}
                activeOpacity={0.8}
                style={styles.idproofsty}
                onPress={() => handleSelectImage(setPaper_cutting2)}
              >
                {paper_cutting2 || data?.paper_cutting2 ? (
                  <Image
                    source={{ uri: paper_cutting2 || data?.paper_cutting2 }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.mediatxt}>N/A</Text>
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
              <Text style={styles.prooftxtsty}>Uploaded Video</Text>
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
            {/* Edit kyc Video */}
            {showUpdateButton && (
              <View style={styles.videocontainer}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
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
            )}
            {/* Edit kyc Video */}
            {(data?.video || video) && (
              <View style={styles.videoPreviewContainer}>
                <Text style={styles.videotxt}>Recorded Video:</Text>
                <Video
                  source={{ uri: video || data?.video }}
                  style={styles.videoPreview}
                  controls={true}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
      {showUpdateButton && (
        <View style={styles.btnsty1}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.btnsty}
            onPress={() => handleUpdateKyc(id)}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.WHITE} />
            ) : (
              <Text style={styles.btntxtsty}>Update Kyc</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default GetKycScreen;
