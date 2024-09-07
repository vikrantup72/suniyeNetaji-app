import React, { useState, useCallback } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { colors } from '../../utils';
import Share from 'react-native-share';
import { RfH, RfW, getKey } from '../../utils/helper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { dislikePost, likePost } from '../../redux/DataSource';

const SocialActivities = ({ Commentimg, item }) => {
  // console.log(item,"jbmhbjhb");
  
  const [likeCount, setLikeCount] = useState(item?.total_likes_count || 0);
  const [isLiked, setIsLiked] = useState(item?.is_like);
  const [totalShareCount, setTotalShareCount] = useState(item?.total_share_count || 0);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlePostLike = useCallback(id => {
    dispatch(likePost({ id: id }));
  }, [dispatch]);

  const handlePostDislike = useCallback(id => {
    dispatch(dislikePost({ id: id }));
  }, [dispatch]);

  const handleLike = async id => {
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prevCount => newIsLiked ? prevCount + 1 : prevCount - 1);

      if (newIsLiked) {
        handlePostLike(id);
      } else {
        handlePostDislike(id);
      }

      const action = newIsLiked ? 'like' : 'dislike';
      const token = await getKey('AuthKey');
      console.log('Token:', token);
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/post/like-dislike/${id}/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ action }),
        },
      );

      if (!response.ok) {
        console.error('Error liking post:', response.status);
      }
    } catch (error) {
      console.error('Error liking post:', error.message);
    }
  };

  const shareContent = async () => {
    try {
      const shareOptions = {
        title: 'Share via',
        message: 'Some message to share',
        url: 'some URL to share',
      };

      await Share.open(shareOptions);

      const token = await getKey('AuthKey');
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/post/share/${item?.id}/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );

      if (response.ok) {
        setTotalShareCount(prevCount => prevCount + 1);
        console.log('Post shared successfully');
      }
    } catch (error) {
      console.error('Error sharing post:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {likeCount > 0 && (
        <TouchableOpacity
          style={styles.likeCountcon}
          onPress={() => navigation.navigate('likeList', { item })}>
          <View>
            <Image
              source={require('../../assets/images/reaction.png')}
              style={{
                height: RfH(20),
                width: RfW(20),
                borderRadius: RfH(30),
                bottom: RfH(5),
              }}
            />
          </View>
          {likeCount > 0 && (
            <View style={{ paddingHorizontal: RfW(5), bottom: RfH(7) }}>
              <Text style={styles.likecountsty}>{likeCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      <View style={styles.likecontainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleLike(item?.id)}
          style={[
            styles.reactioncontainer,
            {
              flexDirection: 'row',
              backgroundColor: isLiked
                ? colors.shadwo_red
                : colors.shadwo_blue,
            },
          ]}>
          <View>
            <Image
              source={require('../../assets/images/thumb.png')}
              tintColor={isLiked ? 'red' : colors.black}
              style={styles.likeimgsty}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Commentscreen', {
              item: item.id,
              discription: item,
            })
          }
          style={[styles.reactioncontainer, { flexDirection: 'row' }]}>
          <View>
            <Image
              source={Commentimg}
              style={[styles.likeimgsty, { marginLeft: 5 }]}
            />
          </View>
          {item?.total_comments ? (
            <View style={{ paddingHorizontal: RfW(5) }}>
              <Text style={styles.likecountsty}>{item?.total_comments}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={shareContent}
          style={styles.reactioncontainer}>
          <Image
            source={require('../../assets/images/share.png')}
            style={styles.shareimgsty}
          />
          {totalShareCount > 0 && (
            <Text
              style={[
                styles.likecountsty,
                { paddingHorizontal: RfW(0), left: 5 },
              ]}>
              {totalShareCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: RfH(8),
    flex: 1,
    marginHorizontal: RfW(6),
  },
  likeimgsty: { height: RfH(21), width: RfW(20), alignSelf: 'center' },
  likecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: RfH(1),
  },
  likecounttxt: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.black,
    lineHeight: 14.06,
    top: 6,
    marginHorizontal: 4,
  },
  likeCountcon: {
    flexDirection: 'row',
  },
  shareimgsty: {
    width: 18,
    height: 17.67,
    alignSelf: 'center',
  },
  likecountsty: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    top: RfH(3),
    color: colors.black,
  },
  reactioncontainer: {
    height: RfH(30),
    width: RfW(80),
    borderRadius: RfH(15),
    backgroundColor: colors.shadwo_blue,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default SocialActivities;