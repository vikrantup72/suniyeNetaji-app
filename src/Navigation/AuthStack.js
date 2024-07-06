import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../Container/AuthScreen/Intro/SplashScreen';
import Registration from '../Container/AuthScreen/RegisterScreen';
import SignupScreen from '../Container/AuthScreen/SignUpScreen';
import OTPScreen from '../Container/AuthScreen/OtpScreen';
import ForgotPassword from '../Container/AuthScreen/ForgotPassword';
import ForgotPassOtp from '../Container/AuthScreen/ForgotPassword/ForgotPassOtp';
import ChangePassword from '../Container/AuthScreen/ForgotPassword/ChangePassword';
import BottomTabStack from './BottomTabStack';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} options>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ForgotPassOtp" component={ForgotPassOtp} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="OtpScreen" component={OTPScreen} />
      <Stack.Screen name="BottomTabStack" component={BottomTabStack} />
    </Stack.Navigator>
  );
}

export default AuthStack;
