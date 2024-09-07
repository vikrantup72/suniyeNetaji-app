import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid } from "react-native";
import { BottomSheet } from "react-native-btr";
import { getKey } from "../../utils/helper";

const AccountPrivacyBottomSheet = ({ visible, toggleBottomSheet }) => {
  const [loading, setLoading] = useState(false);

  const updateAccountPrivacy = async (option) => {
    setLoading(true);
    const formData = new FormData();
    formData.append(option.toLowerCase(), option.toLowerCase());

    try {
      const token = await getKey("AuthKey");
      const requestOptions = {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Token ${token}`,
        },
        body: formData,
      };
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/account/profile/",
        requestOptions
      );
      if (response.ok) {
        ToastAndroid.show(`Privacy set to ${option}`, ToastAndroid.BOTTOM);
      } else {
        console.error("Error response:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      toggleBottomSheet(); // Close the BottomSheet after the API call
    }
  };

  const handlePrivacyOptionSelect = (option) => {
    if (!loading) {
      updateAccountPrivacy(option);
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onBackButtonPress={toggleBottomSheet}
      onBackdropPress={toggleBottomSheet}
    >
      <View style={styles.bottomSheet}>
        <Text style={styles.bottomSheetTitle}>Account Privacy Settings</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePrivacyOptionSelect("All")}
        >
          <Text style={styles.buttonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePrivacyOptionSelect("Public")}
        >
          <Text style={styles.buttonText}>Public</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePrivacyOptionSelect("Friends")}
        >
          <Text style={styles.buttonText}>Friends</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export default AccountPrivacyBottomSheet;

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBoldItalic",
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    padding: 8,
    borderBottomWidth: 0.5,
    borderColor: "#333",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
  },
});
