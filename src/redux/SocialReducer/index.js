import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getKey } from "../../utils/helper";
import { ToastAndroid } from "react-native";

// Fetch nearby data
export const fetchnearbyData = createAsyncThunk(
  "social/fetchnearbyData",
  async () => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/cms/get-nearby-user/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  }
);

// Fetch advertisement data
export const fetchAdvertisementdata = createAsyncThunk(
  "social/fetchAdvertisementdata",
  async () => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/master/image-advertisement",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  }
);

// Fetch request count
export const RequestCount = createAsyncThunk(
  "social/RequestCount",
  async () => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/cms/get-request-count/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  }
);
export const notificationStatusUpdate = createAsyncThunk(
  "social/notificationStatusUpdate",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/notification/in-app-notification/update-status/",
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      ToastAndroid.show(data.message, ToastAndroid.BOTTOM);
      

      await dispatch(RequestCount());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
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
  name: "social",
  initialState,
  reducers: {
    updateRequestCount(state, action) {
      state.requestcountData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchnearbyData.pending, (state) => {
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
      .addCase(fetchAdvertisementdata.pending, (state) => {
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
      .addCase(RequestCount.pending, (state) => {
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
      })
      .addCase(notificationStatusUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(notificationStatusUpdate.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally handle notification status update if needed
      })
      .addCase(notificationStatusUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateRequestCount } = dataSlice.actions;

export default dataSlice.reducer;

