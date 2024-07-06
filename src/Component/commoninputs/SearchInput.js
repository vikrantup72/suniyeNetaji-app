import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {RfH, RfW} from '../../utils/helper';
import {colors} from '../../utils';
import Icon from 'react-native-vector-icons/AntDesign';

const SearchInput = ({placeholder}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputcon}>
        <View style={styles.inputcontaint}>
          <View style={{justifyContent: 'center'}}>
            <Icon name="search1" size={18} color={colors.DARK_GRAY} />
          </View>
          <View style={{top: RfH(2), left: RfW(2), width: '100%'}}>
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={colors.DARK_GRAY}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {},
  inputcon: {
    borderWidth: 1,
    borderRadius: RfH(8),
    height: RfH(40),
    borderColor: colors.GRAY,
    elevation: -3,
    paddingHorizontal: RfW(5),
    marginVertical: RfH(15),
    width: RfW(337),
    alignSelf:'center'
  },
  inputcontaint: {
    flexDirection: 'row',
    paddingHorizontal: RfW(10),
  },
});
