import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import Header from '../../../utils/Header';
import {styles} from './styles';
import ApiUrls from '../../../API/ApiUrls';
import {put} from '../../../API/api';

const OTPScreen = ({navigation, route}) => {
  const {email} = route.params;
  const [loading, setLoading] = useState(false);
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
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

  const handleBackspace = (index, value) => {
    if (value === '') {
      if (index > 0) {
        otpInputRefs[index - 1].current.focus();
      }
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
          username: email,
          type: 'register',
        });

        const {data, status} = await put(ApiUrls.verify_otp, body);

        console.log(data, 'responsedata');
        if (status) {
          console.log('API response: ', data);
          navigation.navigate('Registration');
          ToastAndroid.show(data.message, ToastAndroid.BOTTOM);
        } else {
          console.log('API error response: ', data);
          ToastAndroid.show(data.message, ToastAndroid.BOTTOM);
        }
      }
    } catch (error) {
      ToastAndroid.show('Plz check OTP or network issue', ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header HeaderTxt={'OTP'} />
      <View style={styles.otpcon}>
        <View>
          <Image
            source={require('../../../assets/images/splash.png')}
            style={styles.imgsty}
          />
          <View style={styles.txtcontainer}>
            <Text style={styles.txt1}>Verification</Text>
            <View style={styles.txtcon}>
              <Text style={styles.txt2}>
                Enter 6 digit number that sent to{' '}
              </Text>
              <Text style={styles.txt2}>{email}</Text>
            </View>
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
                onKeyPress={({nativeEvent}) =>
                  nativeEvent.key === 'Backspace'
                    ? handleBackspace(index, digit)
                    : null
                }
                ref={otpInputRefs[index]}
              />
            ))}
          </View>
        </View>
        <TouchableOpacity
          onPress={verifyotp}
          activeOpacity={0.8}
          style={styles.btnsty}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.btntxtsty}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;
