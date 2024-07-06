import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getKey} from '../../utils/helper';
import {ToastAndroid} from 'react-native';

export const fetchPollData = createAsyncThunk(
  'post/fetchPollData',
  async () => {
    try {
      const token = await getKey('AuthKey');
      const response = await fetch(
        'https://apis.suniyenetajee.com/api/v1/polling/voted-polling/',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const poll = await response.json();
      console.log('gyjbvhy', poll);
      return poll;
    } catch (error) {
      throw error;
    }
  },
);

const initialState = {
  poll: null,
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPollData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPollData.fulfilled, (state, action) => {
        state.loading = false;
        state.poll = action.payload;
      })
      .addCase(fetchPollData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
