import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RfH, RfW} from '../utils/helper';
import {colors} from '../utils';

const CustomBottomTabBar = ({state, descriptors, navigation}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;
        const iconName =
          route.name === 'Home'
            ? isFocused
              ? require('../assets/images/selectedhome.png')
              : require('../assets/images/home.png')
            : route.name === 'SearchScreen'
            ? isFocused
              ? require('../assets/images/pollselected.png')
              : require('../assets/images/polloutline.png')
            : route.name === 'ChatScreen'
            ? isFocused
              ? require('../assets/images/selectedchat.png')
              : require('../assets/images/chat.png')
            : route.name === 'MenuScreen'
            ? isFocused
              ? require('../assets/images/selectedimg.png')
              : require('../assets/images/menu.png')
            : require('../assets/images/plush.png');

        const iconStyle =
          route.name === 'SearchScreen'
            ? {
                width: RfW(21),
                height: RfH(22),
                resizeMode: 'cover',
                marginRight: 40,
              }
            : route.name === 'ChatScreen'
            ? {width: RfW(24), height: RfH(25), marginLeft: 40}
            : {width: RfW(24), height: RfH(25), marginTop: RfH(12)};

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            activeOpacity={0.8}
            key={index}
            onPress={onPress}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}>
            <Image source={iconName} style={iconStyle} />
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.postButton}
        onPress={() => setBottomSheetVisible(true)}>
        <Image
          source={require('../assets/images/plush.png')}
          style={styles.postIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CustomBottomTabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButton: {
    width: RfW(60),
    height: RfH(60),
    borderRadius: RfH(30),
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 10,
  },
  postIcon: {
    width: RfW(24),
    height: RfH(24),
    tintColor: '#fff',
  },
});
