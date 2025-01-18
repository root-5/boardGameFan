import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TimerState {
  defaultTime: number;
  time: number;
  isRunning: boolean;
  isTimeUp: boolean;
  saveDefaultText: string;
}

const initialState: TimerState = {
  defaultTime: 0,
  time: 0,
  isRunning: false,
  isTimeUp: false,
  saveDefaultText: "SAVE AS DEFAULT",
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setTimerState: (state, action: PayloadAction<Partial<TimerState>>) => {
      return { ...state, ...action.payload };
    },
    resetTimer: (state) => {
      return initialState;
    },
  },
});

export const { setTimerState, resetTimer } = timerSlice.actions;
export default timerSlice.reducer;
