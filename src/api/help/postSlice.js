import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { postApi } from '../help/Entity'; 

export const fetchTwentyPosts = createAsyncThunk(
  'posts/fetchTwentyPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postApi.getPosts('page=1');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPersonalPosts = createAsyncThunk(
  'posts/personalPosts', async ({ id }) => {
  // console.log('fetch', page, id)
  const response = await postApi.getPostsUser(id);
  return response.data;
})

const adaptPost = createEntityAdapter();

const init = adaptPost.getInitialState({
  allPosts: [],
  allPostsPages: 0,
  twentyPosts: [],
  loading: false,
  error: null,
  postUs: [],
});


const postsSlice = createSlice({
  name: 'posts',
  initialState: init,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTwentyPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTwentyPosts.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload.values || {};
        state.twentyPosts = responseData.data || [];
        state.allPosts = responseData.data || [];
        state.allPostsPages = responseData.meta ? responseData.meta.allPgs : 0;
      })
      .addCase(fetchTwentyPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.twentyPosts = [];
        state.allPosts = [];
        state.allPostsPages = 0;
      })
      .addCase(fetchPersonalPosts.fulfilled, (state, { payload }) => {
        state.postUs = payload.values.data;
        state.loading = false;

    })
    .addCase(fetchPersonalPosts.pending, (state, { payload }) => {
        state.loading = true;

    })
    .addCase(fetchPersonalPosts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = 'Error load post try later :(';

    });
  },
});

export const select = adaptPost.getSelectors((state) => state.posts);

export default postsSlice.reducer;