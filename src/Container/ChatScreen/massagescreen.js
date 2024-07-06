import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import {colors} from '../../utils';
import ChatScreenHeader from '../../Component/commoninputs/ChatScreenHeader';
import {RfH, RfW} from '../../utils/helper';

const MassageScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const data = [
    {message: 'What do you mean?', type: 'sender', time: '9:00PM'},
    {
      message: "I think the idea that things are changing isn't good",
      type: 'user',
      time: '9:00PM',
    },
    {
      message: "I think the idea that things are changing isn't good",
      type: 'user',
      time: '9:00PM',
    },
    {message: 'What do you mean?', type: 'sender', time: '9:00PM'},
    {
      message: "I think the idea that things are changing isn't good",
      type: 'user',
      time: '9:00PM',
    },
    {message: 'What do you mean?', type: 'sender', time: '9:00PM'},
  ];

  const renderItem = ({item}) => {
    return (
      <View
        style={[
          styles.msgcontainer,
          item.type === 'user' && styles.sendmsgcontainer,
        ]}>
        <Text
          style={[
            styles.messageText,
            item.type === 'user' && styles.sendmsgtxt,
          ]}>
          {item.message}
        </Text>
        <Text
          style={{
            alignSelf: 'flex-end',
            color: item.type === 'user' ? colors.black : colors.WHITE,
            fontSize: 11,
            fontFamily: 'Poppins-Regular',
          }}>
          {item.time}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <ChatScreenHeader
          HeaderTxt={'Rituraj Gaikwad'}
          Activetime={'2 hour ago'}
          ProfileImage={require('../../assets/images/man.png')}
          onPress={() => navigation.navigate('ProfileScreen')}
        />
      </View>
      <View style={styles.homecontainer}>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: RfH(0),
          flexDirection: 'row',
          paddingHorizontal: RfW(20),
          backgroundColor: colors.WHITE,
          paddingVertical: RfH(5),
        }}>
        <View style={styles.inputcontainer}>
          <TextInput
            placeholder="write your message.."
            style={styles.inputtxtsty}
          />
        </View>
        <TouchableOpacity
          style={styles.postbtnsty}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.posttxt}>Send</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View
              style={{
                height: RfH(40),
                width: RfW(40),
                borderWidth: 2,
                justifyContent: 'center',
                borderRadius: RfH(20),
              }}>
              <Image
                source={require('../../assets/images/progress.png')}
                style={{height: RfH(30), width: RfW(30), alignSelf: 'center'}}
              />
            </View>

            <Text style={styles.modalText}>Work in progress...!</Text>
            <TouchableOpacity
              style={{...styles.openButton, backgroundColor: colors.blue}}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MassageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  homecontainer: {
    marginTop: RfH(20),
    paddingHorizontal: RfW(20),
  },
  msgcontainer: {
    padding: RfH(10),
    marginVertical: RfH(10),
    maxWidth: Dimensions.get('window').width * 0.7,
    alignSelf: 'flex-start',
    backgroundColor: colors.skyblue,
    borderBottomRightRadius: RfH(20),
    borderTopLeftRadius: RfH(20),
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.WHITE,
  },
  sendmsgcontainer: {
    padding: RfH(10),
    marginVertical: RfH(5),
    maxWidth: Dimensions.get('window').width * 0.7,
    alignSelf: 'flex-end',
    backgroundColor: '#EBEAEA',
  },
  sendmsgtxt: {
    color: colors.black,
  },
  flatListContent: {
    paddingBottom: RfH(130),
  },
  inputcontainer: {
    backgroundColor: '#EBEBEB',
    width: RfW(290),
    paddingHorizontal: RfW(10),
    borderRadius: RfH(8),
    height: RfH(43),
  },
  inputtxtsty: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
    justifyContent: 'center',
    top: RfH(5),
  },
  postbtnsty: {
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: RfW(10),
  },
  posttxt: {
    fontSize: 15,
    color: colors.skyblue,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: RfH(20),
    backgroundColor: 'white',
    borderRadius: RfH(20),
    padding: RfH(35),
    width: RfW(220),
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
  openButton: {
    backgroundColor: colors.blue,
    borderRadius: 20,
    height: RfH(30),
    width: RfW(70),
    justifyContent: 'center',
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    top:RfH(2)
  },
  modalText: {
    marginVertical: RfH(15),
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    color: colors.black,
  },
});
