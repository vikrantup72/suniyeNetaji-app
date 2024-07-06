import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Pressable,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import {RfH, RfW, getKey, getUserId, hp} from '../../utils/helper';
import {colors} from '../../utils';
import styles from './styles';
import SocialActivityes from '../socialactivityes/SocialActivityes';
import Header from '../../utils/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Replyandlikecomment from './Replyandlikecomment';
import Video from 'react-native-video';
import DeleteCamment from './DeleteCamment';
import {useDispatch, useSelector} from 'react-redux';
import {createComment, updateComment} from '../../redux/Comment';
import ReplyBottomSheet from './ReplyBottosheet';

const Commentscreen = ({route}) => {
  const {item, discription} = route.params || {};
  const {mainDataSource} = useSelector(state => state.dataSource);
  const [comment, setComment] = useState('');
  const [data, setData] = useState([]);
  console.log(data,"comments");
  const [loading, setLoading] = useState(false);
  const [replyVisible, setReplyVisible] = useState(false);
  const [isCurrentVideo, setIsCurrentVideo] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [userId, setUserId] = useState(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    getComment(item);
  }, []);

  useEffect(() => {
    getUserId("comment")
      .then(userId => {
        setUserId(userId);
      })
      .catch(error => {
        console.error('Error getting user ID:', error);
      });
  }, [dispatch]);

  const openReplySheet = comment => {
    setSelectedComment(comment);
    setReplyVisible(true);
  };

  const onClose = () => {
    setSelectedComment(null);
    setReplyVisible(false);
  };

  const deleteComment = id => {
    setData(data.filter(comment => comment.id !== id));
  };

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const onLayout = useCallback(async e => {
    const containerWidth = e.nativeEvent?.layout?.width;
    Image.getSize(discription.banner_image, (width, height) => {
      const imageAspectRatio = width / height;
      const imageHeight = containerWidth / imageAspectRatio;
      setImageWidth(containerWidth);
      setImageHeight(imageHeight);
    });
  }, []);

  const handleCommentChange = text => {
    setComment(text);
  };

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const handleSubmit = async () => {
    try {
      setButtonDisabled(true);
      if (isEditing) {
        await dispatch(updateComment({id: editCommentId, comment})).unwrap();
        setIsEditing(false);
        setEditCommentId(null);
      } else {
        await dispatch(createComment({comment, item})).unwrap();
      }
      setComment('');
      getComment(item);
      inputRef.current.blur();
    } catch (error) {
      console.error('Error handling comment:', error);
    } finally {
      setButtonDisabled(false);
    }
  };

  const getComment = async id => {
    // setLoading(true);
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
        `https://apis.suniyenetajee.com/api/v1/cms/comment/post/${id}/`,
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

  const handleEdit = () => {
    if (selectedComment) {
      setComment(selectedComment?.comment);
      setIsEditing(true);
      setEditCommentId(selectedComment?.id);
      onClose();
    }
  };

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1000);
    }
  }, [isEditing]);

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  const [isVisibleModal, setVisibleModal] = useState(false);
  const [viewAllData, setViewAllData] = useState();

  const onVisibleModal = (isVisible, item) => {
    setViewAllData(item);
    setVisibleModal(isVisible);
  };

  const onCloseModal = () => {
    setVisibleModal(false);
  };

  const ListHeaderItem = () => {
    return (
      <>
        <View
          style={{
            paddingHorizontal: RfW(10),
            paddingVertical: RfH(10),
            borderWidth: 1,
            borderRadius: RfH(10),
            borderColor: colors.LIGHT_BLACK,
            paddingBottom: RfW(10),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={styles.postcontainer}>
              <View style={styles.imgcontainer}>
                <Image
                  source={{
                    uri: `https://apis.suniyenetajee.com/${mainDataSource[item]?.created_by?.picture}`,
                  }}
                  style={{
                    height: RfH(34),
                    width: RfW(34),
                    borderRadius: RfH(20),
                    alignSelf: 'center',
                    resizeMode: 'cover',
                  }}
                />
              </View>
              <View>
                <Text style={styles.namesty}>
                  {discription?.created_by?.full_name?.length > 15
                    ? `${mainDataSource[item].created_by.full_name.slice(
                        0,
                        15,
                      )}...`
                    : mainDataSource[item].created_by.full_name}
                </Text>
                <Text style={styles.timesty}>
                  {mainDataSource[item]?.created_date}
                </Text>
              </View>
            </View>
            <View style={styles.followcontainer}></View>
          </View>
          <View>
            <Text style={styles.msgtextsty}>
              {mainDataSource[item]?.description}
            </Text>
          </View>
          <View>
            {/* Banner Image */}
            {mainDataSource[item]?.banner_image && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: RfH(5),
                }}
                onLayout={onLayout}>
                <Image
                  source={{
                    uri: mainDataSource[item]?.banner_image,
                    cache: 'force-cache',
                  }}
                  style={[
                    {
                      width: '100%',
                      height: imageHeight,
                      resizeMode: 'cover',
                      backgroundColor: colors.LIGHT_GRAY,
                      marginTop: hp('0.1%'),
                      borderRadius: RfH(10),
                    },
                    {width: imageWidth},
                  ]}
                />
              </View>
            )}

            {/* Video */}
            {mainDataSource[item]?.video && (
              <View style={styles.tabVideo}>
                <Video
                  source={{uri: [item]?.video}}
                  paused={!isCurrentVideo || isPaused}
                  style={[
                    styles.video,
                    {
                      height: screenHeight * 0.4,
                      width: screenWidth * 0.8,
                      alignSelf: 'center',
                      left: RfW(0),
                      borderRadius: RfH(10),
                    },
                  ]}
                  resizeMode="cover"
                />
                {/* Play/Pause button */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.playButton}
                  onPress={() => {
                    if (isCurrentVideo) {
                      setIsPaused(!isPaused);
                    } else {
                      setIsCurrentVideo(true);
                      setIsPaused(false);
                    }
                  }}>
                  {isCurrentVideo && !isPaused ? (
                    <Icon name={'pause'} size={32} color="#128C78" />
                  ) : (
                    <Icon name={'play-arrow'} size={32} color="#128C78" />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View>
            <SocialActivityes
              Commentimg={require('../../assets/images/comment.png')}
              item={mainDataSource[item]}
            />
          </View>
        </View>
        {item > 0 ? (
          <View style={{marginVertical: RfH(10)}}>
            <Text style={styles.nametxtsty}>Comments..</Text>
          </View>
        ) : (
          <Text style={styles.nametxtsty}>No comments yet...</Text>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View>
        <Header HeaderTxt={'Comment'} />
      </View>
      <View
        style={{
          paddingVertical: RfH(5),
          paddingHorizontal: RfW(20),
          marginBottom: '30%',
        }}>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeaderItem}
          renderItem={({item, index}) => {
            const isLastItem = index === data.length - 1;
            return (
              <View
                style={{
                  flex: 1,
                  paddingBottom: RfH(10),
                  marginBottom: isLastItem ? 15 : 0,
                }}>
                {loading ? (
                  <ActivityIndicator size={'small'} color={colors.skyblue} />
                ) : (
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.imgcontainer}>
                      <Image
                        source={{
                          uri: `https://apis.suniyenetajee.com/${item?.created_by?.picture}`,
                        }}
                        style={{
                          height: RfH(34),
                          width: RfW(34),
                          borderRadius: RfH(20),
                          alignSelf: 'center',
                          resizeMode: 'cover',
                        }}
                      />
                    </View>
                    <View style={styles.msgcontainer}>
                      <View
                        style={{
                          paddingVertical: RfH(5),
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View>
                          <Text style={styles.nametxtsty}>
                            {item?.created_by?.full_name?.length > 15
                              ? `${item.created_by.full_name.slice(0, 15)}...`
                              : item.created_by.full_name}
                          </Text>
                        </View>
                        {console.log(userId,'userIdvvn')}
                        {console.log(item?.created_by?.user_id,'userIdvvnvhhnvn')}

                        {userId == item?.created_by?.user_id && (
                          <TouchableOpacity
                            onPress={() => openReplySheet(item)}
                            style={{width: RfW(25)}}>
                            <Image
                              source={require('../../assets/images/dots.png')}
                              style={{
                                height: RfH(12.54),
                                width: RfW(3),
                                top: RfH(5),
                                left: RfW(3),
                                resizeMode: 'contain',
                                alignSelf: 'center',
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View style={{bottom: RfH(6), width: '98%'}}>
                        <Text style={styles.msgtxtsty}>{item?.comment}</Text>
                        <View>
                          <Replyandlikecomment
                            item={item}
                            onVisibleModal={onVisibleModal}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={() => (
            <View style={{alignItems: 'center', marginTop: 20}}>
              {loading && (
                <ActivityIndicator size={'small'} color={colors.skyblue} />
              )}
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />
        <ReplyBottomSheet
          isVisible={isVisibleModal}
          onClose={onCloseModal}
          selectedItem={viewAllData}
        />
      </View>
      {/* Bottom Input */}
      <View
        style={{
          position: 'absolute',
          bottom: RfH(0),
          alignSelf: 'center',
          flexDirection: 'row',
          backgroundColor: colors.WHITE,
          paddingVertical: RfH(5),
          borderTopWidth: 1,
          borderTopColor: colors.GRAY,
        }}>
        <View style={styles.inputcontainer}>
          <TextInput
            placeholder="Write Comment Here....."
            value={comment}
            onChangeText={handleCommentChange}
            placeholderTextColor={colors.DARK_GRAY}
            style={styles.inputtxtsty}
            ref={inputRef}
            autoFocus={false}
          />
        </View>
        <Pressable
          activeOpacity={0.9}
          onPress={comment && !buttonDisabled ? handleSubmit : null}
          style={[
            styles.postbtnsty,
            {opacity: comment && !buttonDisabled ? 1 : 0.5},
          ]}
          disabled={buttonDisabled}>
          <Text style={styles.posttxt}>{isEditing ? 'Edit' : 'Post'}</Text>
        </Pressable>
      </View>

      {/* Delete Comment Bottom Sheet */}
      <DeleteCamment
        isVisible={replyVisible}
        onClose={onClose}
        selectedItem={selectedComment}
        onDelete={deleteComment}
        onEdit={handleEdit}
        postId={item}
      />
    </SafeAreaView>
  );
};

export default Commentscreen;
