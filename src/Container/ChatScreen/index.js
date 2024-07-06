// import React from 'react';
// import {
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {colors} from '../../utils';
// import ChatScreenHeader from '../../Component/commoninputs/ChatScreenHeader';
// import {RfH, RfW} from '../../utils/helper';
// import SearchInput from '../../Component/commoninputs/SearchInput';
// import Header from '../../utils/Header';
// // import AdvertisementScreen from '../AuthScreen/Advertisement/AdvertisementScreen';

// const ChatScreen = ({navigation}) => {
//   const data = [
//     {
//       name: 'Rahul Rastogi',
//       messages: '5 new messages',
//       lastMessage: 'Yesterday',
//       key: '1',
//     },
//     {
//       name: 'John Doe',
//       messages: '2 new messages',
//       lastMessage: '2 days ago',
//       key: '2',
//     },
//     {
//       name: 'Rahul Rastogi',
//       messages: '5 new messages',
//       lastMessage: 'Yesterday',
//       key: '3',
//     },
//     {
//       name: 'John Doe',
//       messages: '2 new messages',
//       lastMessage: '2 days ago',
//       key: '4',
//     },
//   ];

//   const renderItem = ({item}) => (
//     <View style={styles.item}>
//       <TouchableOpacity
//         onPress={() => navigation.navigate('MassageScreen')}
//         activeOpacity={0.8}
//         style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//         <View style={{flexDirection: 'row'}}>
//           <View>
//             <Image
//               source={require('../../assets/images/man.png')}
//               style={styles.imgsty}
//             />
//           </View>
//           <View style={{paddingHorizontal: RfW(8)}}>
//             <Text style={styles.namesty}>{item.name}</Text>
//             <Text style={styles.msgsty}>{item.messages}</Text>
//           </View>
//         </View>
//         <View>
//           <Text style={[styles.msgsty, {top: RfH(4), color: colors.DARK_GRAY}]}>
//             {item.lastMessage}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View>
//         <Header
//           HeaderTxt={'Massage'}
//           ProfileImage={require('../../assets/images/notificationbell.png')}
//           onPress={() => navigation.navigate('Notification')}
//         />
//       </View>
//       <View style={styles.homecontainer}>
//         <SearchInput placeholder={'Search'} />
//         <FlatList
//           data={data}
//           renderItem={renderItem}
//           keyExtractor={item => item.key}
//           ItemSeparatorComponent={() => <View style={styles.separator} />}
//         />
//       </View>
//       <View style={{alignSelf: 'center', marginTop: '30%'}}>
//         <Text
//           style={{
//             color: colors.black,
//             fontFamily: 'Poppins-Medium',
//             fontSize: 16,
//           }}>
//           Work in progress in massage screen...!
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// // export default AdvertisementScreen(ChatScreen);
// export default ChatScreen

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.WHITE,
//   },
//   homecontainer: {
//     paddingHorizontal: RfW(20),
//   },
//   item: {
//     paddingVertical: RfH(10),
//     borderBottomWidth: 1,
//     borderBottomColor: colors.LIGHT_GRAY,
//   },
//   imgsty: {
//     height: RfH(50),
//     width: RfW(50),
//     borderRadius: RfH(25),
//   },
//   namesty: {
//     fontSize: 14,
//     fontWeight: '400',
//     fontFamily: 'Poppins-Medium',
//     color: colors.black,
//     marginTop: RfH(3),
//     top: RfH(2),
//   },
//   msgsty: {
//     fontSize: 12,
//     fontWeight: '400',
//     fontFamily: 'Poppins-Regular',
//     color: colors.skyblue,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: colors.LIGHT_GRAY,
//   },
// });


import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../../utils/Header';
import {colors} from '../../utils';
import { RfH } from '../../utils/helper';

const ChatScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.WHITE}}>
      <Header HeaderTxt={'Massage'} />
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

export default ChatScreen;

const styles = StyleSheet.create({});
