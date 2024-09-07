import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getKey} from '../../utils/helper';
import {ToastAndroid} from 'react-native';

export const createComment = createAsyncThunk(
  'comment/createComment',
  async ({comment, item}, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('comment', comment);
      formData.append('post', item);

      const token = await getKey('AuthKey');
      const response = await fetch(
        'https://stage.suniyenetajee.com/api/v1/cms/comment/',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
          body: formData,
        },
      );
      console.log(response, 'jbknkn');
      const responseData = await response.json();
      if (response.ok) {
        console.log('Comment API response:', responseData);
        return responseData;
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      throw error;
    }
  },
);

export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async ({id, postId}, thunkAPI) => {
    try {
      const token = await getKey('AuthKey');
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/comment/delete/${id}/`,
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
        console.log('comment/delete', id);
        return postId;
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      throw error;
    }
  },
);

export const updateComment = createAsyncThunk(
  'post/updateComment',
  async ({id, comment, navigation}, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('comment', comment);
      // formData.append('status', 'publish');

      console.log('FormData:', formData);
      const token = await getKey('AuthKey');
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/comment/${id}/`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
          body: formData,
        },
      );
      const responseData = await response.json();
      if (response.ok) {
        console.log('updateComment API response:', responseData);
        ToastAndroid.show('edit comment', ToastAndroid.BOTTOM);
        return responseData;
      } else {
        console.log('Error handling commentss');
        throw new Error('API error');
      }
    } catch (error) {
      throw error;
    }
  },
);

export const updateReplyComment = createAsyncThunk(
  'post/updateReplyComment',
  async ({id, message, navigation}, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('message', message);
      console.log('FormData:', formData);
      const token = await getKey('AuthKey');
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/comment-reply/${id}/`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
          body: formData,
        },
      );
      const responseData = await response.json();
      if (response.ok) {
        console.log('updateReplyComment API response:', responseData);
        ToastAndroid.show('edit comment', ToastAndroid.BOTTOM);
        return responseData;
      } else {
        console.log('Error handling commentss');
        throw new Error('API error');
      }
    } catch (error) {
      throw error;
    }
  },
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createComment.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteComment.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(
          comment => comment.id !== action.payload,
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateReplyComment.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReplyComment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateReplyComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default commentsSlice.reducer;
