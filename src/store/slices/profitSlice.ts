import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GetProfit {
  userId: string;
}

export interface ProfitResponse {
  id: string;
  name: string;
  price: number;
  createdAt: number;
  updatedAt: number;
}

interface ProfitState {
  isLoading: boolean;
  error: string | null;

  allProfit: ProfitResponse[] | null;
}

const initialState: ProfitState = {
  isLoading: false,
  error: null,

  allProfit: null,
};

const ProfitSlice = createSlice({
  name: 'profit',
  initialState,
  reducers: {
    GET_PROFIT: (state, _: PayloadAction<GetProfit>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    GET_PROFIT_SUCCESS: (
      state,
      {
        payload: { allProfit },
      }: PayloadAction<{ allProfit: ProfitResponse[] }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      allProfit,
    }),

    GET_PROFIT_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),
  },
});

const { actions, reducer } = ProfitSlice;

export const profitState = initialState;

export const { GET_PROFIT, GET_PROFIT_SUCCESS, GET_PROFIT_FAILURE } = actions;

export default reducer;
