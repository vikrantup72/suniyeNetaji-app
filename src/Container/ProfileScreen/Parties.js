import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { BottomSheet } from "react-native-btr";
import { RfH, RfW } from "../../utils/helper";
import { colors } from "../../utils";

const Parties = ({ visible, onClose, onSelect, partyData }) => {
  return (
    <BottomSheet visible={visible} onBackdropPress={onClose}>
      <View style={styles.sheetContainer}>
        <Text style={styles.header}>Select Party</Text>
        <FlatList
          data={partyData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.partyItem}
              onPress={() => {
                onSelect(item.id);
                onClose();
              }}
            >
              {item.id !== -1 && (
                <Image
                  source={{ uri: `https://stage.suniyenetajee.com${item.symbol}`}}
                  style={styles.partyImage}
                />
              )}
              <Text
                style={item.id !== -1 ? styles.partyName : styles.nopartysty}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: RfH(20),
    borderTopRightRadius: RfH(20),
    maxHeight: "50%",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: RfH(20),
  },
  partyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY,
  },
  partyName: {
    fontSize: 16,
    left: RfW(25),
  },
  partyImage: {
    height: RfH(30),
    width: RfW(30),
    left: RfW(15),
  },
  nopartysty: {
    fontSize: 16,
    left: RfW(55),
  },
});

export default Parties;