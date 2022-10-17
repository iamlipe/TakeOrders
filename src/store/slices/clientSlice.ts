import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client as ClientModal } from '@database/models/clientModal';

export interface GetClients {
  userId: string;
}

export interface NewClient {
  userId: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface RemovedClient {
  client: ClientModal;
}

export interface UpdatedClient extends RemovedClient {
  updatedClient: {
    userId?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
}

interface ClientState {
  isLoading: boolean;
  error: string | null;

  allClients: ClientModal[] | null;
}

const initialState: ClientState = {
  isLoading: false,
  error: null,

  allClients: null,
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    GET_ALL_CLIENTS: (state, _: PayloadAction<GetClients>) => ({
      isLoading: true,
      error: null,

      allClients: null,
    }),

    GET_ALL_CLIENTS_SUCCESS: (
      state,
      { payload: { allClients } }: PayloadAction<{ allClients: ClientModal[] }>,
    ) => ({
      ...state,
      isLoading: false,

      allClients,
    }),

    GET_ALL_CLIENTS_FAILURE: (state, { payload: { error } }) => ({
      ...state,
      isLoading: false,

      error,
    }),

    CREATE_CLIENT: (state, _: PayloadAction<NewClient>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    CREATE_CLIENT_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    CREATE_CLIENT_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    UPDATE_CLIENT: (state, _: PayloadAction<UpdatedClient>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    UPDATE_CLIENT_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    UPDATE_CLIENT_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    REMOVE_CLIENT: (state, _: PayloadAction<RemovedClient>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    REMOVE_CLIENT_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    REMOVE_CLIENT_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),
  },
});

const { actions, reducer } = clientSlice;

export const clientState = initialState;

export const {
  GET_ALL_CLIENTS,
  GET_ALL_CLIENTS_SUCCESS,
  GET_ALL_CLIENTS_FAILURE,
  CREATE_CLIENT,
  CREATE_CLIENT_SUCCESS,
  CREATE_CLIENT_FAILURE,
  UPDATE_CLIENT,
  UPDATE_CLIENT_SUCCESS,
  UPDATE_CLIENT_FAILURE,
  REMOVE_CLIENT,
  REMOVE_CLIENT_SUCCESS,
  REMOVE_CLIENT_FAILURE,
} = actions;

export default reducer;
