import React, {useState} from 'react';
import {View, TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {toggleFollowStatus} from '../../../redux/FollowSlice';
import {colors} from '../../../utils';
import styles from './styles';
import {setFollowedUserId} from '../../../redux/DataSource';

const PostActivities = ({item}) => {
  const [loading, setLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const dispatch = useDispatch();
  const {isFollowedUserId} = useSelector(state => state.dataSource);
  const toggleFollow = async () => {
    setLoading(true);
    setIsPending(true);
    try {
      await dispatch(
        toggleFollowStatus({id: item?.created_by?.profile_id}),
      ).unwrap();
      const postItem = [
        {
          id: item?.created_by?.profile_id,
          isPending: true,
        },
      ];
      dispatch(setFollowedUserId(postItem));
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      setLoading(false);
    }
  };
  const getButtonLabel = () => {
    if (loading) {
      return <ActivityIndicator size={'small'} color={colors.WHITE} />;
    }
    if (isPending || item?.is_pending || isFollowedUserId[item?.created_by?.profile_id]?.isPending) {
      return 'Pending';
    }
    if (item?.is_follower) {
      return 'Followers';
    }
    if (item?.is_following) {
      return 'Following';
    }
    return 'Follow';
  };

  const isFollowed = item?.is_following;

  return (
    <View>
      <TouchableOpacity onPress={toggleFollow} disabled={loading}>
        <View
          style={[
            isPending ||
            item?.is_pending ||
            item?.is_follower ||
            item?.is_following
              ? styles.followBtn
              : styles.followBtn2,
          ]}>
          <Text
            style={[
              isPending ||
              item?.is_pending ||
              item?.is_follower ||
              item?.is_following
                ? styles.followtxt
                : {color: colors.black, alignSelf: 'center'},
            ]}>
            {getButtonLabel()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PostActivities;
