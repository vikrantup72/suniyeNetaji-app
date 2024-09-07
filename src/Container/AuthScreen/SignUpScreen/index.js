// import React, {useState} from 'react';
// import {
//   SafeAreaView,
//   View,
//   StatusBar,
//   TouchableOpacity,
//   Text,
//   Image,
//   ScrollView,
//   TextInput,
//   ToastAndroid,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import {RfH, RfW} from '../../../utils/helper';
// import Header from '../../../utils/Header';
// import {Picker} from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/Ionicons';
// import {colors} from '../../../utils';
// import {styles} from './styles';
// import {Formik} from 'formik';
// import * as Yup from 'yup';
// import {launchImageLibrary} from 'react-native-image-picker';
// import Entypoes from 'react-native-vector-icons/Entypo';

// const SignupScreen = ({navigation}) => {
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);

//   const SignupSchema = Yup.object().shape({
//     first_name: Yup.string().trim().required('First name is required'),
//     last_name: Yup.string().trim().required('Last name is required'),
//     phone_number: Yup.string()
//       .matches(/^\d{10}$/, 'Phone number must be 10 digits')
//       .trim()
//       .required('Phone number is required'),
//     email: Yup.string()
//       .email('Invalid email address')
//       .trim()
//       .required('Email is required'),
//     password: Yup.string()
//       .min(6, 'Password must be at least 6 characters')
//       .trim()
//       .required('Password is required'),
//     pin_code: Yup.string().trim().required('Pin code is required'),
//     gender: Yup.string().trim().required('Gender is required'),
//     date_of_birth: Yup.string()
//       .trim()
//       .matches(/^\d{4}-\d{2}-\d{2}$/, 'DOB must be in the format YYYY-MM-DD')
//       .required('Date of Birth is required'),
//   });

//   const signupMethod = async values => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('first_name', values.first_name);
//       formData.append('last_name', values.last_name);
//       formData.append('phone_number', values.phone_number);
//       formData.append('email', values.email);
//       formData.append('password', values.password);
//       formData.append('pin_code', values.pin_code);
//       formData.append('gender', values.gender);
//       formData.append('date_of_birth', values.date_of_birth);

//       if (selectedImage) {
//         formData.append('picture', {
//           uri: selectedImage.uri,
//           type: selectedImage.type,
//           name: selectedImage.fileName,
//         });
//       }

//       const response = await fetch(
//         'https://stage.suniyenetajee.com/api/v1/account/registration/',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           body: formData,
//         },
//       );
//       const data = await response.json();

//       if (response.ok) {
//         console.log('SignUp API response:', data);
//         navigation.navigate('OtpScreen', {email: values.email});
//         ToastAndroid.show(data.Message, ToastAndroid.BOTTOM);
//       } else {
//         let errorMessage = 'Plz check phone & email already exists.';

//         if (data?.email) {
//           errorMessage = data.email.join(' ');
//         } else if (data?.Message) {
//           errorMessage = data.Message;
//         }

