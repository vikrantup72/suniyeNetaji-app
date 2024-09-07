import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import Header from '../../utils/Header';
import {RfH, RfW, getKey} from '../../utils/helper';
import {colors} from '../../utils';
import {launchImageLibrary} from 'react-native-image-picker';

const Support = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageURI, setImageURI] = useState('');

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: false,
      saveToPhotos: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
        ToastAndroid.show(
          'An error occurred while selecting image',
          ToastAndroid.BOTTOM,
        );
      } else if (response.assets && response.assets.length > 0) {
        setImageURI(response.assets[0].uri);
        console.log('Selected image URI:', response.assets[0].uri);
      }
    });
  };

  const handleChoicePress = async () => {
    setIsLoading(true);

    try {
      const token = await getKey('AuthKey');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);

      if (imageURI) {
        const imageUriParts = imageURI.split('.');
        const imageType = imageUriParts[imageUriParts.length - 1];
        const imageName = `image.${imageType}`;
        formData.append('attach_file', {
          uri: imageURI,
          name: imageName,
          type: `image/${imageType}`,
        });
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
        body: formData,
      };

      const response = await fetch(
        'https://stage.suniyenetajee.com/api/v1/support/message/',
        requestOptions,
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log('Message sent:', responseData);
        ToastAndroid.show('Message sent', ToastAndroid.BOTTOM);
        navigation.goBack();
        setTitle('');
        setDescription('');
        setImageURI('');
      } else {
        console.error('Error response:', response.status, response.statusText);
        ToastAndroid.show('Failed to send message', ToastAndroid.BOTTOM);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      ToastAndroid.show('Failed to send message', ToastAndroid.BOTTOM);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header HeaderTxt={'Support'} />
      <View style={{marginHorizontal: RfW(20), flex: 1}}>
        <View style={{flexDirection: 'row', marginTop: RfH(15)}}>
          <View>
            <Text style={styles.placeholderheader}>Title</Text>
            <View style={styles.inputfieldsty}>
              <TextInput
                style={styles.profiletxt}
                placeholder="Enter title"
                value={title}
                onChangeText={txt => setTitle(txt)}
              />
            </View>
          </View>
        </View>
        <View style={{marginVertical: RfH(15)}}>
          <View>
            <Text style={styles.placeholderheader}>Description</Text>
          </View>
          <View style={[styles.inputfieldsty, styles.descriptionInput]}>
            <TextInput
              style={[styles.profiletxt, {height: '100%', right: 10}]}
              placeholder="Enter description"
              multiline={true}
              textAlignVertical="top"
              value={description}
              onChangeText={txt => setDescription(txt)}
            />
          </View>
        </View>

        <View>
          <Text style={styles.placeholderheader}>Attach-file</Text>
        </View>
        <TouchableOpacity onPress={openGallery} style={styles.uploadBtn}>
          <Text
            style={[
              styles.uploadBtnText,
              imageURI && {color: colors.primary_black},
            ]}>
            {imageURI ? 'Image Uploaded' : 'Upload Image'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnsty} onPress={handleChoicePress}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.WHITE} />
          ) : (
            <Text style={styles.btntxtsty}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  profiletxt: {
    paddingVertical: RfH(10),
    paddingHorizontal: RfW(10),
    fontSize: 14,
    color: colors.black,
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
  },
  inputfieldsty: {
    marginVertical: RfH(5),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: RfH(10),
    backgroundColor: colors.LIGHT_GRAY,
    width: RfW(335),
  },
  placeholderheader: {
    fontSize: 16,
    fontWeight: '500',
    color: '#242424',
    marginVertical: RfH(5),
    fontFamily: 'Poppins-Medium',
  },
  descriptionInput: {
    height: RfH(150),
    padding: RfW(10),
  },
  btnsty: {
    height: 40,
    width: RfW(335),
    borderRadius: RfH(10),
    alignSelf: 'center',
    marginTop: RfH(20),
    backgroundColor: '#7966FF',
    justifyContent: 'center',
  },
  btntxtsty: {
    color: colors.WHITE,
    fontSize: 15,
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium',
    top: RfH(2),
  },
  uploadBtn: {
    marginVertical: RfH(5),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: RfH(10),
    backgroundColor: colors.LIGHT_GRAY,
    width: RfW(335),
    height: RfH(45),
    justifyContent: 'center',
    paddingHorizontal: RfW(10),
  },
  uploadBtnText: {
    fontSize: 14,
    color: colors.DARK_GRAY,
    marginVertical: RfH(5),
    fontFamily: 'Poppins-Regular',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: RfH(10),
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: colors.primary_black,
  },
});
