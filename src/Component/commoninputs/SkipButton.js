import React from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { RfH, RfW } from '../../utils/helper';

const SkipButton = ({ skipText, onPress }) => {
  return (
    <Pressable style={{}} onPress={onPress}>
      <Text style={styles.skipsty}>{skipText}</Text>
    </Pressable>
  );
};

export default SkipButton;

const styles = StyleSheet.create({
  skipsty: {
    alignSelf: 'flex-end',
    fontSize: 16,
    fontWeight: '300',
    marginBottom: RfH(35),
    marginRight: RfW(28),
    marginTop: RfW(15),
    borderWidth: RfH(1),
    borderColor:'blue',
    borderRadius: RfW(10),
    height: RfH(37),
    width: RfW(76),
    textAlign: 'center',
    paddingVertical: RfH(6),
    color:'blue'
  }
});
