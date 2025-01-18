import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from '../utils/types';
import { initialPlayers } from '../utils/cardDefinitions';

const initialState: Player[] = initialPlayers;

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayersState: (state, action: PayloadAction<Player[]>) => {
      return action.payload;
    },
  },
});

export const { setPlayersState } = playersSlice.actions;
export default playersSlice.reducer;
