import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getKey } from "../../utils/helper";

export const fetchAllNotification = createAsyncThunk(
  "notification/fetchAllNotification",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/notification/in-app-notification/list-notification",
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
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



const initialState = {
  data: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
  },
});

export default notificationSlice.reducer;
