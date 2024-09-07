import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RfH, RfW, getKey, getUserId} from '../../utils/helper';
import {colors} from '../../utils';
import Icon from 'react-native-vector-icons/AntDesign';
import {useDispatch} from 'react-redux';

const ReplyCommentActivity = ({item, onDelete, onEdit}) => {
  // console.log(item, 'ReplyCommentActivity');
  const [isDeleting, setIsDeleting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLiked, setIsLiked] = useState(item?.is_like);
  const [likeCount, setLikeCount] = useState(item?.total_likes || 0);
  console.log(userId, 'bjgygy');

  const id = item?.id;
  const dispatch = useDispatch();

  useEffect(() => {
    getUserId("ReplyComment")
      .then(userId => {
        setUserId(userId);
      })
      .catch(error => {
        console.error('Error getting user ID:', error);
      });
  }, [dispatch]);

  const handleDelete = async () => {
    try {
      if (!id) {
        throw new Error('Invalid Comment ID');
      }
      setIsDeleting(true);
      const token = await getKey('AuthKey');
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/comment-reply/delete/${id}/`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      if (response.ok) {
        console.log('ReplyComment deleted successfully');
        onDelete(id);
      } else {
        console.log('Error', 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Delete comment error:', error);
      ToastAndroid.show('Failed to delete comment.', ToastAndroid.BOTTOM);
    } finally {
      setIsDeleting(false);
    }
  };

  const ReplycommentAction = async () => {
    try {
      const action = !isLiked ? 'like' : 'dislike';
      const token = await getKey('AuthKey');
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/comment-reply/like-dislike/${id}/`,
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
        console.log(`Comment ${!isLiked ? 'liked' : 'disliked'} successfully`);
      } else {
        console.error('Error liking comment:', response.status);
      }
    } catch (error) {
      console.error('Error liking comment:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={ReplycommentAction}
          style={styles.likecontainer}>
          <Text
            style={{fontSize: 14, color: isLiked ? 'red' : colors.DARK_GRAY}}>
            Like .
          </Text>
          {likeCount > 0 && (
            <Text style={{color: colors.DARK_GRAY}}>{likeCount}</Text>
          )}
        </TouchableOpacity>

        {userId == item?.created_by?.user_id ? (
          <>
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deletecon}
              disabled={isDeleting}>
              <Icon name={'delete'} size={15} color={colors.black} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onEdit}
              style={[styles.deletecon, {marginHorizontal: RfW(10)}]}
              disabled={isDeleting}>
              <Icon name={'edit'} size={15} color={colors.black} />
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </View>
  );
};

export default ReplyCommentActivity;

const styles = StyleSheet.create({
  container: {
    marginVertical: RfH(5),
  },
  txtsty: {
    color: colors.DARK_GRAY,
    fontFamily: 'Poppins-Regular',
  },
  deletecon: {
    left: RfW(15),
    borderWidth: 0.5,
    paddingHorizontal: RfW(8),
    borderRadius: 5,
    justifyContent: 'center',
    bottom: RfH(2),
  },
  likecontainer: {
    paddingHorizontal: RfW(10),
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: colors.shadwo_red,
    flexDirection: 'row',
  },
});
