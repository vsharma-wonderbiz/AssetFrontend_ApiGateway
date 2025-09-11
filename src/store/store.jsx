import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';

export const store = configureStore({
  reducer: {
    user: userReducer, // add more slices here if needed
  },
});
