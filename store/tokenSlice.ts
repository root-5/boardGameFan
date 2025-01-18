import { createSlice } from '@reduxjs/toolkit';

const initialState = [0, 0, 0, 0];

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    reset: () => initialState,
    setToken: (state, action) => {
      // 値を -99 ～ 99 の範囲に収めた上でセット
      state[action.payload.index] = Math.max(Math.min(action.payload.value, 99), -99);
    },
  },
});

export const { reset, setToken } = tokenSlice.actions;
export default tokenSlice.reducer;
