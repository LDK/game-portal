// User redux slice
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type UserToken = {
  access: string;
  refresh: string;
}

export type PortalUser = {
  id: number;
  username: string;
  email: string;
  token: UserToken;
}

interface UserState {
  user: PortalUser | null;
};

const initialState:UserState = { user: null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<PortalUser>) => {
      console.log('Setting user:', action.payload);
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<UserToken>) => {
      if (state.user) {
        state.user.token = action.payload;
      }
    },
    clearUser: (state) => {
      state.user = null;
    }
  }
});

export const { setUser, clearUser, setToken } = userSlice.actions;

// getUser selector function
export const getActiveUser = (state: RootState) => {
  return state.user.user;
};


export const userReducer = userSlice.reducer;