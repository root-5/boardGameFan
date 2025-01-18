import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Euler } from 'three';

interface CoinState {
  rotation: Euler;
  isFlipping: boolean;
}

const initialState: CoinState = {
  rotation: new Euler(0, 0, 0),
  isFlipping: false,
};

const coinSlice = createSlice({
  name: 'coin',
  initialState,
  reducers: {
    setCoinState: (state, action: PayloadAction<CoinState>) => {
      state.rotation = action.payload.rotation;
      state.isFlipping = action.payload.isFlipping;
    },
  },
});

export const { setCoinState } = coinSlice.actions;
export default coinSlice.reducer;
