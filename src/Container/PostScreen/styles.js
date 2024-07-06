import {StyleSheet} from 'react-native';
import {colors} from '../../utils';
import {RfH, RfW} from '../../utils/helper';

export const styles = StyleSheet.create({
  bottomsheetcontainer: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingHorizontal: RfH(20),
    paddingTop: RfH(20),
  },
  crossimgsty: {
    height: RfH(16),
    width: RfW(16),
    top: RfH(5),
  },
  profileImageContainer: {
    height: RfH(40),
    width: RfW(38),
    borderRadius: RfH(20),
    borderWidth: 2,
    borderColor: colors.black,
    marginHorizontal: RfW(25),
    bottom: RfH(8),
  },
  profileImage: {
    height: RfH(36),
    width: RfW(34),
  },
  postbtn: {
    height: RfH(30),
    width: RfW(70),
    // borderWidth: 1,
    borderRadius: RfH(10),
    justifyContent: 'center',
  },
  posttxt: {
    alignSelf: 'center',
    fontSize: 14,
    color: colors.black,
  },
  inputcon: {
    marginTop: RfH(15),
  },
  innerinput: {
    width: '100%',
    height: RfH(100),
    borderColor: colors.GRAY,
    borderRadius: 5,
    marginBottom: 15,
    borderRadius: 16,
    color: colors.black,
    textAlignVertical: 'top',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    paddingHorizontal: RfW(10),
  },
  floatsty: {
    position: 'absolute',
    bottom: RfH(50),
    alignSelf: 'flex-end',
    right: RfH(30),
    height: RfH(50),
    width: RfW(50),
    borderRadius: RfH(20),
    backgroundColor: colors.skyblue,
    justifyContent: 'center',
  },
  floattxt: {
    alignSelf: 'center',
    fontSize: 28,
    color: colors.WHITE,
  },
  floatingImagesContainer: {
    position: 'absolute',
    bottom: RfH(115),
    alignSelf: 'flex-end',
    right: RfH(30),
    backgroundColor: 'red',
    height: RfH(200),
    justifyContent: 'center',
    width: RfW(50),
    borderTopLeftRadius: RfH(15),
    borderTopRightRadius: RfH(15),
  },
  floatingImage: {
    height: RfH(36),
    width: RfW(34),
    alignSelf: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  addImageStyle: {
    height:RfH(350),
    width: '100%',
    borderRadius: RfH(20),
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  crossIconContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingHorizontal: RfW(10),
    paddingVertical: RfH(10),
  },
  video: {
    alignSelf: 'center',
    width:'100%',
    height: RfH(250),
    borderRadius: RfH(8),
    paddingVertical: RfH(10),
    marginTop: RfH(10),
    borderWidth: 1,
    borderColor: colors.GRAY,
    backgroundColor:colors.shadwo_blue
  
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: RfW(50),
    height: RfH(50),
    borderRadius: 25,
    bottom: RfH(170),
  },
  tabVideo: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1,
    borderRadius:8,
    borderColor:colors.GRAY
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: RfH(10),
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.DARK_GRAY,
    left: RfW(12),
  },
  checkboximgsty: {
    height: RfH(24),
    width: RfH(24),
    tintColor: colors.skyblue,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
    fontSize: 16,
    color:colors.black,
    fontFamily: 'Poppins-Regular',

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
  buttonRemove: {
    backgroundColor:'red',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
   modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
    fontSize: 16,
    color:colors.black,
    fontFamily: 'Poppins-Regular',

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
  buttonRemove: {
    backgroundColor:'red',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
