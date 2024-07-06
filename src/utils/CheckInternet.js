import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {RfH, RfW} from './helper';
import {colors} from '.';

const CheckInternet = ({isconnected, setIsconnected}) => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      setIsconnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <View style={{}}>
      {!isconnected && (
        <View style={{top:RfH(300)}}>
          <Image
            source={require('../assets/images/nonet.png')}
            style={{
              height: RfH(100),
              width: RfW(86),
              borderRadius: 100,
              alignSelf: 'center',
              tintColor: '#7966FF',
            }}
          />
          <Text
            style={{
              alignSelf: 'center',
              color: '#000',
              fontFamily: 'Poppins-SemiBoldItalic',
              fontSize: 16,
            }}>
            Please check your connection and{' '}
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              color: '#000',
              fontFamily: 'Poppins-SemiBoldItalic',
              fontSize: 16,
            }}>
            try again later{' '}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CheckInternet;

const styles = StyleSheet.create({});
