import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  role: '',
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { username, role } = action.payload;
      state.username = username;
      state.role = role;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.username = '';
      state.role = '';
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
