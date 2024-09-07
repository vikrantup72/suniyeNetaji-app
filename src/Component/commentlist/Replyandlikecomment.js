import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {RfH, RfW, getKey} from '../../utils/helper';
import {colors} from '../../utils';

const Replyandlikecomment = ({item, onVisibleModal}) => {
  const {id, is_like, total_likes} = item;
  const [isLiked, setIsLiked] = useState(is_like);
  const [likeCount, setLikeCount] = useState(total_likes || 0);

  const commentAction = async () => {
    try {
      const action = !isLiked ? 'like' : 'dislike';
      const token = await getKey('AuthKey');
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/comment/like-dislike/${id}/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({action}),
        },
      );

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikeCount(prevCount =>
          action === 'like' ? prevCount + 1 : prevCount - 1,
        );
        console.log(`Post ${!isLiked ? 'liked' : 'disliked'} successfully`);
      } else {
        console.error('Error liking post:', response.status);
      }
    } catch (error) {
      console.error('Error liking post:', error.message);
    }
  };

  const openReplySheet = () => {
    onVisibleModal(true, item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={commentAction} style={styles.likeContainer}>
          <View style={styles.center}>
            <Text
              style={[
                styles.likeText,
                {color: isLiked ? 'red' : colors.DARK_GRAY},
              ]}>
              Like .
            </Text>
          </View>
          {likeCount > 0 && (
            <View style={[styles.center, styles.likeCount]}>
              <Text style={{color: colors.DARK_GRAY}}>{likeCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.separator}></View>

        <TouchableOpacity
          onPress={openReplySheet}
          style={[styles.likeContainer, styles.viewAll]}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Replyandlikecomment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  likeContainer: {
    borderColor: colors.LIGHT_BLACK,
    height: RfH(27),
    borderRadius: RfH(10),
    marginTop: RfH(10),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  separator: {
    borderWidth: 0.2,
    height: RfH(25),
    top: RfH(10),
    marginHorizontal: 5,
  },
  likeText: {
    fontSize: 15,
  },
  likeCount: {
    paddingHorizontal: RfW(5),
  },
  center: {
    justifyContent: 'center',
  },
  viewAll: {
    marginHorizontal: RfW(10),
  },
  viewAllText: {
    fontSize: 14,
    color: colors.DARK_GRAY,
    top: RfH(3),
  },
});
