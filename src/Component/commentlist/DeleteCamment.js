import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Alert, ToastAndroid} from 'react-native';
import {BottomSheet} from 'react-native-btr';
import {RfH, RfW, getKey} from '../../utils/helper';
import {colors} from '../../utils';
import styles from './styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import {deleteComment} from '../../redux/Comment';
import {useNavigation} from '@react-navigation/native';

const DeleteCamment = ({
  isVisible,
  onClose,
  selectedItem,
  onDelete,
  onEdit,
  postId
}) => {
  const navigation = useNavigation();
  const id = selectedItem?.id;
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      if (!id) {
        throw new Error('Invalid Comment ID');
      }
      await dispatch(deleteComment({id:id, postId:postId})).unwrap();
      ToastAndroid.show('Comment Deleted successfully.', ToastAndroid.BOTTOM);
      onClose();
      onDelete(id);
    } catch (error) {
      console.error('Delete comment error:', error);
      Alert.alert('Error', error.message || 'Failed to delete comment');
    }
  };

  return (
    <BottomSheet
      visible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}>
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderTopRightRadius: RfH(20),
          borderTopLeftRadius: RfH(25),
          paddingVertical: RfH(20),
        }}>
        <View>
          <View>
            <TouchableOpacity
              style={styles.bottombtncon}
              onPress={handleDelete}>
              <View>
                <AntDesign
                  name={'delete'}
                  size={20}
                  color={colors.black}
                  style={{top: RfH(8)}}
                />
              </View>
              <View style={{left: RfW(12)}}>
                <Text style={styles.btntxt}>Delete</Text>
                <Text style={styles.disbtntxt}>
                  This Post will be delete permamentlly
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onClose();
                onEdit();
              }}
              style={[styles.bottombtncon, {marginVertical: RfH(10)}]}>
              <View>
                <Feather
                  name={'edit'}
                  size={22}
                  color={colors.black}
                  style={{top: RfH(6)}}
                />
              </View>
              <View style={{left: RfW(12)}}>
                <Text style={styles.btntxt}>Edit</Text>
                <Text style={styles.disbtntxt}>Click for caption or image</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

export default DeleteCamment;
