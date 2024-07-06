import React from 'react';
import {StyleSheet, View,Text} from 'react-native';
import { RfH, RfW } from '../../utils/helper';

const IntroText = ({text, subText, hedtext}) => {
  return (
    <View style={styles.introTextContainer}>
      <Text style={styles.headTextStyle}>{hedtext}</Text>
      <Text style={styles.textStyle}>{text}</Text>
      <Text style={styles.subTextStyle}>{subText}</Text>
    </View>
  );
};

export default IntroText;

const styles = StyleSheet.create({
  headTextStyle: {
    color: 'blue',
    fontSize: 16,
    lineHeight: 24,
    // fontWeight: '600',
    marginHorizontal: RfW(2),
    fontFamily:'Poppins-Medium',

  },
  textStyle: {
    color:'#444444',
    fontSize: 27,
    lineHeight: 40.5,
    // fontWeight: '700',
    marginTop: RfH(15),
    fontFamily:'Poppins-Medium',
  },
  introTextContainer: {
    marginHorizontal: RfW(25),
  },
  subTextStyle: {
    fontSize: 17,
    // fontWeight: '400',
    lineHeight: 27,
    color: '#C3C7CE',
    fontFamily:'Poppins-Medium',

    marginTop: RfH(13),
  },
});
