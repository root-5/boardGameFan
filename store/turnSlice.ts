import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TurnState {
  turnCount: number;
  turnPlayerIndex: number;
  isTurnCountMode: boolean;
}

const initialState: TurnState = {
  turnCount: 0,
  turnPlayerIndex: 0,
  isTurnCountMode: true,
};

const turnSlice = createSlice({
  name: 'turn',
  initialState,
  reducers: {
    setTurnCount: (state, action: PayloadAction<number>) => {
      state.turnCount = action.payload;
    },
    setTurnPlayerIndex: (state, action: PayloadAction<number>) => {
      state.turnPlayerIndex = action.payload;
    },
    toggleTurnMode: (state) => {
      state.isTurnCountMode = !state.isTurnCountMode;
    },
    resetTurn: () => initialState,
  },
});

export const { setTurnCount, setTurnPlayerIndex, toggleTurnMode, resetTurn } = turnSlice.actions;
export default turnSlice.reducer;
