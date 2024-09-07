import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {BottomSheet} from 'react-native-btr';
import {useDispatch} from 'react-redux';
import {RfH, RfW, getKey} from '../../utils/helper';
import {colors} from '../../utils';
import styles from './styles';
import ReplyCommentActivity from './ReplyCommentActivity';
import {updateReplyComment} from '../../redux/Comment';
import {useIsFocused} from '@react-navigation/native';

const ReplyBottomSheet = ({isVisible, onClose, selectedItem}) => {
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const comment = selectedItem?.id;
  const id = selectedItem?.id;
  const [message, setMessage] = useState('');
  const [replydata, setReplydata] = useState([]);
  // console.log(replydata,"replydata");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [editCommentId, setEditCommentId] = useState(null);
  const [isLoader, setLoader] = useState(false);
  const focused = useIsFocused();
  useEffect(() => {
    fetchReplyData();
  }, [focused, isVisible]);
  const handleInputChange = text => {
    setMessage(text);
    setIsTyping(text !== '');
    setButtonDisabled(text.trim().length === 0);
  };

  const handleReply = async () => {
    Keyboard.dismiss(); // Dismiss the keyboard
    setIsTyping(false);
    setLoading(true);
    setButtonDisabled(true);
    try {
      let token = await getKey('AuthKey');
      token = token.trim();
      const formData = new FormData();
      formData.append('comment', comment);
      formData.append('message', message);

      if (isEditing) {
        formData.append('comment_id', editCommentId);
      }

      const response = await fetch(
        'https://stage.suniyenetajee.com/api/v1/cms/comment-reply/',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log('API response:', responseData);
        fetchReplyData();
        setMessage('');
        setIsEditing(false);
        setEditCommentId(null);
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      console.error('API error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplyData = async () => {
    if (!id) {
      return null;
    }
    try {
      setLoader(true);
      let token = await getKey('AuthKey');
      token = token.trim();
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/comment-reply/reply/${id}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response, 'response==>');
      if (response.ok) {
        const res = await response.json();
        console.log(res, 'hbjb');
        setReplydata(res);
        setLoader(false);
      } else {
        console.error('Failed to fetch reply data:', response.statusText);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error fetching reply data:', error.message);
    }
  };

  const deleteComment = id => {
    setReplydata(replydata.filter(comment => comment.id !== id));
  };

  const handleEdit = item => {
    console.log('Editing item:', item);
    setMessage(item?.message);
    setIsEditing(true);
    setEditCommentId(item?.id);
    setButtonDisabled(false);
  };

  const handleReplyEdit = async () => {
    Keyboard.dismiss();
    try {
      await dispatch(updateReplyComment({id: editCommentId, message})).unwrap();
      fetchReplyData();
      setMessage('');
      setIsEditing(false);
      setEditCommentId(null);
    } catch (error) {
      console.error('Failed to update reply comment:', error.message);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const ListHeaderItem = () => {
    return (
      <View>
        <Text style={styles.repliessty}>
          Replies to the{' '}
          <Text style={{fontFamily: 'Poppins-Medium'}}>
            {selectedItem?.created_by?.full_name?.length > 15
              ? `${selectedItem.created_by.full_name.slice(0, 15)}...`
              : selectedItem.created_by.full_name}
          </Text>{' '}
          comment on this post.
        </Text>
        <View style={{marginVertical: RfH(10), marginBottom: RfH(15)}}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.imgcontainer}>
              <Image
                source={{
                  uri: `https://stage.suniyenetajee.com${selectedItem?.created_by?.picture}`,
                }}
                style={{
                  height: RfH(34),
                  width: RfW(34),
                  borderRadius: RfH(16),
                  alignSelf: 'center',
                  resizeMode: 'cover',
                }}
              />
            </View>
            <View style={styles.msgcontainer}>
              <View style={{paddingVertical: RfH(5)}}>
                <Text style={styles.nametxtsty}>
                  {selectedItem?.created_by?.full_name?.length > 15
                    ? `${selectedItem.created_by.full_name.slice(0, 15)}..`
                    : selectedItem.created_by.full_name}
                </Text>
              </View>
              <View style={{bottom: RfH(6), width: '100%'}}>
                <Text style={styles.msgtxtsty}>{selectedItem?.comment}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderListItem = ({item, index}) => {
    console.log(item, 'hcjvhjgvh');
    return (
      <View
        style={{
          marginVertical: RfH(5),
          marginBottom: index === replydata.length - 1 ? RfH(20) : 0,
        }}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.imgcontainer}>
              <Image
                source={{
                  uri: `https://stage.suniyenetajee.com${item?.created_by?.picture}`,
                }}
                style={{
                  height: RfH(34),
                  width: RfW(34),
                  borderRadius: RfH(16),
                  alignSelf: 'center',
                  resizeMode: 'cover',
                }}
              />
            </View>
            <View
              style={[
                styles.msgcontainer,
                {
                  backgroundColor: colors.LIGHT_GRAY,
                  borderWidth: 1,
                  borderColor: colors.LIGHT_BLACK,
                },
              ]}>
              <View style={{paddingVertical: RfH(5)}}>
                <Text style={styles.nametxtsty}>
                  {item?.created_by?.full_name?.length > 15
                    ? `${item.created_by.full_name.slice(0, 15)}...`
                    : item.created_by.full_name}
                </Text>
              </View>
              <View style={{bottom: RfH(6), width: '100%'}}>
                <Text style={styles.msgtxtsty}>{item?.message}</Text>
              </View>
              <View>
                <ReplyCommentActivity
                  item={item}
                  onDelete={deleteComment}
                  onEdit={() => handleEdit(item)}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderNoRepliesMessage = () => {
    if (isLoader) {
      return <ActivityIndicator size={'small'} color={'skyblue'} />;
    }
    if (replydata.length === 0) {
      return (
        <View style={styles.noRepliesContainer}>
          <Text style={styles.noRepliesText}>
            There has been no reply to this comment
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <BottomSheet
      visible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}>
      <>
        <View style={styles.container}>
          <FlatList
            data={replydata}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={ListHeaderItem}
            renderItem={renderListItem}
            ListEmptyComponent={renderNoRepliesMessage}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: RfH(0),
            alignSelf: 'center',
            flexDirection: 'row',
            backgroundColor: colors.WHITE,
            paddingVertical: RfH(5),
          }}>
          <View style={[styles.inputcontainer, {width: RfW(280)}]}>
            <TextInput
              placeholder="reply here....."
              value={message}
              onChangeText={handleInputChange}
              placeholderTextColor={colors.DARK_GRAY}
              ref={inputRef}
              autoFocus={false}
              style={styles.inputtxtsty}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={
              isEditing && !buttonDisabled ? handleReplyEdit : handleReply
            }
            style={[styles.postbtnsty, {opacity: !buttonDisabled ? 1 : 0.5}]}
            disabled={buttonDisabled}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.PRIMARY} />
            ) : (
              <Text style={styles.posttxt}>{isEditing ? 'Edit' : 'Post'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </>
    </BottomSheet>
  );
};

export default ReplyBottomSheet;
