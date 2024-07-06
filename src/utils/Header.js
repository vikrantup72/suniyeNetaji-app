import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {RfH, RfW} from './helper';
import {useNavigation} from '@react-navigation/native';
import {colors} from '.';
import {useDispatch, useSelector} from 'react-redux';
import {RequestCount} from '../redux/SocialReducer';

const Header = ({HeaderTxt, onPress, ProfileImage}) => {
  const dispatch = useDispatch();
  const {requestcountData, loading, error} = useSelector(state => state.social);

  useEffect(() => {
    dispatch(RequestCount());
  }, []);

  console.log(requestcountData, 'requestcountData');

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}
        style={styles.leftItem}>
        <Icon name="left" size={20} color={colors.black} />
      </TouchableOpacity>
      <Text style={styles.title}>{HeaderTxt}</Text>
      <View style={styles.profileContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
          <Image source={ProfileImage} style={styles.profileImage} />
          {ProfileImage && requestcountData?.total_pending_request > 0 ? (
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>
                {requestcountData?.total_pending_request}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: RfW(15),
    paddingVertical: RfH(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY,
  },
  leftItem: {
    padding: RfH(5),
  },
  title: {
    fontSize: 20,
    top: RfH(3),
    fontWeight: '500',
    color: colors.black,
    fontFamily: 'Poppins-Medium',
  },
  profileContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    height: RfH(20),
    width: RfW(20),
    alignSelf: 'center',
  },
  counterContainer: {
    position: 'absolute',
    left: 10,
    top: -8,
    backgroundColor: 'red',
    paddingHorizontal: 4,
    borderRadius: 10,
    paddingVertical: 2,
  },
  counterText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
  },
});
