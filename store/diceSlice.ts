import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Euler } from 'three';

interface DiceState {
  rotation: Euler;
  isRolling: boolean;
}

const initialState: DiceState = {
  rotation: new Euler(0, 0, 0),
  isRolling: false,
};

const diceSlice = createSlice({
  name: 'dice',
  initialState,
  reducers: {
    setDiceState: (state, action: PayloadAction<DiceState>) => {
      state.rotation = action.payload.rotation;
      state.isRolling = action.payload.isRolling;
    },
  },
});

export const { setDiceState } = diceSlice.actions;
export default diceSlice.reducer;
