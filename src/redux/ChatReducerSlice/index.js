import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getKey } from "../../utils/helper";
import { ToastAndroid } from "react-native";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";

export const fetchchatlist = createAsyncThunk(
  "post/fetchchatlist",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/chat/chat-list/",
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
      // console.log(data ,"bhbbh");

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchchatgrouplist = createAsyncThunk(
  "chat/fetchchatgrouplist",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/chat/group-list/",
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
      const groupdata = await response.json();
      console.log(groupdata, "groupdata");
      return groupdata;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const followerslist = createAsyncThunk(
  "chat/followerslist",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/account/follow-unfollow/?type=follower_detail",
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

export const createGroupChat = createAsyncThunk(
  "chat/createGroupChat",
  async ({ name, participants, image }, { rejectWithValue }) => {
    try {
      const token = await getKey("AuthKey");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("participants", JSON.stringify(participants));
      if (image) {
        formData.append("image", {
          uri: image,
          type: "image/jpeg",
          name: "group_image.jpg",
        });
      }

      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/chat/group-chat/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );
      const data = await response.json();

      if (!response.ok) {
        ToastAndroid.show(data.detail, ToastAndroid.BOTTOM);
        throw new Error("Network response was not ok");
      }
      console.log(data.detail, "Group Created");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const personalmsg = createAsyncThunk(
  "chat/personalmsg",
  async ({ user1, user2, navigation, datas }, { rejectWithValue }) => {
    console.log("bmhhhh", datas);
    // console.log("bmhhhh", user2);
    try {
      const token = await getKey("AuthKey");
      const formData = new FormData();
      formData.append("user1", user1);
      formData.append("user2", user2);
      console.log(formData);
      const response = await fetch(
        "https://stage.suniyenetajee.com/api/v1/chat/personal-chat/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const msgdata = await response.json();
      const combinedData = { ...datas, ...msgdata };
      console.log(datas, "hgbbjh");
      navigation.navigate("ChatScreen", { item: combinedData });
      console.log("parsonal massage created", msgdata);
      return msgdata;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const GroupList = createAsyncThunk(
  "chat/GroupList",
  async (id, { rejectWithValue }) => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/chat/group-detail/${id}/`,
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
      const groupinfo = await response.json();
      return groupinfo;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const Groupmsglisting = createAsyncThunk(
  "chat/Groupmsglisting",
  async (room_id, { rejectWithValue }) => {
    try {
      const token = await getKey("AuthKey");
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/chat/message/?room_id=${room_id}`,
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
      const groupmsg = await response.json();
      return groupmsg;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: [],
  groupdata: [],
  datas: [],
  groupinfo: [],
  groupmsg: [],
  msgdata: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchchatlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchchatlist.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload;
      })
      .addCase(fetchchatlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchchatgrouplist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchchatgrouplist.fulfilled, (state, action) => {
        state.loading = false;
        state.groupdata = action.payload;
      })
      .addCase(fetchchatgrouplist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createGroupChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload;
      })
      .addCase(createGroupChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(followerslist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followerslist.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(followerslist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(personalmsg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(personalmsg.fulfilled, (state, action) => {
        state.loading = false;
        state.msgdata = action.payload;
      })
      .addCase(personalmsg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GroupList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GroupList.fulfilled, (state, action) => {
        state.loading = false;
        state.groupinfo = action.payload;
      })
      .addCase(GroupList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(Groupmsglisting.fulfilled, (state, action) => {
        state.loading = false;
        state.groupmsg = action.payload;
        console.log("Groupmsglisting API was successful:", action.payload);
      })
      .addCase(Groupmsglisting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("Groupmsglisting API failed:", action.payload);
        ToastAndroid.show("Failed to fetch group messages", ToastAndroid.SHORT);
      });
  },
});

export default dataSlice.reducer;
