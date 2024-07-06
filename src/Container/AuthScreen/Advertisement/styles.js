import {StyleSheet} from 'react-native';
import {colors} from '../../../utils';
import {RfH, RfW, SCREEN_HEIGHT} from '../../../utils/helper';

export default styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.WHITE,
  },
  // videoContainer: {
  //   backgroundColor: colors.WHITE,
  //   marginVertical: RfH(10),
  //   width: RfW(337),
  //   alignSelf: 'center',
  //   paddingVertical: RfH(5),
  //   borderRadius: RfH(8),
  //   borderColor: colors.LIGHT_BLACK,
  //   borderWidth: 1,
  //   paddingBottom: RfH(10),
  // },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: RfH(8),
  },
  postContainer: {
    flexDirection: 'row',
    paddingHorizontal: RfW(10),
  },
  imgContainer: {
    backgroundColor: colors.GRAY,
    height: RfH(32),
    width: RfW(32),
    borderRadius: RfH(16),
    justifyContent: 'center',
  },
  profileImage: {
    height: RfH(19),
    width: RfW(17),
    alignSelf: 'center',
  },
  nameStyle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.black,
    paddingHorizontal: RfW(10),
    lineHeight: RfH(17),
    fontFamily: 'Poppins-Medium',
  },
  timeStyle: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.DARK_GRAY,
    paddingHorizontal: RfW(10),
    lineHeight: RfH(14),
    fontFamily: 'Poppins-Medium',
  },
  followButton: {
    width: RfW(77),
    height: RfH(22),
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: RfH(7),
    justifyContent: 'center',
    left: RfW(4),
    // marginHorizontal: RfW(15),
  },
  followText: {
    alignSelf: 'center',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
    fontFamily: 'Poppins-Regular',
    top: RfH(1),
  },
  dotsIcon: {
    height: RfH(12.54),
    width: RfW(3),
    top: RfH(3),
    right: RfW(15),
  },
  msgContainer: {
    paddingHorizontal: RfW(15),
  },
  msgTextStyle: {
    marginTop: RfH(8),
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.black,
    fontFamily: 'Poppins-Regular',
  },
  thumbnailContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoThumbnail: {
    width: RfW(307),
    height: RfH(200),
    borderRadius: RfH(8),
    position: 'absolute',
    top: RfH(10),
  },
 
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: 20,
    zIndex: 999,
  },
  playPauseIcon: {
    width: RfW(40),
    height: RfH(40),
    borderRadius: RfH(20),
    // position:'absolute',
    bottom: RfH(35),
  },
  socialContainer: {
    left: RfW(8),
  },
});
