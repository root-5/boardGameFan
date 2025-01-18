import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Euler } from 'three';

interface RouletteState {
  rotation: Euler;
  isSpinning: boolean;
}

const initialState: RouletteState = {
  rotation: new Euler(0, 0, 0),
  isSpinning: false,
};

const rouletteSlice = createSlice({
  name: 'roulette',
  initialState,
  reducers: {
    setRouletteState: (state, action: PayloadAction<RouletteState>) => {
      state.rotation = action.payload.rotation;
      state.isSpinning = action.payload.isSpinning;
    },
  },
});

export const { setRouletteState } = rouletteSlice.actions;
export default rouletteSlice.reducer;
