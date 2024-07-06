import React, {useState} from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Button} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChatScreen from '../Container/ChatScreen';
import HomeScreen from '../Container/HomeScreen/Home';
import MenuScreen from '../Container/Menu';
import SearchScreen from '../Container/SearchScreen';
import {colors} from '../utils';
import {RfH, RfW} from '../utils/helper';
import PostScreen from '../Container/PostScreen';
import ReelComponent from '../Component/ReelComponent';

const Tab = createBottomTabNavigator();
const CustomTabBarButton = ({children, onPress}) => {
  return (
    <TouchableOpacity
      style={{
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadow,
      }}
      onPress={onPress}>
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: colors.skyblue,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {children}
      </View>
    </TouchableOpacity>
  );
};
function BottomTabStack({navigation}) {
  const navigatePost = () => {
    navigation.navigate('PostScreen');
  };

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={({route, navigation}) => ({
          tabBarIcon: ({focused}) => {
            let iconSource;
            let iconStyle = {
              width: RfW(24),
              height: RfH(25),
              marginTop: RfH(12),
            };

            if (route.name === 'Home') {
              iconSource = focused
                ? require('../assets/images/selectedhome.png')
                : require('../assets/images/home.png');
            } else if (route.name === 'SearchScreen') {
              iconSource = focused
                ? require('../assets/images/pollselected.png')
                : require('../assets/images/polloutline.png');
              iconStyle = {
                ...iconStyle,
                width: RfW(21),
                height: RfH(22),
                resizemode: 'cover',
              };
            } else if (route.name === 'ChatScreen') {
              iconSource = focused
                ? require('../assets/images/selectedchat.png')
                : require('../assets/images/chat.png');
              iconStyle = {
                ...iconStyle,
              };
            } else if (route.name === 'PostScreen') {
              iconSource = focused
                ? require('../assets/images/postimg.png')
                : require('../assets/images/plush.png');
            } else if (route.name === 'MenuScreen') {
              iconSource = focused
                ? require('../assets/images/selectedimg.png')
                : require('../assets/images/menu.png');
            } else if (route.name === 'BottomSheetTab') {
              return null;
            }

            return <Image source={iconSource} style={iconStyle} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: colors.blue,
          inactiveTintColor: colors.black,
          animationDirection: 'horizontal',
          transitionSpec: {
            open: {animation: 'timing', config: {duration: 500}},
            close: {animation: 'timing', config: {duration: 500}},
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: '',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{
            tabBarLabel: '',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="PostScreen"
          component={PostScreen}
          options={{
            tabBarLabel: '',
            headerShown: false,
            tabBarButton: props => (
              <CustomTabBarButton {...props} onPress={navigatePost}>
                <Image
                  source={require('../assets/images/plush.png')}
                  style={{
                    width: RfW(28),
                    height: RfH(29),
                    tintColor: '#fff',
                  }}
                />
              </CustomTabBarButton>
            ),
          }}
        />
        <Tab.Screen
          name="ChatScreen"
          component={ReelComponent}
          options={{
            tabBarLabel: '',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="MenuScreen"
          component={MenuScreen}
          options={{
            tabBarLabel: '',
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default BottomTabStack;

const styles = StyleSheet.create({
  bottomsheetcontainer: {
    height: RfH(200),
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  headersty: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.black,
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
    marginTop: RfH(10),
  },
  bordersty: {
    borderBottomWidth: 1,
    borderColor: colors.DARK_GRAY,
    marginVertical: RfH(10),
    opacity: 0.2,
  },
});
