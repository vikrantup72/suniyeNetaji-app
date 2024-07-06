// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   SafeAreaView,
//   ScrollView,
// } from 'react-native';
// import {RfH, RfW} from '../../utils/helper';
// import {colors} from '../../utils';
// import DatePicker from 'react-native-date-picker';

// const OffersScreen = ({navigation}) => {
//   const [startdate, setStartdate] = useState('');
//   const [enddate, setEnddate] = useState('');
//   const [open, setOpen] = useState(false);
//   const [open2, setOpen2] = useState(false);
//   const [date, setDate] = useState(new Date());
//   const [date2, setDate2] = useState(new Date());
//   const [showEndDate, setShowEndDate] = useState(false);

//   const toggleEndDate = () => {
//     setShowEndDate(!showEndDate);
//     if (!showEndDate) setEnddate('');
//   };

//   return (
//     <SafeAreaView style={{backgroundColor: colors.WHITE, flex: 1}}>
//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         style={styles.crossbtnsty}>
//         <Image
//           source={require('../../assets/images/cross.png')}
//           style={styles.crossimgsty}
//         />
//       </TouchableOpacity>
//       <ScrollView>
//         <View style={styles.contantcontainer}>
//           <View>
//             <Text style={styles.headingtxt}>Add Experience</Text>
//             <Text style={styles.titlesty}>
//               Here you can add your work experience and your journey.
//             </Text>
//           </View>

//           <View style={{marginTop: RfH(15)}}>
//             <View style={{marginVertical: RfH(0)}}>
//               <Text style={styles.headtxt}>Title</Text>
//               <TextInput
//                 placeholder="Ex: Retail Sales Manager"
//                 placeholderTextColor={colors.DARK_GRAY}
//                 style={styles.input}
//               />
//               <View style={styles.bottombordersty}></View>
//             </View>
//             <View style={{marginVertical: RfH(0)}}>
//               <Text style={styles.headtxt}>Organization name</Text>
//               <TextInput
//                 placeholder="Ex: ClickNPay"
//                 placeholderTextColor={colors.DARK_GRAY}
//                 style={styles.input}
//               />
//               <View style={styles.bottombordersty}></View>
//             </View>
//             <View>
//               <Text style={styles.headtxt}>Location</Text>
//               <TextInput
//                 placeholder="Ex: Greater Noida"
//                 placeholderTextColor={colors.DARK_GRAY}
//                 style={styles.input}
//               />
//               <View style={styles.bottombordersty}></View>
//             </View>

//             <View style={styles.checkboxContainer}>
//               <TouchableOpacity onPress={toggleEndDate} style={styles.checkbox}>
//                 <Image
//                   source={
//                     showEndDate
//                       ? require('../../assets/images/checkbox.png')
//                       : require('../../assets/images/checkbox2.png')
//                   }
//                   style={styles.checkboximgsty}
//                 />
//                 <Text style={styles.checkboxLabel}>
//                   I am currently working in this role
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             <View style={{marginTop: RfH(20)}}>
//               <Text style={styles.headtxt}>Start Date</Text>
//               <View style={[{height: RfH(45), justifyContent: 'center'}]}>
//                 <TouchableOpacity
//                   onPress={() => setOpen(true)}
//                   style={{paddingHorizontal: RfW(5), marginTop: RfH(5)}}>
//                   <Text style={{color: colors.primary_black}}>
//                     {startdate ? startdate : 'Start Date'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//               <DatePicker
//                 modal
//                 open={open}
//                 date={date}
//                 mode="date"
//                 onConfirm={date => {
//                   setOpen(false);
//                   setDate(date);
//                   const formattedDate = date.toISOString().split('T')[0];
//                   setStartdate(formattedDate);
//                 }}
//                 onCancel={() => {
//                   setOpen(false);
//                 }}
//               />
//               <View style={styles.Datebottombordersty}></View>
//             </View>
//             {showEndDate ? (
//               <View style={{marginVertical: RfH(10)}}>
//                 <Text style={styles.headtxt}>End Date</Text>
//                 <View style={styles.inputField}>
//                   <TouchableOpacity
//                     onPress={() => setOpen2(true)}
//                     style={styles.datePickerButton}>
//                     <Text style={styles.datePickerText}>
//                       {enddate ? enddate : 'End Date'}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//                 <DatePicker
//                   modal
//                   open={open2}
//                   date={date2}
//                   mode="date"
//                   onConfirm={date => {
//                     setOpen2(false);
//                     setDate2(date);
//                     const formattedDate = date.toISOString().split('T')[0];
//                     setEnddate(formattedDate);
//                   }}
//                   onCancel={() => {
//                     setOpen2(false);
//                   }}
//                 />
//                 <View style={styles.Datebottombordersty}></View>
//               </View>
//             ) : (
//               <View style={{marginTop: 10}}>
//                 <Text style={styles.headtxt}>End Date</Text>
//                 <TextInput
//                   placeholder="Present"
//                   placeholderTextColor={colors.DARK_GRAY}
//                   style={styles.input}
//                   editable={false}
//                 />
//                 <View style={styles.bottombordersty}></View>
//               </View>
//             )}
//             <View>
//               <Text style={[styles.headtxt, {top: RfH(10)}]}>Discription</Text>
//               <TextInput
//                 placeholder="Max 150"
//                 placeholderTextColor={colors.DARK_GRAY}
//                 style={styles.input}
//                 maxLength={10}
//               />
//               <View style={styles.bottombordersty}></View>
//             </View>
//           </View>
//         </View>
//         <TouchableOpacity
//           activeOpacity={0.8}
//           style={styles.updatebtn}
//           onPress={() => navigation.navigate('EditProfileScreen')}>
//           <Text style={styles.updatetxt}>Save</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default OffersScreen;

