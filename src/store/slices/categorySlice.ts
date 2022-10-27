import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category as CategoryModel } from '@database/models/categoryModel';

export interface NewCategory {
  name: string;
}

export interface RemovedCategory {
  category: CategoryModel;
}

export interface UpdatedCategory extends RemovedCategory {
  updatedCategory: NewCategory;
}

interface CategoryState {
  isLoading: boolean;
  error: string | null;

  allCategories: CategoryModel[] | null;
}

const initialState: CategoryState = {
  isLoading: false,
  error: null,

  allCategories: null,
};

const CategorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    GET_CATEGORIES: state => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    GET_CATEGORIES_SUCCESS: (
      state,
      {
        payload: { allCategories },
      }: PayloadAction<{ allCategories: CategoryModel[] }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      allCategories,
    }),

    GET_CATEGORIES_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    CREATE_CATEGORY: (state, _: PayloadAction<NewCategory>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    CREATE_CATEGORY_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    CREATE_CATEGORY_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    UPDATE_CATEGORY: (state, _: PayloadAction<UpdatedCategory>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    UPDATE_CATEGORY_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    UPDATE_CATEGORY_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    REMOVE_CATEGORY: (state, _: PayloadAction<RemovedCategory>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    REMOVE_CATEGORY_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    REMOVE_CATEGORY_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),
  },
});

const { actions, reducer } = CategorySlice;

export const categoryState = initialState;

export const {
  GET_CATEGORIES,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAILURE,
  CREATE_CATEGORY,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  UPDATE_CATEGORY,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  REMOVE_CATEGORY,
  REMOVE_CATEGORY_SUCCESS,
  REMOVE_CATEGORY_FAILURE,
} = actions;

export default reducer;
