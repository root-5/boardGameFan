import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './features/tokenSlice';

const store = configureStore({
  reducer: {
    token: tokenReducer,
  },
});

export default store;
