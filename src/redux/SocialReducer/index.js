import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getKey} from '../../utils/helper';

export const fetchnearbyData = createAsyncThunk(
  'social/fetchnearbyData',
  async () => {
    try {
      const token = await getKey('AuthKey');
      const response = await fetch(
        'https://apis.suniyenetajee.com/api/v1/cms/get-nearby-user/',
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
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw error;
    }
  },
);

export const fetchAdvertisementdata = createAsyncThunk(
  'social/fetchAdvertisementdata',
  async () => {
    try {
      const token = await getKey('AuthKey');
      const response = await fetch(
        'https://apis.suniyenetajee.com/api/v1/master/image-advertisement',
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
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
);

export const RequestCount = createAsyncThunk(
  'social/RequestCount',
  async () => {
    try {
      const token = await getKey('AuthKey');
      const response = await fetch(
        'https://apis.suniyenetajee.com/api/v1/cms/get-request-count/',
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
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
);

const initialState = {
  nearbyData: null,
  advertisementData: null,
  requestcountData: null,
  loading: false,
  error: null,
  isToken: false,
};

const dataSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchnearbyData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchnearbyData.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyData = action.payload;
      })
      .addCase(fetchnearbyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAdvertisementdata.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvertisementdata.fulfilled, (state, action) => {
        state.loading = false;
        state.advertisementData = action.payload;
      })
      .addCase(fetchAdvertisementdata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(RequestCount.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(RequestCount.fulfilled, (state, action) => {
        state.loading = false;
        state.requestcountData = action.payload;
      })
      .addCase(RequestCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
