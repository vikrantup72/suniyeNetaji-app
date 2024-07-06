import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../../utils';
import {styles} from './styles';
import {useTranslation} from 'react-i18next';
import {AsyncStorageKey, RfH, RfW} from '../../../utils/helper';
import ApiUrls from '../../../API/ApiUrls';
import {post} from '../../../API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {setToken} from '../../../redux/ProfileSlice';
// import CheckInternet from '../../../utils/CheckInternet';

const Registration = ({ProfileImage}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isconnected, setIsconnected] = useState(false);

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const signupMethod = async values => {
    setLoading(true);
    try {
      const body = JSON.stringify(values);
      const {data, status} = await post(ApiUrls.login_account, body);
      console.log('API Response:', {data, status});
      if (typeof data === 'object' && data.hasOwnProperty('key')) {
        console.log('Auth API response:', data.key);
        console.log('Auth API response:', data.basic.user_id);
        await AsyncStorage.setItem(AsyncStorageKey.AuthKey, data.key);
        await AsyncStorage.setItem(
          AsyncStorageKey.UserId,
          data.basic.user_id.toString(),
        );
        dispatch(setToken(true));
      } else {
        console.log('Token not found in API response');
      }
    } catch (error) {
      console.log('Error:', error);
      ToastAndroid.show(
        'No user registered with these credentials. Please check your username or password.',
        ToastAndroid.BOTTOM,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.WHITE}}>
        {/* {isconnected == true ? (
          <> */}
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SplashScreen')}
            style={styles.leftItem}>
            <AntDesign name="left" size={20} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Login</Text>
          <TouchableOpacity style={styles.rightItem}>
            <Image
              source={ProfileImage}
              style={{
                height: RfH(20),
                width: RfW(20),
                right: RfW(5),
                bottom: RfH(2),
              }}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.imgcontainer}>
            <Image
              source={require('../../../assets/images/splash.png')}
              style={styles.imgsty}
            />
          </View>
          <View style={styles.txtcontainer}>
            <Text style={styles.txt1}>{t('Welcome Back')}</Text>
            <View style={styles.txtcon}></View>
          </View>
          <Formik
            initialValues={{username: '', password: ''}}
            validationSchema={SignupSchema}
            onSubmit={signupMethod}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={{marginLeft: RfW(20), marginTop: RfH(15)}}>
                <View>
                  <Text style={styles.placeholderheader}>Phone Number</Text>
                </View>
                <View style={styles.inputfildsty}>
                  <TextInput
                    placeholder="Enter Phone Number"
                    placeholderTextColor={'gray'}
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    maxLength={10}
                    keyboardType="number-pad"
                    style={{
                      backgroundColor: colors.LIGHT_GRAY,
                      color: '#000',
                      fontSize: 14,
                      width: '100%',
                    }}
                  />
                </View>
                {errors.username && touched.username ? (
                  <Text style={styles.errorText}>{errors.username}</Text>
                ) : null}
                <View>
                  <Text style={styles.placeholderheader}>Password</Text>
                </View>
                <View style={styles.inputfildsty}>
                  <TextInput
                    placeholder="Enter Password"
                    placeholderTextColor={'gray'}
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry={!passwordVisible}
                    style={{
                      backgroundColor: colors.LIGHT_GRAY,
                      color: '#000',
                      fontSize: 14,
                      width: '85%',
                    }}
                  />
                  <TouchableOpacity
                    style={{padding: 10}}
                    onPress={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? (
                      <Icon name="eye-outline" size={20} color="#242424" />
                    ) : (
                      <Icon name="eye-off-outline" size={20} color="#242424" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && touched.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('ForgotPassword')}
                  style={{flexDirection: 'row'}}>
                  <Text style={styles.forgottxt}>Forgot Password ?</Text>
                  <Text style={styles.resettxt}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.btnsty}
                  activeOpacity={0.8}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.btntxtsty}>Login</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.msgtxtsty}>
                  <View>
                    <Text style={styles.msgsty}>Don't have an account</Text>
                  </View>
                  <TouchableOpacity
                    opacity={0.8}
                    onPress={() => navigation.navigate('SignupScreen')}>
                    <Text style={styles.msgsty2}> ? Registration</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
        {/* </View>
          </>
        ) : null}
        <CheckInternet
          isconnected={isconnected}
          setIsconnected={setIsconnected}
        /> */}
      </SafeAreaView>
    </>
  );
};

export default Registration;
