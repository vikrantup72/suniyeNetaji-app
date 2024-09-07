import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getKey } from "../../utils/helper";
import { ToastAndroid } from "react-native";

export const createDraft = createAsyncThunk(
  "draft/createDraft",
  async (
    { textInputValue, selectedImage, selectedVideo, navigation },
    thunkAPI
  ) => {
    try {
      const formData = new FormData();
      formData.append("description", textInputValue);
      formData.append("status", "draft");

      if (Array.isArray(selectedImage) && selectedImage.length > 0) {
        selectedImage.forEach((image) => {
          formData.append("media", {
            uri: image.path,
            name: image.filename || "image.jpg",
            type: image.mime || "image/jpeg",
          });
        });
      }

      if (selectedVideo && selectedVideo.path) {
        formData.append("video", {
          uri: selectedVideo.path,
          name: selectedVideo.filename || "video.mp4",
          type: selectedVideo.mime || "video/mp4",
        });
      }

      const token = await getKey("AuthKey");
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/cms/create-post/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create draft");
      }

      const responseData = await response.json();
      console.log(responseData, "responseDatahxxhvch");
      return responseData;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchdraftData = createAsyncThunk(
  "draft/fetchdraftData",
  async (_, thunkAPI) => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/cms/post/draft",
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
        throw new Error("Failed to fetch draft data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteDraftPost = createAsyncThunk(
  "draft/deleteDraftPost",
  async (id, thunkAPI) => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/post/delete-draft/${id}/`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete draft post");
      }

      ToastAndroid.show(
        "Draft-Post deleted successfully.",
        ToastAndroid.BOTTOM
      );
      return { id };
    } catch (error) {
      throw error;
    }
  }
);
export const updateDraftPost = createAsyncThunk(
  "draft/updateDraftPost",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (updatedData?.description) {
        formData.append("description", updatedData.description);
      }
      if (updatedData?.banner_image) {
        formData.append("banner_image", {
          uri: updatedData?.banner_image,
          type: "image/jpeg",
          name: "image.jpg",
        });
      }
      if (updatedData?.video) {
        formData.append("video", {
          uri: updatedData?.video,
          type: "video/mp4",
          name: "video.mp4",
        });
      }
      formData.append("status", "publish");

      const token = await getKey("AuthKey");
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/post/update-draft/${id}/`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update post");
      }

      const data = await response.json();
      ToastAndroid.show("Post updated successfully.", ToastAndroid.BOTTOM);
      return data;
    } catch (error) {
      console.error("Failed to update post:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "draft",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchdraftData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchdraftData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.results || [];
      })
      .addCase(fetchdraftData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteDraftPost.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteDraftPost.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.data)) {
          state.data = state.data.filter(
            (draft) => draft.id !== action.payload.id
          );
        }
      })
      .addCase(deleteDraftPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateDraftPost.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateDraftPost.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.map((draft) =>
          draft.id === action.payload.id ? action.payload : draft
        );
      })
      .addCase(updateDraftPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