// const styles = StyleSheet.create({
//   crossimgsty: {
//     height: RfH(16),
//     width: RfW(16),
//   },
//   crossbtnsty: {
//     paddingHorizontal: RfW(20),
//     paddingVertical: RfH(20),
//   },
//   contantcontainer: {
//     paddingHorizontal: RfW(20),
//     // paddingVertical: RfH(30),
//   },
//   headingtxt: {
//     color: colors.black,
//     fontFamily: 'Poppins-Medium',
//     fontSize: 16,
//     marginTop: RfH(3),
//   },
//   titlesty: {
//     color: colors.black,
//     fontFamily: 'Poppins-Regular',
//     fontSize: 12,
//     marginTop: RfH(10),
//   },
//   headtxt: {
//     fontSize: 16,
//     color: colors.black,
//     marginTop: RfH(5),
//   },
//   bottombordersty: {
//     borderBottomWidth: 1,
//     marginBottom: RfH(8),
//     bottom: 10,
//     borderBottomColor: colors.DARK_GRAY,
//   },
//   Datebottombordersty: {
//     borderBottomWidth: 1,
//     marginBottom: RfH(3),
//     borderBottomColor: colors.DARK_GRAY,
//     bottom: 5,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: RfH(10),
//     top: RfH(5),
//     // marginBottom: RfH(5),
//   },
//   checkbox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   checkboxLabel: {
//     fontSize: 14,
//     color: colors.DARK_GRAY,
//     left: RfW(12),
//   },
//   inputField: {height: RfH(45), justifyContent: 'center'},
//   datePickerButton: {paddingHorizontal: RfW(5), marginTop: RfH(5)},
//   datePickerText: {color: colors.primary_black},
//   input: {
//     color: colors.primary_black,
//   },
//   checkboximgsty: {
//     height: RfH(24),
//     width: RfH(24),
//     tintColor: colors.skyblue,
//   },
//   updatebtn: {
//     backgroundColor: '#7966FF',
//     height: RfH(45),
//     width: '90%',
//     alignSelf: 'center',
//     borderRadius: RfH(10),
//     marginVertical: RfH(20),
//     justifyContent: 'center',
//   },
//   updatetxt: {
//     alignSelf: 'center',
//     color: colors.WHITE,
//     fontFamily: 'Poppins-Medium',
//   },
// });

import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../../utils/Header';
import {RfH, RfW} from '../../utils/helper';
import {colors} from '../../utils';

const OffersScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.WHITE}}>
      <Header HeaderTxt={'Offers'} />
      <View
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
          flex: 1,
          bottom: RfH(30),
        }}>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            alignSelf: 'center',
            marginTop: RfH(10),
            fontSize: 20,
            color: colors.skyblue,
          }}>
          Work in progress..
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default OffersScreen;

const styles = StyleSheet.create({});
