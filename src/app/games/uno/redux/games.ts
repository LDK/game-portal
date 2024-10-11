/* Redux slice to hold user game data. */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UnoGameState } from '@/app/games/uno/types';

type UnoGamesState = {
  games: UnoGameState[];
  quick?: UnoGameState;
};

const initialState: UnoGamesState = { games: [] };

const unoGamesSlice = createSlice({
  name: 'unoGames',
  initialState,
  reducers: {
    addGame: (state, action: PayloadAction<UnoGameState>) => {
      state.games.push(action.payload);
    },
    setQuickGame: (state, action: PayloadAction<UnoGameState>) => {
      state.quick = action.payload;
    },
    removeGame: (state, action: PayloadAction<number>) => {
      state.games = state.games.filter(game => game.id !== action.payload && !game.quick);
    },
    setGames: (state, action: PayloadAction<UnoGameState[]>) => {
      state.games = action.payload;
    },
    clearGames: (state) => {
      state.games = [];
    },
  },
});

export const { addGame, setQuickGame, removeGame, setGames, clearGames } = unoGamesSlice.actions;
export const unoGamesReducer = unoGamesSlice.reducer;
export const getUnoGames = (state: UnoGamesState) => state.games;