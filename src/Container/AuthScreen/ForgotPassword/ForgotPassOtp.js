import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {styles} from './styles';
import Header from '../../../utils/Header';
import {colors} from '../../../utils';

const ForgotPassOtp = ({navigation, route}) => {
  const {username} = route.params;
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleOtpChange = (index, value) => {
    if (isNaN(Number(value))) {
      return;
    }
    const otpCopy = [...otp];
    otpCopy[index] = value;
    setOTP(otpCopy);

    if (index < 5 && value) {
      otpInputRefs[index + 1].current.focus();
    }
  };

  const verifyotp = async () => {
    setLoading(true);
    try {
      const enteredOtp = otp.join('');
      if (!enteredOtp) {
        ToastAndroid.show('OTP is empty!', ToastAndroid.BOTTOM);
      } else {
        const body = JSON.stringify({
          otp: enteredOtp,
          username: username,
          type: 'forgot',
        });

        const response = await fetch(
          'https://stage.suniyenetajee.com/api/v1/account/verify-opt/',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: body,
          },
        );
        const data = await response.json();
        console.log(data, 'responsedata');
        if (response.ok) {
          console.log('API response: ', data);
          navigation.navigate('ChangePassword', {username: username});
          ToastAndroid.show(data.message, ToastAndroid.BOTTOM);
        } else {
          console.log('API error response: ', data);
          ToastAndroid.show(data.message, ToastAndroid.BOTTOM);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Header HeaderTxt={'OTP Verification'} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imgcontainer}>
          <Image
            source={require('../../../assets/images/splash.png')}
            style={styles.imgsty}
          />
        </View>
        <View style={styles.txtcontainer}>
          <Text style={styles.txt1}>OTP Verification</Text>
          <View style={styles.txtcon}>
            <Text style={styles.txt2}>Enter 6 digit number that was sent</Text>
          </View>
        </View>
        <View style={styles.otpfieldtcon}>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.input}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={text => handleOtpChange(index, text)}
                ref={otpInputRefs[index]}
              />
            ))}
          </View>
          <TouchableOpacity
            onPress={verifyotp}
            activeOpacity={0.8}
            style={styles.btnsty}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.WHITE} />
            ) : (
              <Text style={styles.btntxtsty}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassOtp;
