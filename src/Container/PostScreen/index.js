import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Modal,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {styles} from './styles';
import {colors} from '../../utils';
import {RfH, RfW} from '../../utils/helper';
import Video from 'react-native-video';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {createPost, updatePost} from '../../redux/PostReducer';
import {fetchProfileData} from '../../redux/ProfileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createDraft} from '../../redux/DraftSlice';

const PostScreen = ({route}) => {
  const {item, flag} = route?.params || {};
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [textInputValue, setTextInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentFlag, setCurrentFlag] = useState(flag);
  const [modalVisible, setModalVisible] = useState(false);
  const [draftpost, setDraftpost] = useState(false);
  const focus = useIsFocused();

  useEffect(() => {
    if (currentFlag === 'isEdit' && item) {
      setTextInputValue(item?.description || '');
      if (item?.banner_image) {
        setSelectedImage({path: item?.banner_image});
      }
      if (item.video) {
        setSelectedVideo({path: item?.video});
      }
    }
    return () => {
      resetState();
    };
  }, [item, currentFlag, focus]);

  const resetState = () => {
    setTextInputValue('');
    setSelectedImage(null);
    setSelectedVideo(null);
  };

  const openGallery = useCallback(mediaType => {
    if (mediaType === 'video') {
      ImagePicker.openPicker({
        mediaType: 'video',
      })
        .then(video => {
          setSelectedVideo(video);
          setSelectedImage(null);
        })
        .catch(error => {
          console.error('ImagePicker Error: ', error);
        });
    } else {
      ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
      })
        .then(image => {
          setSelectedImage(image);
          setSelectedVideo(null);
        })
        .catch(error => {
          console.error('ImagePicker Error: ', error);
        });
    }
  }, []);

  const playVideo = () => {
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const showMediaOptions = () => {
    Alert.alert(
      'Select Media Type',
      'Choose which type of media to pick:',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Selection canceled'),
          style: 'cancel',
        },
        {
          text: 'Photo',
          onPress: () => openGallery('photo'),
        },
        {
          text: 'Video',
          onPress: () => openGallery('video'),
        },
      ],
      {cancelable: true},
    );
  };

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      if (isPosting) return;
      setIsPosting(true);
      setIsLoading(true);
      await dispatch(
        createPost({textInputValue, selectedImage, selectedVideo, navigation}),
      );
      resetState();
      navigation.goBack();
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setIsPosting(false);
      setIsLoading(false);
    }
  };

  const handleDraft = async () => {
    try {
      if (isPosting) return;
      // setIsPosting(true);
      setIsLoading(true);
      await dispatch(
        createDraft({textInputValue, selectedImage, selectedVideo, navigation}),
      );
      setModalVisible(false);
      resetState();
    } catch (error) {
      console.log(error, 'error');
    } finally {
      navigation.goBack();
    }
  };

  const handleEdit = async () => {
    try {
      if (isPosting) return;
      setIsPosting(true);
      setIsLoading(true);
      await dispatch(
        updatePost({
          id: item?.id,
          textInputValue,
          selectedImage,
          selectedVideo,
          navigation,
        }),
      );

      resetState();
      setCurrentFlag(null);
      navigation.goBack();
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setIsPosting(false);
      setIsLoading(false);
    }
  };

  const isPostButtonEnabled = () => {
    return textInputValue.trim() !== '' || selectedImage || selectedVideo;
  };

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  const {datas, error} = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(fetchProfileData());
  }, [dispatch]);

  const goToBack = async () => {
    await AsyncStorage.removeItem('isEdit');
    navigation.goBack();
  };

  const toggleEndDate = () => {
    setDraftpost(!draftpost);
  };

  return (
    <SafeAreaView style={styles.bottomsheetcontainer}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={goToBack}>
            <Image
              source={require('../../assets/images/cross.png')}
              style={styles.crossimgsty}
            />
          </TouchableOpacity>
          <View style={styles.profileImageContainer}>
            {datas?.picture ? (
              <Image
                source={{
                  uri: `https://apis.suniyenetajee.com${datas?.picture}`,
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
                  height: RfH(34),
                  width: RfW(34),
                  borderRadius: RfH(16),
                  alignSelf: 'center',
                  resizeMode: 'cover',
                }}
              />
            )}
          </View>
        </View>

        {draftpost ? (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[
              styles.postbtn,
              {
                backgroundColor: colors.skyblue,
              },
            ]}>
            {isLoading ? (
              <ActivityIndicator size={'small'} color={colors.WHITE} />
            ) : (
              <Text style={[styles.posttxt, {color: colors.WHITE}]}>Draft</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={currentFlag === 'isEdit' ? handleEdit : handleSubmit}
            style={[
              styles.postbtn,
              {
                backgroundColor: isPostButtonEnabled()
                  ? colors.skyblue
                  : colors.GRAY,
              },
            ]}
            disabled={!isPostButtonEnabled() || isPosting}>
            <Text
              style={[
                styles.posttxt,
                {
                  color: isPostButtonEnabled() ? colors.WHITE : colors.black,
                },
              ]}>
              {currentFlag === 'isEdit' ? 'Edit' : 'Post'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.inputcon}>
        <TextInput
          placeholder="What do you want to talk about?"
          placeholderTextColor={colors.DARK_GRAY}
          multiline={true}
          value={textInputValue}
          style={styles.innerinput}
          onChangeText={text => {
            setTextInputValue(text);
          }}
        />
      </View>
      {selectedImage && selectedImage.path && (
        <View style={styles.tabVideo}>
          <Image
            source={{uri: selectedImage.path}}
            style={styles.addImageStyle}
          />
        </View>
      )}
      {selectedVideo && selectedVideo.path && (
        <View style={styles.tabVideo}>
          <Video
            source={{uri: selectedVideo.path}}
            paused={!isPaused}
            style={[
              styles.video,
              {
                height: screenHeight * 0.5,
                width: screenWidth * 0.8,
                borderRadius: RfH(10),
                bottom: RfH(5),
              },
            ]}
            resizeMode="cover"
          />
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.playButton}
            onPress={handlePause}>
            {isPaused ? (
              <Icon name={'pause'} size={32} color="#128C78" />
            ) : (
              <Icon name={'play-arrow'} size={32} color="#128C78" />
            )}
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={toggleEndDate}
          style={styles.checkbox}>
          <Image
            source={
              draftpost
                ? require('../../assets/images/checkbox.png')
                : require('../../assets/images/checkbox2.png')
            }
            style={styles.checkboximgsty}
          />
          <Text style={styles.checkboxLabel}>
            Do you want to put this in a draft post?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.floatsty} onPress={showMediaOptions}>
        <Text style={styles.floattxt}>+</Text>
      </TouchableOpacity>
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}>
          <ActivityIndicator size="large" color={colors.skyblue} />
        </View>
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
              Are you sure Do you want to put this in a draft post?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDraft()}
                style={[styles.button, styles.buttonRemove]}>
                <Text style={styles.textStyle}>Draft</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PostScreen;
