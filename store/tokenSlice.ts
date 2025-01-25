import { createSlice } from '@reduxjs/toolkit';

const initialState = [0, 0, 0, 0];

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    increment: (state, action) => {
      state[action.payload] = Math.min(state[action.payload] + 1, 99);
    },
    decrement: (state, action) => {
      state[action.payload] = Math.max(state[action.payload] - 1, -99);
    },
    reset: () => initialState,
    setToken: (state, action) => {
      // 値を -99 ～ 99 の範囲に収めた上でセット
      state[action.payload.index] = Math.max(Math.min(action.payload.value, 99), -99);
    },
  },
});

export const { increment, decrement, reset, setToken } = tokenSlice.actions;
export default tokenSlice.reducer;
