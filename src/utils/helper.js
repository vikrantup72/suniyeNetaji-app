import AsyncStorage from '@react-native-async-storage/async-storage';
import {isNumber} from 'lodash';
import {Dimensions, PixelRatio} from 'react-native';

const dim = Dimensions.get('window');

export const SCREEN_HEIGHT = dim.height;
export const SCREEN_WIDTH = dim.width;
console.log('SCREEN_WIDTH:: ', SCREEN_WIDTH);
console.log('SCREEN_HEIGHT:: ', SCREEN_HEIGHT);

const STANDARD_SCREEN_DIMENSIONS = {height: 812, width: 375};

export const RfW = value => {
  return SCREEN_WIDTH * (value / STANDARD_SCREEN_DIMENSIONS.width);
};

export const RfH = value => {
  return SCREEN_HEIGHT * (value / STANDARD_SCREEN_DIMENSIONS.height);
};

export const getToken = () => {
  return null;
};

export const getImageSource = imagePath =>
  isNumber(imagePath) ? imagePath : {uri: imagePath};

const {width, height} = Dimensions.get('window');

export const wp = number => {
  let givenWidth = typeof number === 'number' ? number : parseFloat(number);
  return PixelRatio.roundToNearestPixel((width * givenWidth) / 100);
};

export const hp = number => {
  let givenHeight = typeof number === 'number' ? number : parseFloat(number);
  return PixelRatio.roundToNearestPixel((height * givenHeight) / 100);
};

export const getKey = async key => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data !== null) {
      return data;
    } else {
      console.log('Key not found in AsyncStorage');
      return;
    }
  } catch (error) {
    console.log('Error retrieving key from AsyncStorage:', error.message);
    return null;
  }
};
export const getUserId = async (flag) => {
  try {
    const userId = await AsyncStorage.getItem('UserId');
    if (userId) {
      console.log('UserIdjbjhbjhvjh:', userId, flag);
      return userId;
    } else {
      console.log('UserId not found in AsyncStorage');
      return;
    }
  } catch (error) {
    console.log('Error retrieving UserId from AsyncStorage:', error);
    return null;
  }
};

export const AsyncStorageKey = {
  AuthKey:'AuthKey',
  UserId:'UserId'

}

getUserId();
