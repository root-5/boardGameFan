import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardSetting } from '../utils/types';
import { initialCardsSetting } from '../utils/cardDefinitions';

const initialState: CardSetting[] = initialCardsSetting;

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    setCardList: (state, action: PayloadAction<CardSetting[]>) => {
      return action.payload;
    },
  },
});

export const { setCardList } = cardSlice.actions;
export default cardSlice.reducer;
