import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Pressable,
  Modal,
} from 'react-native';
import {colors} from '../../utils';
import {AsyncStorageKey, RfH, RfW, getKey} from '../../utils/helper';
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {DeleteAccount, setToken} from '../../redux/ProfileSlice';
import ImageViewing from 'react-native-image-viewing';

const menuItems = [
  {id: 1, icon: require('../../assets/images/edit.png'), label: 'Edit'},
  {id: 2, icon: require('../../assets/images/support.png'), label: 'Support'},
  {id: 3, icon: require('../../assets/images/offer.png'), label: 'Draft'},
  {
    id: 5,
    icon: require('../../assets/images/friend.png'),
    label: 'Find Friends',
  },
  {
    id: 4,
    icon: require('../../assets/images/delete.png'),
    label: 'Delete Account',
  },

  {id: 6, icon: require('../../assets/images/logimages.png'), label: 'Log-Out'},
];

const Menu = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

  const dispatch = useDispatch();

  const logoutAndClearAsyncStorage = async () => {
    try {
      await Promise.all(
        [AsyncStorageKey].map(async element => {
          const key = Object.keys(element);
          await Promise.all(
            key.map(async item => {
              await AsyncStorage.removeItem(item);
            }),
          );
        }),
      );
      dispatch(setToken(false));
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('BottomTabStack');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    fetchProfileDatas();
  }, []);

  const handleNavigate = label => {
    switch (label) {
      case 'Edit':
        navigation.navigate('EditProfileScreen');
        break;
      case 'Support':
        navigation.navigate('Support');
        break;
      case 'Draft':
        navigation.navigate('Draft');
        break;
      case 'Delete Account':
        setModalVisible(true);
        break;
      case 'Find Friends':
        navigation.navigate('FindFriendsScreen');
        break;
      default:
        navigation.navigate('ReuseScreen');
    }
  };

  const fetchProfileDatas = async () => {
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
        'https://apis.suniyenetajee.com/api/v1/account/profile/',
        requestOptions,
      );
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
      } else {
        console.error('Error response:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[styles.itemContainer, {borderBottomWidth: 0.5}]}
      onPress={() => {
        if (item.label === 'Log-Out') {
          logoutAndClearAsyncStorage();
        } else {
          handleNavigate(item.label);
        }
      }}>
      <Image
        source={item.icon}
        style={[
          styles.imgstyle,
          item.id === 1 && {height: 22, width: 22, marginLeft: 2},
          item.id === 4 && {height: 20, width: 20, marginLeft: 2},
        ]}
      />
      <Text
        style={[
          styles.listtxt,
          item.label === 'Log-Out' && {color: 'red', top: RfH(2)},
        ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfileDatas().finally(() => setRefreshing(false));
  }, []);

  const handleDeleteAccount = () => {
    dispatch(DeleteAccount())
      .unwrap()
      .then(() => {
        setModalVisible(false);
        logoutAndClearAsyncStorage();
        console.log('Account deleted');
      })
      .catch(error => {
        console.error('Error deleting account:', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}
          style={styles.leftItem}>
          <Icon name="left" size={20} color={colors.black} />
          <Text style={styles.title}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfileScreen')}
          style={styles.rightItem}>
          <FeatherIcon
            name="edit"
            size={20}
            color={colors.black}
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={colors.skyblue}
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={menuItems}
          ListHeaderComponent={
            <View>
              {data ? (
                <View style={styles.profileContainer}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setIsImageViewerVisible(true)}>
                    {data.picture ? (
                      <Image
                        source={{
                          uri: `https://apis.suniyenetajee.com${data.picture}`,
                        }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <Image
                        source={require('../../assets/images/dummyplaceholder.png')}
                        style={styles.profileImage}
                      />
                    )}
                  </TouchableOpacity>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                      {data.full_name.length > 15
                        ? `${data.full_name.slice(0, 13)}...`
                        : data.full_name}
                    </Text>
                    <Text style={styles.profilePhoneNumber}>
                      {data.phone_number}
                    </Text>
                    {data.party && (
                      <View style={styles.partyContainer}>
                        <Text style={styles.partyName}>{data.party.name}</Text>
                        {data.party.symbol && (
                          <Image
                            source={{
                              uri: `https://apis.suniyenetajee.com${data.party.symbol}`,
                            }}
                            style={styles.partySymbol}
                          />
                        )}
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                <View>
                  <Text>No data found</Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 8,
                  justifyContent: 'space-around',
                  marginTop: RfH(15),
                  marginHorizontal: RfW(10),
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile', {item: data})}
                  style={{
                    alignItems: 'center',
                    marginHorizontal: RfW(5),
                  }}>
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: 'Poppins-Medium',
                      fontSize: 12,
                    }}>
                    {data?.total_post || 0}
                  </Text>
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: 'Poppins-Medium',
                      fontSize: 12,
                    }}>
                    Post
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    borderWidth: 0.2,
                    borderColor: colors.DARK_GRAY,
                    marginHorizontal: RfW(15),
                  }}></View>
                <Pressable
                  style={{alignItems: 'center'}}
                  onPress={() => navigation.navigate('FollowersScreen')}>
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: 'Poppins-Medium',
                      fontSize: 12,
                    }}>
                    {data?.total_followers}
                  </Text>
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: 'Poppins-Medium',
                      fontSize: 12,
                    }}>
                    Followers
                  </Text>
                </Pressable>
                <View
                  style={{
                    borderWidth: 0.2,
                    borderColor: colors.DARK_GRAY,
                    marginHorizontal: RfW(15),
                  }}></View>
                <Pressable
                  style={{alignItems: 'center'}}
                  onPress={() => navigation.navigate('FollowingScreen')}>
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: 'Poppins-Medium',
                      fontSize: 12,
                    }}>
                    {data?.total_following}
                  </Text>
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: 'Poppins-Medium',
                      fontSize: 12,
                    }}>
                    Followings
                  </Text>
                </Pressable>
              </View>
            </View>
          }
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.skyblue]}
            />
          }
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteAccount()}
                style={[styles.button, styles.buttonRemove]}>
                <Text style={styles.textStyle}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ImageViewing
        images={[
          {
            uri: `https://apis.suniyenetajee.com${data.picture}`,
          },
        ]}
        imageIndex={0}
        visible={isImageViewerVisible}
        onRequestClose={() => setIsImageViewerVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 0.2,
    borderColor: 'gray',
  },
  leftItem: {
    left: RfH(20),
    marginTop: RfH(12),
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: RfH(10),
  },
  rightItem: {
    right: RfH(20),
    marginTop: RfH(12),
    paddingBottom: RfH(10),
  },
  profileContainer: {
    paddingHorizontal: RfW(20),
    marginTop: RfH(15),
    flexDirection: 'row',
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: RfH(10),
    borderColor: colors.skyblue,
    marginLeft: RfW(3),
  },
  profileInfo: {
    marginLeft: RfW(8),
    top: RfH(10),
  },
  profileName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.black,
    fontFamily: 'Poppins-Medium',
  },
  profilePhoneNumber: {
    fontSize: 15,
    fontWeight: '400',
    color: '#535763',
    fontFamily: 'Poppins-Medium',
  },
  partyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partyName: {
    fontSize: 15,
    fontWeight: '400',
    color: '#535763',
    fontFamily: 'Poppins-Medium',
  },
  partySymbol: {
    height: RfH(30),
    width: RfW(30),
    borderRadius: RfH(10),
    borderWidth: 1,
    marginLeft: RfW(1),
    bottom: RfH(7),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: RfH(15),
    borderBottomColor: colors.GRAY,
    paddingHorizontal: RfW(20),
  },
  imgstyle: {
    height: RfH(24),
    width: RfW(24),
  },
  listtxt: {
    fontSize: 15,
    fontWeight: '400',
    color: '#535763',
    fontFamily: 'Poppins-Medium',
    paddingHorizontal: RfW(10),
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.black,
    fontFamily: 'Poppins-Medium',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: colors.black,
    fontFamily: 'Poppins-SemiBoldItalic',
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '45%',
  },
  buttonClose: {
    backgroundColor: colors.skyblue,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRemove: {
    backgroundColor: 'red',
  },
});
