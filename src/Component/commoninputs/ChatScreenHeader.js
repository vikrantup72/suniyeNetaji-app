import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {colors} from '../../utils/index';
import {RfH, RfW} from '../../utils/helper';
import {useNavigation} from '@react-navigation/native';

const ChatScreenHeader = ({HeaderTxt, onPress, ProfileImage, Activetime}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.leftItem}>
        <Icon name="left" size={20} color={colors.black} />
      </TouchableOpacity>
      <View style={{paddingHorizontal: RfW(5)}}>
        <Image
          source={ProfileImage}
          style={{height: RfH(40), width: RfW(40), borderRadius: RfH(20)}}
        />
      </View>
      <View>
        <Text style={styles.title}>{HeaderTxt}</Text>
        <Text style={styles.title2}>{Activetime}</Text>
      </View>
    </View>
  );
};

export default ChatScreenHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: RfW(15),
    paddingVertical: RfH(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY,
  },
  leftItem: {
    padding: RfH(5),
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
    fontFamily: 'Poppins-Regular',
    paddingLeft: 10,
    top: RfH(3),
  },
  title2: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.DARK_GRAY,
    fontFamily: 'Poppins-Regular',
    paddingLeft: 10,
  },
  // rightItem: {
  //   borderWidth: 1,
  //   height: RfH(25),
  //   width: RfW(25),
  //   borderRadius: RfH(13),
  //   justifyContent: 'center',
  //   margin:RfH(5)
  //   // width: 40, // Adjust as needed
  // },
});
