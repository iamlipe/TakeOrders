import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Spent as SpentModel } from '@database/models/spentModel';

export interface GetSpent {
  userId: string;
}

export interface NewSpent {
  userId: string;
}

export interface RemovedSpent {
  spent: SpentModel;
}

export interface UpdatedSpent extends RemovedSpent {
  updatedSpent: {
    userId?: string;
  };
}

interface spentState {
  isLoading: boolean;
  error: string | null;

  spentId: string | null;
}

const initialState: spentState = {
  isLoading: false,
  error: null,

  spentId: null,
};

const spentSlice = createSlice({
  name: 'spent',
  initialState,
  reducers: {
    GET_SPENT: (state, _: PayloadAction<GetSpent>) => ({
      ...state,
      isLoading: true,
      error: null,

      spentId: null,
    }),
    GET_SPENT_SUCCESS: (
      state,
      { payload: { spentId } }: PayloadAction<{ spentId: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      spentId,
    }),
    GET_SPENT_FAILURE: (state, { payload: { error } }) => ({
      ...state,
      isLoading: false,
      error,
    }),

    CREATE_SPENT: (state, _: PayloadAction<NewSpent>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    CREATE_SPENT_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    CREATE_SPENT_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    UPDATE_SPENT: (state, _: PayloadAction<UpdatedSpent>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    UPDATE_SPENT_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    UPDATE_SPENT_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    REMOVE_SPENT: (state, _: PayloadAction<RemovedSpent>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    REMOVE_SPENT_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    REMOVE_SPENT_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),
  },
});

const { actions, reducer } = spentSlice;

export const spentState = initialState;

export const {
  GET_SPENT,
  GET_SPENT_SUCCESS,
  GET_SPENT_FAILURE,
  CREATE_SPENT,
  CREATE_SPENT_SUCCESS,
  CREATE_SPENT_FAILURE,
  UPDATE_SPENT,
  UPDATE_SPENT_SUCCESS,
  UPDATE_SPENT_FAILURE,
  REMOVE_SPENT,
  REMOVE_SPENT_SUCCESS,
  REMOVE_SPENT_FAILURE,
} = actions;

export default reducer;
