import {StyleSheet} from 'react-native';
import {colors} from '../../utils';
import {RfH, RfW, hp, wp} from '../../utils/helper';

export default styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: RfH(16),
    borderTopLeftRadius: RfH(20),
    borderTopRightRadius: RfH(10),
    maxHeight: '80%',
    paddingBottom: RfH(40),
    minHeight: RfH(300),
  },
  headercontainer: {flexDirection: 'row'},
  commentheadertxt: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: colors.black,
    alignSelf: 'center',
    right: RfW(20),
  },
  dotimgsty: {
    borderWidth: 1,
    borderColor: colors.black,
    height: RfH(15),
    width: 15,
  },
  noRepliesText: {
    alignSelf: 'center',
    marginTop: RfH(15),
    color: 'red',
    fontFamily: 'Poppins-Regular',
  },
  deletecommenttxt: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'red',
    alignSelf: 'center',
  },
  headrtxt: {flex: 1, justifyContent: 'center'},
  crossimgsty: {
    height: RfH(15),
    width: RfW(15),
    alignSelf: 'center',
  },
  namesty: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.black,
    paddingHorizontal: RfW(10),
    lineHeight: RfH(17),
    fontFamily: 'Poppins-Medium',
  },

  imgcontainer: {
    backgroundColor: colors.GRAY,
    height: RfH(32),
    width: RfW(32),
    borderRadius: RfH(16),
    justifyContent: 'center',
    top: RfH(5),
  },
  proimgsty: {
    height: RfH(19),
    width: RfW(17),
    alignSelf: 'center',
  },
  bottomSheetsty: {
    minHeight: RfH(100),
    maxHeight: RfH(500),
  },
  msgcontainer: {
    backgroundColor: colors.shadwo_blue,
    marginVertical: RfH(5),
    borderRadius: RfH(10),
    width: RfW(300),
    left: RfW(5),
    paddingHorizontal: RfW(15),
  },
  nametxtsty: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
    fontFamily: 'Poppins-Medium',
  },
  commentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY,
    marginVertical: RfH(10),
  },

  msgtxtsty: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.black,
    fontFamily: 'Poppins-Regular',
  },
  inputcontainer: {
    width: RfW(290),
    height: RfH(43),
    alignSelf: 'center',
    borderRadius: RfH(10),
    paddingHorizontal: RfW(10),
    marginVertical: RfH(3),
    backgroundColor: '#EBEBEB',
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
  inputtxtsty: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
    justifyContent: 'center',
    top: RfH(5),
  },
  crossbtncon: {
    height: RfH(25),
    width: RfW(25),
    backgroundColor: 'red',
    justifyContent: 'center',
    backgroundColor: colors.WHITE,
  },
  repliessty: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
    color: colors.black,
    paddingLeft: RfW(2),
  },
  imgcontainer: {
    backgroundColor: colors.GRAY,
    height: RfH(32),
    width: RfW(32),
    borderRadius: RfH(16),
    justifyContent: 'center',
    top: RfH(3),
  },
  postcontainer: {
    flexDirection: 'row',
  },
  namesty: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.black,
    paddingHorizontal: RfW(10),
    lineHeight: RfH(17),
    fontFamily: 'Poppins-Medium',
  },
  timesty: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.DARK_GRAY,
    paddingHorizontal: RfW(10),
    lineHeight: RfH(14),
    fontFamily: 'Poppins-Medium',
  },
  msgtextsty: {
    marginTop: RfH(10),
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.black,
    fontFamily: 'Poppins-Regular',
    left: RfW(5),
  },
  postimgsty: {
    width: RfW(307),
    height: RfH(200),
    borderRadius: RfH(8),
    marginVertical: RfH(10),
    alignSelf: 'center',
  },
  tabVideo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  clearButton: {
    // position: 'absolute',
    // marginLeft: '37%',
    // marginTop: '16%',
  },
  video: {
    alignSelf: 'center',
    width: RfW(307),
    height: RfH(200),
    borderRadius: RfH(8),
    paddingVertical: RfH(10),
    marginTop: RfH(10),
    borderWidth: 1,
    borderColor: colors.GRAY,
  },
  imagePostContainer: (w, h) => ({
    width: '100%',
    height: hp('60%'),
    resizeMode: 'cover',
    backgroundColor: ColorTheme.DIVIDER_BACKGROUND,
    marginTop: hp('0.1%'),
    aspectRatio: w / h,
  }),
  postImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottombtncon: {
    flexDirection: 'row',
    backgroundColor: colors.shadwo_blue,
    borderRadius: 10,
    paddingHorizontal: RfW(10),
    paddingVertical: RfH(10),
  },
  btntxt: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'Poppins-Medium',
    top: RfH(2),
  },
  disbtntxt: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: colors.DARK_GRAY,
    bottom: RfH(3),
  },
});
