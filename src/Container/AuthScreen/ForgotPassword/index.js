import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../utils/Header';
import {styles} from './styles';
import {RfH, RfW} from '../../../utils/helper';
import {ResetPassword} from '../../../redux/ChangePasswordSlice';
import {colors} from '../../../utils';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(ResetPassword({username, navigation}));
      if (response.payload) {
        navigation.navigate('ForgotPassOtp', {username: username});
      }
    } catch (error) {
      console.error('Error resetting password:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Header HeaderTxt={'Forgot Password'} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imgcontainer}>
          <Image
            source={require('../../../assets/images/splash.png')}
            style={styles.imgsty}
          />
        </View>

        <View style={{marginLeft: RfW(20)}}>
          <View style={styles.txtcontainer}>
            <Text style={styles.txt1}>Reset Password</Text>
            <View style={styles.txtcon}>
              <Text style={styles.txt2}>Enter email that sent to otp</Text>
            </View>
          </View>
          <View
            style={[styles.inputfildsty, {marginTop: RfH(30), left: RfW(3)}]}>
            <TextInput
              placeholder="Enter Email"
              placeholderTextColor={'gray'}
              value={username}
              onChangeText={txt => setUsername(txt)}
              style={{
                backgroundColor: colors.LIGHT_GRAY,
                color: '#000',
                fontSize: 14,
                width: '100%',
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleResetPassword}
          style={[styles.btnsty, {bottom: RfH(10), left: RfW(3)}]}
          activeOpacity={0.8}>
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={colors.WHITE} />
            </View>
          ) : (
            <Text style={styles.btntxtsty}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
