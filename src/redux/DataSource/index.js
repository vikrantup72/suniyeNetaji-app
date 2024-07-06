import {createSlice} from '@reduxjs/toolkit';
import {createComment, deleteComment} from '../Comment';
import {fetchData} from '../PostReducer';

const initialState = {
  mainDataSource: {},
  profileData: [],
  HomeDashboardData: [],
  isFollowedUserId: {},
  loading: false,
  error: null,
  isToken: false,
};

const dataSource = createSlice({
  name: 'dataSource',
  initialState,
  reducers: {
    addToDataSource: (state, action) => {
      const newData = action.payload;

      const newDataById = newData.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      state.mainDataSource = {
        ...state.mainDataSource,
        ...newDataById,
      };
    },
    setFollowedUserId: (state, action) => {
      const newData = action.payload;
      console.log(newData, 'newdata');
      const newDataById = newData.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      state.isFollowedUserId = {
        ...state.isFollowedUserId,
        ...newDataById,
      };
    },
    addProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    addHomeDashboardData: (state, action) => {
      state.HomeDashboardData = action.payload;
    },
    likePost: (state, action) => {
      const {id} = action.payload;
      if (state.mainDataSource[id]) {
        state.mainDataSource[id].total_likes_count += 1;
        state.mainDataSource[id].is_like = true;
      }
    },
    dislikePost: (state, action) => {
      const {id} = action.payload;
      if (
        state.mainDataSource[id] &&
        state.mainDataSource[id].total_likes_count > 0
      ) {
        state.mainDataSource[id].total_likes_count -= 1;
        state.mainDataSource[id].is_like = false;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createComment.fulfilled, (state, action) => {
        const {post} = action.payload;
        if (state.mainDataSource[post]) {
          state.mainDataSource[post].total_comments += 1;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const id = action.payload;
        if (
          state.mainDataSource[id] &&
          state.mainDataSource[id].total_comments > 0
        ) {
          state.mainDataSource[id].total_comments -= 1;
        }
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        const newData = action.payload;

        const newDataById = newData.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});

        state.mainDataSource = {
          ...state.mainDataSource,
          ...newDataById,
        };
        const newIds = action.payload.map(post => post.id);
        state.HomeDashboardData = newIds;
      });
  },
});

export const {
  addToDataSource,
  addProfileData,
  addHomeDashboardData,
  likePost,
  dislikePost,
  setFollowedUserId,
} = dataSource.actions;
export default dataSource.reducer;
