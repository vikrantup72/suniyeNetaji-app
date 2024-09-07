import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getKey } from "../../utils/helper";
import { ToastAndroid } from "react-native";

export const toggleFollowStatus = createAsyncThunk(
  "follow/toggleFollowStatus",
  async ({ id }) => {
    try {
      const token = await getKey("AuthKey");
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("type", "follow");

      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/account/follow-unfollow/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.status === 200) {
        ToastAndroid.show(result?.Message, ToastAndroid.BOTTOM);
      }

      if (!response.ok) {
        throw new Error(`Failed to toggle follow status: ${result}`);
      }

      return {
        id,
        is_following: result.is_following,
        is_pending: result.is_pending,
      };
    } catch (error) {
      throw error;
    }
  }
);

export const toggleDeclineStatus = createAsyncThunk(
  "follow/toggleDeclineStatus",
  async ({ id }) => {
    console.log(id, "toggleDeclineStatus");
    try {
      const token = await getKey("AuthKey");
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("type", "decline");

      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/account/follow-unfollow/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.status === 200) {
        ToastAndroid.show(result?.Message, ToastAndroid.BOTTOM);
      }
      if (!response.ok) {
        throw new Error(`Failed to toggle decline status: ${result}`);
      }
      return { id };
    } catch (error) {
      throw error;
    }
  }
);

export const toggleAcceptStatus = createAsyncThunk(
  "follow/toggleAcceptStatus",
  async ({ id }) => {
    try {
      const token = await getKey("AuthKey");
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("type", "accept");

      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/account/follow-unfollow/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.status === 200) {
        ToastAndroid.show(result?.Message, ToastAndroid.BOTTOM);
      }

      if (!response.ok) {
        throw new Error(`Failed to toggle accept status: ${result}`);
      }

      return { id };
    } catch (error) {
      throw error;
    }
  }
);


const initialState = {
  datas: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleFollowStatus.pending, (state, action) => {
        const { id } = action.meta.arg;
        const existingFollow = state.datas.find((data) => data.id === id);
        if (existingFollow) {
          existingFollow.is_pending = true;
        } else {
          state.datas.push({
            id,
            is_following: false,
            is_pending: true,
          });
        }
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFollowStatus.fulfilled, (state, action) => {
        const { id, is_following, is_pending } = action.payload;
        const existingFollow = state.datas.find((data) => data.id === id);
        if (existingFollow) {
          existingFollow.is_following = is_following;
          existingFollow.is_pending = is_pending;
        } else {
          state.datas.push({
            id,
            is_following,
            is_pending,
          });
        }
        state.loading = false;
      })
      .addCase(toggleFollowStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(toggleDeclineStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleDeclineStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = state.datas.filter(
          (item) => item.id !== action.payload.id
        );
      })
      .addCase(toggleDeclineStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(toggleAcceptStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleAcceptStatus.fulfilled, (state, action) => {
        state.loading = false;
        // state.datas = state.datas.filter(item => item.id !== action.payload.id);
        state.datas = action.payload;
      })
      .addCase(toggleAcceptStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
  },
});

export default dataSlice.reducer;
