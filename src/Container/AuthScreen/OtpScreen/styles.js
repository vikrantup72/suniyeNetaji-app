import {StyleSheet} from 'react-native';
import {RfH, RfW} from '../../../utils/helper';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: RfH(20),
    alignSelf: 'center',
  },
  input: {
    width: '15%',
    height: RfH(45),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: RfH(5),
    paddingHorizontal: RfW(10),
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: RfW(5),
  },
  btntxtsty: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  otpcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RfW(20),
    backgroundColor: '#fff',
    marginTop: RfH(40),
  },
  imgsty: {
    height: RfH(100),
    width: RfW(100),
    alignSelf: 'center',
  },
  txtcontainer: {alignSelf: 'center', marginTop: RfH(30)},
  txt1: {
    fontSize: 18,
    fontWeight: '500',
    color: '#242424',
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium',
  },
  txtcon: {
    marginTop: RfH(10),
  },
  txt2: {
    fontSize: 14,
    alignSelf: 'center',
    fontWeight: '400',
    color: '#242424',
    opacity: 0.5,
    lineHeight: 22.5,
    fontFamily: 'Poppins-Medium',
  },
  otpfieldtcon: {
    marginTop: RfH(20),
    height: RfH(180),
    paddingHorizontal: RfW(15),
  },
  btnsty: {
    // position: 'absolute',
    bottom: RfH(60),
    height: RfH(50),
    alignSelf: 'center',
    justifyContent: 'center',
    width: '90%',
    borderRadius: RfH(25),
    backgroundColor: '#7966FF',
  },
  timecontainer: {
    flexDirection: 'row',
    bottom: RfH(30),
    // marginTop: RfH(35),
  },
  txttimer: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7966FF',
  },
  timer: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7966FF',
  },
});
