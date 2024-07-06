import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../utils';
import {RfH, RfW, getKey} from '../../utils/helper';
import Header from '../../utils/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {toggleAcceptStatus, toggleDeclineStatus} from '../../redux/FollowSlice';
import {useNavigation} from '@react-navigation/native';

const Notification = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState([]);

  const FollowRequest = async () => {
    setLoading(true);
    try {
      const token = await getKey('AuthKey');
      const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      };
      const response = await fetch(
        'https://apis.suniyenetajee.com/api/v1/account/follow-unfollow/?type=pending_request',
        requestOptions,
      );
      if (response.ok) {
        const responseData = await response.json();
        setDatas(responseData.results[0].pending_request);
      } else {
        console.error('Error response:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FollowRequest();
  }, []);

  // const handleDeclineTogg= async id => {
  //   try {
  //     await dispatch(toggleDeclineStatus({id})).unwrap();
  //     setDatas(prevDatas => prevDatas.filter(data => data.id !== id));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleDeclineToggle = async (id) => {
    console.log('Attempting to remove follower with ID:', id);
    const url = 'https://apis.suniyenetajee.com/api/v1/account/follow-unfollow/';
    console.log('URL:', url);
    try {
      const token = await getKey('AuthKey');
      const formData = new FormData();
      formData.append('id', id);
      formData.append('type', 'decline');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Token ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        setDatas((prevDatas) => prevDatas.filter((data) => data.id !== id));
        ToastAndroid.show(result?.Message, ToastAndroid.BOTTOM);
        console.log('Follower declined successfully');
      } else {
        const responseBody = await response.text();
        console.error(
          'Error response:',
          response.status,
          response.statusText,
          responseBody
        );
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  

  const handleAcceptToggle = async id => {
    try {
      await dispatch(toggleAcceptStatus({id})).unwrap();
      setDatas(prevDatas => prevDatas.filter(data => data.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  const renderNoRepliesMessage = () => {
    if (datas.length === 0) {
      return (
        <View style={styles.nodata}>
          <Text style={styles.txtsty}>
            You have no pending requests at the moment.
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          paddingTop: RfH(15),
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.leftItem}>
          <AntDesign name="left" size={20} color={colors.black} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Notification</Text>
        </View>
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={colors.skyblue} />
        </View>
      ) : (
        <View>
          <View style={styles.container1}>
            <FlatList
              data={datas}
              keyExtractor={item => item.id.toString()}
              ListEmptyComponent={renderNoRepliesMessage}
              renderItem={({item}) => {
                return (
                  <View style={styles.flatlistcontainer}>
                    <View
                      style={{justifyContent: 'center', flexDirection: 'row'}}>
                      <View style={styles.imgcontainer}>
                        {item?.picture ? (
                          <Image
                            source={{
                              uri: `https://apis.suniyenetajee.com${item?.picture}`,
                            }}
                            style={{
                              height: RfH(34),
                              width: RfW(34),
                              borderRadius: RfH(16),
                              alignSelf: 'center',
                              resizeMode: 'cover',
                            }}
                          />
                        ) : (
                          <Image
                            source={require('../../assets/images/dummyplaceholder.png')}
                            style={{
                              height: RfH(30),
                              width: RfW(30),
                              borderRadius: RfH(16),
                              alignSelf: 'center',
                              resizeMode: 'cover',
                            }}
                          />
                        )}
                      </View>
                      <View style={styles.msgcontainer}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.namesty}>
                            {item?.full_name?.length > 16
                              ? `${item.full_name.slice(0, 16)}...`
                              : item?.full_name}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.msgsty}>
                            started following you
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={[styles.checkbtnsty, {right: RfW(15)}]}
                        onPress={() => handleAcceptToggle(item.id)}>
                        <AntDesign
                          name={'check'}
                          size={15}
                          color={colors.skyblue}
                          style={{alignSelf: 'center'}}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.checkbtnsty}
                        onPress={() => handleDeclineToggle(item.id)}>
                        <AntDesign
                          name={'close'}
                          size={15}
                          color={colors.skyblue}
                          style={{alignSelf: 'center'}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              ItemSeparatorComponent={renderSeparator}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container1: {
    paddingHorizontal: RfW(20),
    marginTop: RfH(15),
  },
  leftItem: {
    padding: RfH(5),
  },
  nodata: {
    alignSelf: 'center',
    marginTop: '90%',
  },
  separator: {
    height: 1,
    width: '97%',
    backgroundColor: colors.primary_black,
    opacity: 0.1,
  },
  title: {
    fontSize: 20,
    top: RfH(3),
    fontWeight: '500',
    color: colors.black,
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
    position: 'absolute',
    left: RfW(90),
  },
  flatlistcontainer: {
    flexDirection: 'row',
    marginVertical: RfH(15),
    width: '100%',
    justifyContent: 'space-between',
  },
  txtsty: {
    color: colors.black,
    fontFamily: 'Poppins-Regular',
  },
  msgcontainer: {
    paddingHorizontal: RfW(10),
    justifyContent: 'center',
    bottom: RfH(5),
  },
  imgcontainer: {
    backgroundColor: colors.GRAY,
    height: RfH(32),
    width: RfW(32),
    borderRadius: RfH(16),
    justifyContent: 'center',
  },
  namesty: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22.5,
    color: colors.primary_blue,
    fontFamily: 'Poppins-Regular',
  },
  msgsty: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22.5,
    color: colors.black,
    fontFamily: 'Poppins-Regular',
  },
  checkbtnsty: {
    borderWidth: 1,
    height: RfH(35),
    width: RfW(35),
    borderRadius: RfH(20),
    justifyContent: 'center',
    borderColor: colors.skyblue,
  },
});
