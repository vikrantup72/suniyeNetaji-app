import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {RfH, RfW} from '../../utils/helper';

const PhoneNumInput = ({label, inputValue, isValid, isTouched, onFocus}) => {
  const handleOnChangeText = text => {
    const truncatedText = text.replace(/\D/g, '').slice(0, 10);
    inputValue(truncatedText);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.labelStyle}>{label}</Text>}
      <View style={styles.phoneInputWrapper}>
        <PhoneInput
          defaultCode="IN"
          layout="first"
          onChangeText={handleOnChangeText}
          onFocus={onFocus}
          placeholder="Phone number"
          textContainerStyle={{
            backgroundColor: 'transparent',
            paddingVertical: RfH(0),
            right: RfW(20),
          }}
          codeTextStyle={{color: '#000'}}
          textInputStyle={{color: '#000'}}
        />
      </View>
      {isTouched &&
        !isValid && ( // Check if isTouched exists before accessing it
          <Text style={styles.errorText}>Invalid phone number</Text>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: RfH(20),
  },
  labelStyle: {
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 16.5,
    color: '#000000',
  },
  phoneInputWrapper: {
    borderBottomColor: '#000',
    borderBottomWidth: RfH(1),
    backgroundColor: 'transparent',
    height: RfH(45),
  },
  errorText: {
    marginTop: RfH(5),
    color: 'red',
  },
});

export default PhoneNumInput;
