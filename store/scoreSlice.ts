import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScoreState {
  value: number;
}

const initialState: ScoreState = {
  value: 0,
};

const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    setScore: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setScore } = scoreSlice.actions;
export default scoreSlice.reducer;
