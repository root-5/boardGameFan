import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardStyle } from '../utils/types';
import { initialStyle } from '../utils/cardDefinitions';

const initialState: CardStyle = initialStyle;

const cardStyleSlice = createSlice({
  name: 'cardStyle',
  initialState,
  reducers: {
    setCardStyleState: (state, action: PayloadAction<CardStyle>) => {
      return action.payload;
    },
  },
});

export const { setCardStyleState } = cardStyleSlice.actions;
export default cardStyleSlice.reducer;
