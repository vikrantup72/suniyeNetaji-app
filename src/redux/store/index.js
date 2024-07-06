// store.js
import {configureStore} from '@reduxjs/toolkit';
import PostReducer from '../PostReducer';
import ProfileSlice from '../ProfileSlice';
import ChangePasswordSlice from '../ChangePasswordSlice';
import PollReducer from '../PollReducer';
import FollowSlice from '../FollowSlice';
import SocialReducer from '../SocialReducer';
import DataSource from '../DataSource';
import ExperienceSlice from '../ExperienceSlice';
import DraftSlice from '../DraftSlice';

const store = configureStore({
  reducer: {
    post: PostReducer,
    profile: ProfileSlice,
    updatepassword: ChangePasswordSlice,
    poll: PollReducer,
    follow: FollowSlice,
    social: SocialReducer,
    dataSource:DataSource,
    experience:ExperienceSlice,
    draft: DraftSlice,
  },
});

export default store;
