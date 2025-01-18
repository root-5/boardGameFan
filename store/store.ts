import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./tokenSlice";
import coinReducer from "./coinSlice";
import diceReducer from "./diceSlice";
import cardReducer from "./cardSlice";
import playersReducer from "./playersSlice";
import rouletteReducer from "./rouletteSlice";
import scoreReducer from "./scoreSlice";
import cardStyleReducer from "./cardStyleSlice";
import timerReducer from "./timerSlice";
import turnReducer from "./turnSlice";
import winnerReducer from "./winnerSlice";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    coin: coinReducer,
    dice: diceReducer,
    card: cardReducer,
    players: playersReducer,
    roulette: rouletteReducer,
    score: scoreReducer,
    cardStyle: cardStyleReducer,
    timer: timerReducer,
    turn: turnReducer,
    winner: winnerReducer,
  },
});