//         console.log('API error response: ', errorMessage);
//         ToastAndroid.show(errorMessage, ToastAndroid.BOTTOM);
//       }
//     } catch (error) {
//       console.log('Error:', error);
//       Alert.alert(
//         'Error',
//         'Please check your email or phone number. They might already exist.',
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openGallery = () => {
//     const options = {
//       mediaType: 'photo',
//       selectionLimit: 1,
//       includeBase64: false,
//       saveToPhotos: false,
//     };

//     launchImageLibrary(options, response => {
//       if (response.didCancel) {
//         console.log('User canceled image picker');
//       } else if (response.error) {
//         console.error('ImagePicker Error: ', response.error);
//         Alert.alert('Error', 'An error occurred while selecting image');
//       } else if (response.assets && response.assets.length > 0) {
//         setSelectedImage(response.assets[0]);
//         console.log('Selected image URI:', response.assets[0].uri);
//       }
//     });
//   };

//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView style={styles.container}>
//         <Header HeaderTxt={'Register'} />
//         <ScrollView>
//           {selectedImage && selectedImage.uri ? (
//             <View style={styles.tabVideo}>
//               <Image
//                 source={{uri: selectedImage.uri}}
//                 style={styles.profileimgsty}
//               />
//             </View>
//           ) : (
//             <View style={{}}>
//               <Image
//                 source={require('../../../assets/images/friend.png')}
//                 style={styles.profileimgsty}
//               />
//             </View>
//           )}
//           <View style={{}}>
//             <TouchableOpacity
//               onPress={() => openGallery('photo')}
//               style={styles.icontainer}>
//               <Entypoes
//                 name={'camera'}
//                 size={16}
//                 color={colors.skyblue}
//                 style={{alignSelf: 'center'}}
//               />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.txtcontainer}>
//             <Text style={styles.txt1}>Register Account -</Text>
//             <View style={styles.txtcon}>
//               <Text style={styles.txt2}>Enter your personal information</Text>
//             </View>
//           </View>
//           <Formik
//             initialValues={{
//               first_name: '',
//               last_name: '',
//               phone_number: '',
//               email: '',
//               password: '',
//               pin_code: '',
//               gender: '',
//               date_of_birth: '',
//             }}
//             validationSchema={SignupSchema}
//             onSubmit={(values, {setSubmitting}) => {
//               const trimmedValues = {
//                 first_name: values.first_name.trim(),
//                 last_name: values.last_name.trim(),
//                 phone_number: values.phone_number.trim(),
//                 email: values.email.trim(),
//                 password: values.password.trim(),
//                 pin_code: values.pin_code.trim(),
//                 gender: values.gender.trim(),
//                 date_of_birth: values.date_of_birth.trim(),
//               };
//               signupMethod(trimmedValues);
//               setSubmitting(false);
//             }}>
//             {({
//               handleChange,
//               handleBlur,
//               handleSubmit,
//               values,
//               errors,
//               touched,
//             }) => (
//               <View style={styles.phoneinputcon}>
//                 <View>
//                   <Text style={styles.placeholderheader}>First Name</Text>
//                 </View>
//                 <View style={styles.inputfieldsty}>
//                   <TextInput
//                     placeholder="Enter First Name"
//                     placeholderTextColor={'gray'}
//                     onChangeText={handleChange('first_name')}
//                     onBlur={handleBlur('first_name')}
//                     value={values.first_name}
//                     style={styles.inputTextStyle}
//                   />
//                 </View>
//                 {errors.first_name && touched.first_name ? (
//                   <Text style={styles.errorText}>{errors.first_name}</Text>
//                 ) : null}
//                 <View>
//                   <Text style={styles.placeholderheader}>Last Name</Text>
//                 </View>
//                 <View style={styles.inputfieldsty}>
//                   <TextInput
//                     placeholder="Enter Last Name"
//                     placeholderTextColor={'gray'}
//                     onChangeText={handleChange('last_name')}
//                     onBlur={handleBlur('last_name')}
//                     value={values.last_name}
//                     style={styles.inputTextStyle}
//                   />
//                 </View>
//                 {errors.last_name && touched.last_name ? (
//                   <Text style={styles.errorText}>{errors.last_name}</Text>
//                 ) : null}
//                 <View>
//                   <Text style={styles.placeholderheader}>Phone Number</Text>
//                 </View>
//                 <View style={styles.inputfieldsty}>
//                   <TextInput
//                     placeholder="Phone Number"
//                     placeholderTextColor={'gray'}
//                     onChangeText={handleChange('phone_number')}
//                     onBlur={handleBlur('phone_number')}
//                     value={values.phone_number}
//                     maxLength={10}
//                     keyboardType="number-pad"
//                     style={styles.inputTextStyle}
//                   />
//                 </View>
//                 {errors.phone_number && touched.phone_number ? (
//                   <Text style={styles.errorText}>{errors.phone_number}</Text>
//                 ) : null}
//                 <View>
//                   <Text style={styles.placeholderheader}>Email</Text>
//                 </View>
//                 <View style={styles.inputfieldsty}>
//                   <TextInput
//                     placeholder="Enter Email"
//                     placeholderTextColor={'gray'}
//                     onChangeText={handleChange('email')}
//                     onBlur={handleBlur('email')}
//                     value={values.email}
//                     style={styles.inputTextStyle}
//                   />
//                 </View>
//                 {errors.email && touched.email ? (
//                   <Text style={styles.errorText}>{errors.email}</Text>
//                 ) : null}
//                 <View>
//                   <Text style={styles.placeholderheader}>Password</Text>
//                 </View>
//                 <View style={[styles.inputfieldsty, {flexDirection: 'row'}]}>
//                   <TextInput
//                     placeholder="Enter Password"
//                     placeholderTextColor={'gray'}
//                     onChangeText={handleChange('password')}
//                     onBlur={handleBlur('password')}
//                     value={values.password}
//                     secureTextEntry={!passwordVisible}
//                     style={[styles.inputTextStyle, {width: '85%'}]}
//                   />
//                   <TouchableOpacity
//                     style={{padding: 10, top: RfH(5)}}
//                     onPress={() => setPasswordVisible(!passwordVisible)}>
//                     {passwordVisible ? (
//                       <Icon name="eye-outline" size={20} color="#242424" />
//                     ) : (
//                       <Icon name="eye-off-outline" size={20} color="#242424" />
//                     )}
//                   </TouchableOpacity>
//                 </View>
//                 {errors.password && touched.password ? (
//                   <Text style={styles.errorText}>{errors.password}</Text>
//                 ) : null}
//                 <View>
//                   <Text style={styles.placeholderheader}>Pin No.</Text>
//                 </View>
//                 <View style={styles.inputfieldsty}>
//                   <TextInput
//                     placeholder="Enter Pin No."
//                     placeholderTextColor={'gray'}
//                     onChangeText={handleChange('pin_code')}
//                     onBlur={handleBlur('pin_code')}
//                     maxLength={6}
//                     value={values.pin_code}
//                     style={styles.inputTextStyle}
//                   />
//                 </View>
//                 {errors.pin_code && touched.pin_code ? (
//                   <Text style={styles.errorText}>{errors.pin_code}</Text>
//                 ) : null}
//                 <View>
//                   <Text style={styles.placeholderheader}>Enter DOB</Text>
//                 </View>
//                 <View style={styles.inputfieldsty}>
//                   <TextInput
//                     placeholder="2023-02-23"
//                     placeholderTextColor={'gray'}
//                     onChangeText={handleChange('date_of_birth')}
//                     onBlur={handleBlur('date_of_birth')}
//                     value={values.date_of_birth}
//                     style={styles.inputTextStyle}
//                   />
//                 </View>
//                 {errors.date_of_birth && touched.date_of_birth ? (
//                   <Text style={styles.errorText}>{errors.date_of_birth}</Text>
//                 ) : null}
//                 <View>
//                   <Text style={styles.placeholderheader}>Select Gender</Text>
//                 </View>
//                 <View style={styles.pickerContainer}>
//                   <Picker
//                     selectedValue={values.gender}
//                     onValueChange={handleChange('gender')}
//                     style={styles.pickerStyle}>
//                     <Picker.Item label="Gender" value="" />
//                     <Picker.Item label="Male" value="Male" />
//                     <Picker.Item label="Female" value="Female" />
//                   </Picker>
//                 </View>
//                 {errors.gender && touched.gender ? (
//                   <Text style={styles.errorText}>{errors.gender}</Text>
//                 ) : null}
//                 <TouchableOpacity
//                   onPress={handleSubmit}
//                   style={styles.btnsty}
//                   activeOpacity={0.8}>
//                   {loading ? (
//                     <ActivityIndicator size="small" color="#ffffff" />
//                   ) : (
//                     <Text style={styles.btntxtsty}>
//                       {loading ? 'Loading...' : 'Register'}
//                     </Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             )}
//           </Formik>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };

// export default SignupScreen;

import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {RfH, RfW} from '../../../utils/helper';
import Header from '../../../utils/Header';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../../utils';
import {styles} from './styles';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {launchImageLibrary} from 'react-native-image-picker';
import Entypoes from 'react-native-vector-icons/Entypo';
// import DatePicker from 'react-native-date-picker';

const SignupScreen = ({navigation}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // const [date, setDate] = useState(new Date());
  // const [open, setOpen] = useState(false);

  const SignupSchema = Yup.object().shape({
    first_name: Yup.string().trim().required('First name is required'),
    last_name: Yup.string().trim().required('Last name is required'),
    phone_number: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .trim()
      .required('Phone number is required'),
    email: Yup.string()
      .email('Invalid email address')
      .trim()
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .trim()
      .required('Password is required'),
    pin_code: Yup.string().trim().required('Pin code is required'),
    // gender: Yup.string().trim().required('Gender is required'),
    // date_of_birth: Yup.string()
    //   .trim()
    //   .matches(/^\d{4}-\d{2}-\d{2}$/, 'DOB must be in the format YYYY-MM-DD')
    //   .required('Date of Birth is required'),
  });

  const signupMethod = async values => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      formData.append('phone_number', values.phone_number);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('pin_code', values.pin_code);
      // formData.append('gender', values.gender);
      // formData.append('date_of_birth', values.date_of_birth);

      if (selectedImage) {
        formData.append('picture', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.fileName,
        });
      }
      console.log(formData);
      const response = await fetch(
        'https://stage.suniyenetajee.com/api/v1/account/registration/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );
      const data = await response.json();

      if (response.ok) {
        console.log('SignUp API response:', data);
        navigation.navigate('OtpScreen', {email: values.email});
        ToastAndroid.show(data.Message, ToastAndroid.BOTTOM);
      } else {
        let errorMessage = 'Plz check phone & email already exists.';

        if (data?.email) {
          errorMessage = data.email.join(' ');
        } else if (data?.Message) {
          errorMessage = data.Message;
        }

        console.log('API error response: ', errorMessage);
        ToastAndroid.show(errorMessage, ToastAndroid.BOTTOM);
      }
    } catch (error) {
      console.log('Error:', error);
      Alert.alert(
        'Error',
        'Please check your email or phone number. They might already exist.',
      );
    } finally {
      setLoading(false);
    }
  };

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
        Alert.alert('Error', 'An error occurred while selecting image');
      } else if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]);
        console.log('Selected image URI:', response.assets[0].uri);
      }
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <Header HeaderTxt={'Register'} />
        <ScrollView>
          {selectedImage && selectedImage.uri ? (
            <View style={styles.tabVideo}>
              <Image
                source={{uri: selectedImage.uri}}
                style={styles.profileimgsty}
              />
            </View>
          ) : (
            <View style={{}}>
              <Image
                source={require('../../../assets/images/friend.png')}
                style={styles.profileimgsty}
              />
            </View>
          )}
          <View style={{}}>
            <TouchableOpacity
              onPress={() => openGallery('photo')}
              style={styles.icontainer}>
              <Entypoes
                name={'camera'}
                size={16}
                color={colors.skyblue}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.txtcontainer}>
            <Text style={styles.txt1}>Register Account -</Text>
            <View style={styles.txtcon}>
              <Text style={styles.txt2}>Enter your personal information</Text>
            </View>
          </View>
          <Formik
            initialValues={{
              first_name: '',
              last_name: '',
              phone_number: '',
              email: '',
              password: '',
              pin_code: '',
              // gender: '',
              // date_of_birth: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={(values, {setSubmitting}) => {
              const trimmedValues = {
                first_name: values.first_name.trim(),
                last_name: values.last_name.trim(),
                phone_number: values.phone_number.trim(),
                email: values.email.trim(),
                password: values.password.trim(),
                pin_code: values.pin_code.trim(),
                // gender: values.gender.trim(),
                // date_of_birth: values.date_of_birth.trim(),
              };
              signupMethod(trimmedValues);
              setSubmitting(false);
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.phoneinputcon}>
                <View>
                  <Text style={styles.placeholderheader}>First Name</Text>
                </View>
                <View style={styles.inputfieldsty}>
                  <TextInput
                    placeholder="Enter First Name"
                    placeholderTextColor={'gray'}
                    onChangeText={handleChange('first_name')}
                    onBlur={handleBlur('first_name')}
                    value={values.first_name}
                    style={styles.inputTextStyle}
                  />
                </View>
                {errors.first_name && touched.first_name ? (
                  <Text style={styles.errorText}>{errors.first_name}</Text>
                ) : null}
                <View>
                  <Text style={styles.placeholderheader}>Last Name</Text>
                </View>
                <View style={styles.inputfieldsty}>
                  <TextInput
                    placeholder="Enter Last Name"
                    placeholderTextColor={'gray'}
                    onChangeText={handleChange('last_name')}
                    onBlur={handleBlur('last_name')}
                    value={values.last_name}
                    style={styles.inputTextStyle}
                  />
                </View>
                {errors.last_name && touched.last_name ? (
                  <Text style={styles.errorText}>{errors.last_name}</Text>
                ) : null}
                <View>
                  <Text style={styles.placeholderheader}>Phone Number</Text>
                </View>
                <View style={styles.inputfieldsty}>
                  <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor={'gray'}
                    onChangeText={handleChange('phone_number')}
                    onBlur={handleBlur('phone_number')}
                    value={values.phone_number}
                    maxLength={10}
                    keyboardType="number-pad"
                    style={styles.inputTextStyle}
                  />
                </View>
                {errors.phone_number && touched.phone_number ? (
                  <Text style={styles.errorText}>{errors.phone_number}</Text>
                ) : null}
                <View>
                  <Text style={styles.placeholderheader}>Email</Text>
                </View>
                <View style={styles.inputfieldsty}>
                  <TextInput
                    placeholder="Enter Email"
                    placeholderTextColor={'gray'}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    style={styles.inputTextStyle}
                  />
                </View>
                {errors.email && touched.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
                <View>
                  <Text style={styles.placeholderheader}>Password</Text>
                </View>
                <View style={[styles.inputfieldsty, {flexDirection: 'row'}]}>
                  <TextInput
                    placeholder="Enter Password"
                    placeholderTextColor={'gray'}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={!passwordVisible}
                    style={[styles.inputTextStyle, {width: '85%'}]}
                  />
                  <TouchableOpacity
                    style={{padding: 10, top: RfH(5)}}
                    onPress={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? (
                      <Icon name="eye-outline" size={20} color="#242424" />
                    ) : (
                      <Icon name="eye-off-outline" size={20} color="#242424" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && touched.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
                <View>
                  <Text style={styles.placeholderheader}>Pin No.</Text>
                </View>
                <View style={styles.inputfieldsty}>
                  <TextInput
                    placeholder="Enter Pin No."
                    placeholderTextColor={'gray'}
                    onChangeText={handleChange('pin_code')}
                    onBlur={handleBlur('pin_code')}
                    maxLength={6}
                    value={values.pin_code}
                    style={styles.inputTextStyle}
                  />
                </View>
                {errors.pin_code && touched.pin_code ? (
                  <Text style={styles.errorText}>{errors.pin_code}</Text>
                ) : null}
                {/* <View>
                  <Text style={styles.placeholderheader}>Enter DOB</Text>
                </View>
                <View
                  style={[
                    styles.inputfieldsty,
                    {height: RfH(45), justifyContent: 'center'},
                  ]}>
                  <TouchableOpacity
                    onPress={() => setOpen(true)}
                    style={{paddingHorizontal: RfW(5)}}>
                    <Text style={{color: colors.primary_black}}>
                      {values.date_of_birth
                        ? values.date_of_birth
                        : 'YYYY-MM-DD'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.date_of_birth && touched.date_of_birth ? (
                  <Text style={styles.errorText}>{errors.date_of_birth}</Text>
                ) : null} */}
                {/* <DatePicker
                  modal
                  open={open}
                  date={date}
                  mode="date"
                  onConfirm={date => {
                    setOpen(false);
                    setDate(date);
                    const formattedDate = date.toISOString().split('T')[0];
                    setFieldValue('date_of_birth', formattedDate);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                /> */}
                {/* <View>
                  <Text style={styles.placeholderheader}>Select Gender</Text>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.gender}
                    onValueChange={handleChange('gender')}
                    style={styles.pickerStyle}>
                    <Picker.Item label="Gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                  </Picker>
                </View>
                {errors.gender && touched.gender ? (
                  <Text style={styles.errorText}>{errors.gender}</Text>
                ) : null} */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.btnsty}
                  activeOpacity={0.8}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.btntxtsty}>
                      {loading ? 'Loading...' : 'Register'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SignupScreen;
