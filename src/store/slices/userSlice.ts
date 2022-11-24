import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State } from 'react-native-gesture-handler';

export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | undefined;
  password: string;
}

interface UserState {
  isLoading: boolean;
  error: null | string;

  auth: User | null;
  defaultUser: User | null;

  firstAccess: boolean | null;
}

const initialState: UserState = {
  isLoading: false,
  error: null,

  auth: null,
  defaultUser: null,

  firstAccess: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    LOGIN: (state, _: PayloadAction<Login>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    LOGIN_SUCCESS: (
      state,
      { payload: { data } }: PayloadAction<{ data: User }>,
    ) => ({
      ...state,
      isLoading: false,
      auth: data,
    }),

    LOGIN_FAILURE: (state, { payload: { error } }) => ({
      ...state,
      isLoading: false,
      error,
    }),

    REGISTER: (state, _: PayloadAction<Register>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    REGISTER_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    REGISTER_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    GET_DEFAULT_USER: (state, _: PayloadAction<{ email: string }>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    GET_DEFAULT_USER_SUCCESS: (
      state,
      { payload: { user } }: PayloadAction<{ user: User }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      defaultUser: user,
    }),

    GET_DEFAULT_USER_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    LOGOUT: (state, _: PayloadAction) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    LOGOUT_SUCCESS: state => ({
      ...state,
      isLoading: false,

      auth: null,
      defaultUser: null,
    }),

    LOGOUT_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    GET_FIRST_ACCESS: state => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    GET_FIRST_ACCESS_SUCCESS: (
      state,
      { payload: { firstAccess } }: PayloadAction<{ firstAccess: boolean }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      firstAccess,
    }),

    GET_FIRST_ACCESS_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),
  },
});

const { actions, reducer } = userSlice;

export const userState = initialState;

export const {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  GET_DEFAULT_USER,
  GET_DEFAULT_USER_FAILURE,
  GET_DEFAULT_USER_SUCCESS,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  GET_FIRST_ACCESS,
  GET_FIRST_ACCESS_SUCCESS,
  GET_FIRST_ACCESS_FAILURE,
} = actions;

export default reducer;
