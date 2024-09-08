import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getKey } from "../../utils/helper";
import { ToastAndroid } from "react-native";
import { addHomeDashboardData, addToDataSource } from "../DataSource";

// Fetch Data
export const fetchData = createAsyncThunk("post/fetchData", async (dispath) => {
  try {
    const token = await getKey("AuthKey");
    const response = await fetch(
      "https://stage.suniyenetajee.com/api/v1/cms/post/",
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
    console.log(data,"data===>");
    return data;
  } catch (error) {
    console.log(error, "fetch Post error");
    throw error;
  }
});

// Delete Post
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (id, thunkAPI) => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/post/delete/${id}/`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.ok) {
        ToastAndroid.show("Post deleted successfully.", ToastAndroid.BOTTOM);
        return { id };
      } else {
        throw new Error("API error");
      }
    } catch (error) {
      throw error;
    }
  }
);

// Create Post
export const createPost = createAsyncThunk(
  "post/createPost",
  async (
    { textInputValue, selectedImage, selectedVideo, navigation },
    thunkAPI
  ) => {
    try {
      const formData = new FormData();
      formData.append("description", textInputValue);
      formData.append("status", "publish");

      // Check if `selectedImage` is an array and append each image
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
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData, "responseDatancvvhvchsav");

        ToastAndroid.show("Post Uploaded", ToastAndroid.BOTTOM);
        navigation.navigate("Home", { item: responseData });
        return responseData;
      } else {
        console.log("error");
        throw new Error("API error");
      }
    } catch (error) {
      throw error;
    }
  }
);

// Update Post
export const updatePost = createAsyncThunk(
  "post/updatePost",
  async (
    { id, textInputValue, selectedImage, selectedVideo, navigation },
    thunkAPI
  ) => {
    try {
      const formData = new FormData();
      formData.append("description", textInputValue);
      formData.append("status", "publish");

      // if (selectedImage && selectedImage.path) {
      //   formData.append("banner_image", {
      //     uri: selectedImage.path,
      //     name: selectedImage.filename || "image.jpg",
      //     type: selectedImage.mime || "image/jpeg",
      //   });
      // }

      if (selectedVideo && selectedVideo.path) {
        formData.append("video", {
          uri: selectedVideo.path,
          name: selectedVideo.filename || "video.mp4",
          type: selectedVideo.mime || "video/mp4",
        });
      }

      const token = await getKey("AuthKey");
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/update-post/${id}/`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        ToastAndroid.show("Post Edit Successful", ToastAndroid.BOTTOM);
        await thunkAPI.dispatch(fetchData());
        navigation.navigate("Home", { item: responseData });
        return responseData;
      } else {
        throw new Error("API error");
      }
    } catch (error) {
      throw error;
    }
  }
);

// Share Post
export const SharePost = createAsyncThunk(
  "post/SharePost",
  async ({ id }, thunkAPI) => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/cms/post/share/${id}/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        await thunkAPI.dispatch(fetchData());
        console.log(responseData, "responseData");
        return responseData;
      } else {
        throw new Error("API error");
      }
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...state.data, action.payload];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((post) => post.id !== action.payload.id);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.map((post) =>
          post.id === action.payload.id ? action.payload : post
        );
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(SharePost.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(SharePost.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...state.data, action.payload];
      })
      .addCase(SharePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
