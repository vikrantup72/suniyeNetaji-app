import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../../../utils';
import {RfH, getKey} from '../../../utils/helper';

const AdvertisementScreen = WrappedComponent => {
  return props => {
    const [timeLeft, setTimeLeft] = useState(5);
    const [showAd, setShowAd] = useState(false);
    const [adData, setAdData] = useState(null);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const BASE_URL = 'https://stage.suniyenetajee.com';
    const AD_INTERVAL = 3600000; // 1 hour in milliseconds

    useEffect(() => {
      const fetchAdvertisement = async () => {
        try {
          const token = await getKey('AuthKey');
          const response = await fetch(
            `${BASE_URL}/api/v1/master/image-advertisement`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
              },
            },
          );
          const result = await response.json();
          console.log(result, 'result');
          setAdData(result);
        } catch (error) {
          console.error('Failed to fetch advertisement:', error);
        }
      };

      fetchAdvertisement();
    }, []);

    useEffect(() => {
      const checkAdDisplayTime = async () => {
        try {
          const lastShown = await AsyncStorage.getItem('lastAdShown');
          const now = new Date().getTime();

          if (!lastShown || now - parseInt(lastShown) > AD_INTERVAL) {
            setShowAd(true);
            console.log('Showing Ad');
            await AsyncStorage.setItem('lastAdShown', now.toString());
          } else {
            setShowAd(false);
            console.log('Ad Not Required');
          }
        } catch (error) {
          console.error('Failed to get last ad shown time:', error);
        }
      };

      if (isFocused) {
        checkAdDisplayTime();
      }
    }, [isFocused]);

    useEffect(() => {
      if (showAd && timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
      }

      if (timeLeft <= 0) {
        setShowAd(false);
        setTimeLeft(5);
      }
    }, [showAd, timeLeft]);

    if (showAd && timeLeft > 0) {
      return (
        <View style={styles.container}>
          {adData && adData.image ? (
            <Image
              source={{uri: `${BASE_URL}${adData.image}`}}
              style={styles.backgroundImage}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../../assets/images/add.webp')}
              style={styles.backgroundImage}
              resizeMode="contain"
            />
          )}
          <View style={styles.content}>
            <View style={styles.btn}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.text}>Skip Ad </Text>
                <Text style={styles.text}>: {timeLeft}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHT_BLACK,
  },
  backgroundImage: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#454545',
  },
  content: {
    flex: 1,
    top: RfH(15),
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.black,
  },
  btn: {
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 20,
    right: 15,
    backgroundColor: colors.WHITE,
  },
});

export default AdvertisementScreen;
