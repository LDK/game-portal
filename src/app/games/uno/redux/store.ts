/* Redux store for the Uno game within the context of the larger, site-wide Redux store. */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { unoGamesReducer } from "@/app/games/uno/redux/games";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const gamesPersistConfig = {
  key: "games",
  storage: storage,
  whitelist: ["games"],
};

const gamesPersistedReducer = persistReducer(gamesPersistConfig, unoGamesReducer);

const unoReducer = combineReducers({
  games: gamesPersistedReducer,
});

export const unoStore = configureStore({
  reducer: unoReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type UnoState = ReturnType<typeof unoStore.getState>;