import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getKey} from '../../utils/helper';
import {ToastAndroid} from 'react-native';

export const fetchExperienceData = createAsyncThunk(
  'experience/fetchExperienceData',
  async () => {
    try {
      const token = await getKey('AuthKey');
      const response = await fetch(
        'https://apis.suniyenetajee.com/api/v1/account/experience/',
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

export const createExperience = createAsyncThunk(
  'experience/createExperience',
  async ({navigation, title, start_date, company, end_date, description,currently_working}, {dispatch}) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('start_date', start_date);
      formData.append('company', company);
      formData.append('end_date', end_date);
      formData.append('description', description);
      formData.append('currently_working', currently_working);
      const token = await getKey('AuthKey');
      const response = await fetch(
        'https://apis.suniyenetajee.com/api/v1/account/experience/',
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
        ToastAndroid.show('Experience added', ToastAndroid.BOTTOM);
        navigation.navigate('EditProfileScreen');
        dispatch(fetchExperienceData());
        return responseData;
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      throw error;
    }
  },
);

export const deleteExperience = createAsyncThunk(
  'experience/deleteExperience',
  async (id, {dispatch}) => {
    try {
      const token = await getKey('AuthKey');
      const response = await fetch(
        `https://apis.suniyenetajee.com/api/v1/account/experience/${id}/`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      ToastAndroid.show('Experience removed', ToastAndroid.BOTTOM);
      dispatch(fetchExperienceData());
      return id;
    } catch (error) {
      throw error;
    }
  },
);

export const updateExperience = createAsyncThunk(
  'experience/updateExperience',
  async ({id, navigation, title, start_date, company, end_date, description}, {dispatch}) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('start_date', start_date);
      formData.append('company', company);
      formData.append('end_date', end_date);
      formData.append('description', description);
      const token = await getKey('AuthKey');
      const response = await fetch(
        `https://apis.suniyenetajee.com/api/v1/account/experience/${id}/`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        const responseData = await response.json();
        dispatch(fetchExperienceData());
        navigation.navigate('EditProfileScreen');
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
  experiencedata: [],
  loading: false,
  error: null,
};

const experiencedataSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.experiencedata = [...state.experiencedata, action.payload];
      })
      .addCase(createExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchExperienceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperienceData.fulfilled, (state, action) => {
        state.loading = false;
        state.experiencedata = action.payload;
      })
      .addCase(fetchExperienceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.experiencedata = state.experiencedata.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.experiencedata = state.experiencedata.map((experience) =>
          experience.id === action.payload.id ? action.payload : experience
        );
      })
      .addCase(updateExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default experiencedataSlice.reducer;
