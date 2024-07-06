import {StyleSheet} from 'react-native';
import {RfH, RfW} from '../../../utils/helper';
import {colors} from '../../../utils';

export default styles = StyleSheet.create({
  container: {
    marginVertical: RfH(10),
    paddingHorizontal: RfW(18),
  },
  headersty: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.black,
    lineHeight: 18.75,
    fontFamily: 'Poppins-Medium',
    marginTop: RfH(10),
    left: RfW(1),
  },
  contantcontainer: {
    width: RfW(100),
    borderWidth: 1,
    borderRadius: RfH(7),
    marginTop: RfH(10),
    backgroundColor: colors.shadwo_blue,
    borderColor: colors.GRAY,
    paddingVertical: RfH(5),
    paddingHorizontal: RfW(5),
    marginHorizontal: RfW(5),
    right: RfW(4),
  },
  txtsty: {
    fontSize: 10,
    alignSelf: 'center',
    color: colors.black,
    marginTop: RfH(2),
  },
  imgsty: {
    height: RfH(45),
    width: RfW(45),
    borderRadius: RfH(25),
    alignSelf: 'center',
    marginTop: RfH(2),
  },
  Followbtn: {
    width: RfW(60),
    height: RfH(20),
    borderWidth: 1,
    borderRadius: RfH(7),
    marginTop: RfH(5),
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: colors.GRAY,
  },
  Followtxtsty: {
    fontSize: 10,
    alignSelf: 'center',
    color: colors.black,
    bottom: RfH(1),
  },
  followedBtn: {
    backgroundColor: colors.skyblue,
  },
  followBtn: {
    width: RfW(60),
    height: RfH(20),
    borderColor: colors.black,
    borderRadius: RfH(7),
    justifyContent: 'center',
    marginTop: RfH(2),
    borderWidth: 0.5,
    alignItems: 'center',
  },
  followtxt: {
    alignSelf: 'center',
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.black,
    fontFamily: 'Poppins-Regular',
    // top: RfH(1),
  },
});
