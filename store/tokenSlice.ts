import { createSlice } from '@reduxjs/toolkit';

const initialState = [0, 0, 0, 0];

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    reset: () => initialState,
    setToken: (state, action) => {
      state[action.payload.index] = Math.max(Math.min(action.payload.value, 99), -99);
    },
  },
});

export const { reset, setToken } = tokenSlice.actions;
export default tokenSlice.reducer;
