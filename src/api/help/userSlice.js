import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import {userApi} from '../help/Entity'
export const fetchTwentyUsers = createAsyncThunk(
  'users/fetchTwentyUsers',
  async (page, { rejectWithValue }) => {
    try {
      const response = await userApi.getUsers(`page=${page}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adaptUs= createEntityAdapter();

const init = adaptUs.getInitialState({
  allUsers: [],
  allUsersPages: 0,
  twentyUsers: [],
  loading: false,
  error: null,
});

const usersSlice = createSlice({
  name: 'users',
  initialState: init,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTwentyUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTwentyUsers.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload.values || {};
        state.twentyUsers = responseData.data || [];
        state.allUsers = responseData.data || [];
        state.allUsersPages = responseData.meta ? responseData.meta.allPgs : 0;
      })
      .addCase(fetchTwentyUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.twentyUsers = [];
        state.allUsers = [];
        state.allUsersPages = 0;

      });
  },
});

export const select = adaptUs.getSelectors((state) => state.users);

export default usersSlice.reducer;