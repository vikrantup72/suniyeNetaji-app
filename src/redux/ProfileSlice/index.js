import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getKey} from '../../utils/helper';

export const GetProfile = createAsyncThunk(
  'profile/GetProfile',
  async userid => {
    try {
      const token = await getKey('AuthKey');
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/account/get-profile/${userid}/`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      const datas = await response.json();
      console.log(datas, 'bhhbhbhh');
      return datas;
    } catch (error) {
      throw error;
    }
  },
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (
    {
      first_name,
      last_name,
      phone_number,
      email,
      date_of_birth,
      location,
      gender,
      selectedImage,
    },
    thunkAPI,
  ) => {
    try {
      const formData = new FormData();
      formData.append('first_name', first_name);
      formData.append('last_name', last_name);
      formData.append('phone_number', phone_number);
      formData.append('email', email);
      formData.append('date_of_birth', date_of_birth);
      formData.append('location', location);
      formData.append('gender', gender);
      if (selectedImage && selectedImage.uri) {
        formData.append('picture', {
          uri: selectedImage.uri,
          name: selectedImage.fileName,
          type: selectedImage.type,
        });
      }
      const token = await getKey('AuthKey');
      console.log(token, 'updateprofile');
      const response = await fetch(
        'https://stage.suniyenetajee.com/api/v1/account/profile/',
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
        console.log('update profile API response:', responseData);
        return responseData;
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      throw error;
    }
  },
);

export const fetchProfileData = createAsyncThunk(
  'profile/fetchProfileData',
  async () => {
    try {
      const token = await getKey('AuthKey');
      const response = await fetch(
        'https://stage.suniyenetajee.com/api/v1/account/profile/',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      const data = await response.json();
      console.log(data, 'fetchProfileData');
      return data;
    } catch (error) {
      throw error;
    }
  },
);

export const setToken = createAsyncThunk('profile/setToken', async data => {
  return data;
});

const initialState = {
  datas: null,
  loading: false,
  error: null,
  isToken: false,
};

const dataSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(GetProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload;
      })
      .addCase(GetProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(setToken.pending, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(setToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isToken = action.payload;
      })
      .addCase(setToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProfileData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
