import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: number[] = [];

const winnerSlice = createSlice({
  name: 'winner',
  initialState,
  reducers: {
    setPlayerWins: (state, action: PayloadAction<{ index: number; value: number }>) => {
      state[action.payload.index] = action.payload.value;
    },
    resetPlayerWins: (state, action: PayloadAction<number>) => {
      return new Array(action.payload).fill(0);
    },
  },
});

export const { setPlayerWins, resetPlayerWins } = winnerSlice.actions;
export default winnerSlice.reducer;
