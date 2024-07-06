import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {RfH, RfW, hp} from '../../utils/helper';
import {colors} from '../../utils';
import Header from '../../utils/Header';
import {
  deleteDraftPost,
  fetchdraftData,
  updateDraftPost,
} from '../../redux/DraftSlice';
import {BottomSheet} from 'react-native-btr';
import styles from './styles';

const Draft = ({navigation}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [imageSizes, setImageSizes] = useState({});
  const [localPosts, setLocalPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchdraftData()).finally(() => setRefreshing(false));
  }, [dispatch]);

  const {data, loading} = useSelector(state => state.draft);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchdraftData());
  }, [dispatch]);

  useEffect(() => {
    setLocalPosts(data);
  }, [data]);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    const visibleVideo = viewableItems.find(item => item.item.video);
    if (visibleVideo) {
      setCurrentVideoIndex(visibleVideo.index);
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  }).current;

  const playVideo = index => {
    setCurrentVideoIndex(index);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  const onLayout = item => e => {
    const containerWidth = e.nativeEvent?.layout?.width;
    if (containerWidth && item) {
      Image.getSize(
        item.banner_image,
        (width, height) => {
          const imageAspectRatio = width / height;
          const imageWidth = containerWidth;
          const imageHeight = containerWidth / imageAspectRatio;
          setImageSizes(prevState => ({
            ...prevState,
            [item.id]: {width: imageWidth, height: imageHeight},
          }));
        },
        () => {},
        {cache: 'force-cache'},
      );
    }
  };

  const updatePost = async () => {
    if (selectedItem) {
      const updatedData = {
        description: selectedItem.description,
        banner_image: selectedItem.banner_image,
        video: selectedItem.video,
      };
      setLoadingUpdate(true);
      setBottomSheetVisible(false);
      try {
        await dispatch(
          updateDraftPost({id: selectedItem.id, updatedData}),
        ).unwrap();
        setLocalPosts(prevPosts =>
          prevPosts.filter(draft => draft.id !== selectedItem.id),
        );
        navigation.navigate('Home');
      } catch (error) {
        console.error('Failed to update the post: ', error);
      } finally {
        setLoadingUpdate(false);
      }
    }
  };

  const handleDeletePost = async () => {
    if (selectedItem) {
      try {
        await dispatch(deleteDraftPost(selectedItem.id)).unwrap();
        setLocalPosts(prevPosts =>
          prevPosts.filter(draft => draft.id !== selectedItem.id),
        );
        setSelectedItem(null);
        setBottomSheetVisible(false);
      } catch (error) {
        console.error('Failed to delete the post: ', error);
      }
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, loadingUpdate && styles.dullBackground]}>
      <View>
        <Header HeaderTxt={'Draft'} />
      </View>
      {loading ? (
        <ActivityIndicator
          size={'small'}
          color={colors.skyblue}
          style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}
        />
      ) : (
        <View
          style={[styles.container, loadingUpdate && styles.dullBackground]}>
          <FlatList
            data={localPosts}
            keyExtractor={item => item.id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.skyblue]}
              />
            }
            renderItem={({item}) => {
              const imageSize = imageSizes[item.id];
              return (
                <View>
                  <View style={styles.massagepostcontainer}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={styles.postcontainer}>
                        <View style={styles.imgcontainer}>
                          <Image
                            source={{
                              uri: `https://apis.suniyenetajee.com${item?.created_by?.picture}`,
                            }}
                            style={{
                              height: RfH(34),
                              width: RfW(34),
                              borderRadius: RfH(16),
                              alignSelf: 'center',
                              resizeMode: 'cover',
                            }}
                          />
                        </View>
                        <View>
                          <Text style={styles.namesty}>
                            {item?.created_by?.full_name?.length > 15
                              ? `${item.created_by.full_name.slice(0, 15)}...`
                              : item.created_by.full_name}
                          </Text>
                          <Text style={styles.timesty}>
                            {item?.created_date}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.followcontainer}>
                        <View style={styles.followcontainer}>
                          <TouchableOpacity
                            style={{
                              height: RfH(25),
                              width: RfW(20),
                              left: RfW(0),
                            }}
                            onPress={() => {
                              setSelectedItem(item);
                              setBottomSheetVisible(true);
                            }}>
                            <Image
                              source={require('../../assets/images/dots.png')}
                              style={{
                                height: RfH(12.54),
                                width: RfW(3),
                                top: RfH(5),
                                resizeMode: 'contain',
                                alignSelf: 'center',
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View>
                      <Text style={styles.msgtextsty}>{item.description}</Text>
                    </View>
                    {item.banner_image && (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginVertical: RfH(5),
                          width: RfW(315),
                        }}
                        onLayout={onLayout(item)}>
                        <Image
                          source={{
                            uri: item.banner_image,
                            cache: 'force-cache',
                          }}
                          style={[
                            {
                              width: '100%',
                              height: imageSize?.height || RfH(50),
                              resizeMode: 'cover',
                              backgroundColor: colors.LIGHT_GRAY,
                              marginTop: hp('0.1%'),
                              borderRadius: RfH(10),
                            },
                            {width: imageSize?.width || screenWidth},
                          ]}
                        />
                      </View>
                    )}
                    {item.video && (
                      <View
                        style={[
                          styles.tabVideo,
                          {
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: colors.shadwo_blue,
                            borderRadius: RfH(8),
                            marginVertical: RfH(10),
                            padding: RfH(8),
                          },
                        ]}>
                        <Video
                          source={{uri: item.video}}
                          paused={currentVideoIndex !== item.id || isPaused}
                          style={[
                            styles.video,
                            {
                              height: screenHeight * 0.5,
                              width: screenWidth * 0.8,
                              alignSelf: 'center',
                              left: RfW(0),
                              borderRadius: RfH(10),
                            },
                          ]}
                          resizeMode="cover"
                          onEnd={() => {}}
                        />
                        <TouchableOpacity
                          activeOpacity={0.9}
                          style={styles.playButton}
                          onPress={() => {
                            if (currentVideoIndex === item.id) {
                              handlePause();
                            } else {
                              playVideo(item.id);
                            }
                          }}>
                          {currentVideoIndex === item.id && !isPaused ? (
                            <Icon name={'pause'} size={32} color="#128C78" />
                          ) : (
                            <Icon
                              name={'play-arrow'}
                              size={32}
                              color="#128C78"
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              );
            }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <Text style={{marginTop: '80%', color: colors.black}}>
                  No draft posts available
                </Text>
              </View>
            }
          />
          {loadingUpdate && (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="large" color={colors.skyblue} />
            </View>
          )}
        </View>
      )}
      <BottomSheet
        visible={bottomSheetVisible}
        onBackButtonPress={() => setBottomSheetVisible(false)}
        onBackdropPress={() => setBottomSheetVisible(false)}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderTopRightRadius: RfH(20),
            borderTopLeftRadius: RfH(25),
            paddingVertical: RfH(20),
          }}>
          <View>
            <>
              <TouchableOpacity
                style={[styles.bottombtncon, {marginVertical: RfH(10)}]}
                onPress={updatePost}>
                <View>
                  <Entypo
                    name={'publish'}
                    size={22}
                    color={colors.skyblue}
                    style={{top: RfH(6)}}
                  />
                </View>
                <View style={{left: RfW(12)}}>
                  <Text style={styles.btntxt}>Post</Text>
                  <Text style={styles.disbtntxt}>
                    Are you sure want to publish this post
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottombtncon}
                onPress={handleDeletePost}>
                <View>
                  <AntDesign
                    name={'delete'}
                    size={20}
                    color={colors.skyblue}
                    style={{top: RfH(8)}}
                  />
                </View>
                <View style={{left: RfW(12)}}>
                  <Text style={styles.btntxt}>Delete</Text>
                  <Text style={styles.disbtntxt}>
                    This Post will be deleted permanently
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Draft;
