import { configureStore , getDefaultMiddleware } from '@reduxjs/toolkit';
import postsReducer from './postSlice';
import athRed from './athRed';
import userReducer from './userSlice';

const initialState = {
  style: localStorage.getItem('style') || 'normal'
};

const styleRreducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_STYLE':
      return {
        ...state,
        style: action.payload,
      };
    default:
      return state;
  }
};


const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: athRed,
    users: userReducer,
    style: styleRreducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;