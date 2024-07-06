import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {ToastAndroid} from 'react-native';

// Reset Password

export const ResetPassword = createAsyncThunk(
  'UpdatePassword/ResetPassword',
  async ({username, navigation}, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('type', 'forgot');
      const response = await fetch(
        'https://apis.suniyenetajee.com/api/v1/account/otp-resend/',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        },
      );
      const responseData = await response.json();
      if (response.ok) {
        console.log('API response:', responseData);
        ToastAndroid.show(responseData?.message, ToastAndroid.BOTTOM);
        return responseData;
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      throw error;
    }
  },
);

// Change Password

export const ChangePasswords = createAsyncThunk(
  'UpdatePassword/ChangePasswords',
  async ({password, confirm_password, username}, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('password', password);
      formData.append('confirm_password', confirm_password);
      formData.append('username', username);
      formData.append('type', 'forgot');
      const response = await fetch(
        'https://apis.suniyenetajee.com/api/v1/account/change-password/',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        },
      );
      const responseData = await response.json();
      if (response.ok) {
        console.log('API response:', responseData);
        ToastAndroid.show(responseData?.message, ToastAndroid.BOTTOM);
        return responseData;
      } else {
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

const dataSlice = createSlice({
  name: 'UpdatePassword',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(ResetPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ResetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(ResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(ChangePasswords.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ChangePasswords.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(ChangePasswords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
