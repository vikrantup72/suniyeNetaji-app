import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import Header from '../../../utils/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../../utils';
import {RfH, RfW} from '../../../utils/helper';
import {ChangePasswords} from '../../../redux/ChangePasswordSlice';
import {useDispatch} from 'react-redux';

const ChangePassword = ({navigation, route}) => {
  const {username} = route.params;
  console.log(username, 'iugjkn');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirm_password] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(
        ChangePasswords({password, confirm_password, username: username}),
      );
      if (response.payload) {
        navigation.navigate('Registration');
      }
    } catch (error) {
      console.error('Error resetting password:', error.message);
      alert('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Header HeaderTxt={'Change Password'} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imgcontainer}>
          <Image
            source={require('../../../assets/images/splash.png')}
            style={styles.imgsty}
          />
        </View>
        <View style={{paddingHorizontal: RfW(20), marginTop: RfH(25)}}>
          <View>
            <Text style={styles.placeholderheader}>Password</Text>
          </View>
          <View style={styles.inputfildstys}>
            <TextInput
              placeholder="Enter Password"
              placeholderTextColor={'gray'}
              value={password}
              onChangeText={txt => setPassword(txt)}
              backgroundColor={'#ccc'}
              style={{
                backgroundColor: colors.LIGHT_GRAY,
                color: '#000',
                fontSize: 14,
                width: '85%',
              }}
              secureTextEntry={!passwordVisible}
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
          <View>
            <Text style={[styles.placeholderheader, {marginTop: 10}]}>
              Confirm Password
            </Text>
          </View>
          <View style={styles.inputfildstys}>
            <TextInput
              placeholder="Enter New Password"
              placeholderTextColor={'gray'}
              value={confirm_password}
              onChangeText={txt => setConfirm_password(txt)}
              backgroundColor={'#ccc'}
              style={{
                backgroundColor: colors.LIGHT_GRAY,
                color: '#000',
                fontSize: 14,
                width: '85%',
              }}
              secureTextEntry={!passwordVisible2}
            />
            <TouchableOpacity
              style={{padding: 10}}
              onPress={() => setPasswordVisible2(!passwordVisible2)}>
              {passwordVisible2 ? (
                <Icon name="eye-outline" size={20} color="#242424" />
              ) : (
                <Icon name="eye-off-outline" size={20} color="#242424" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleResetPassword}
          style={[styles.btnsty, {bottom: RfH(10)}]}
          activeOpacity={0.8}>
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={colors.WHITE} />
            </View>
          ) : (
            <Text style={styles.btntxtsty}>Create Password</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
