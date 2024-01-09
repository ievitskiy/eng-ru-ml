"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface Translation {
  id: number;
  fromLanguage: string;
  toLanguage: string;
  translatable: string;
  translation: string;
}

export interface HistoryState {
  translations: Translation[];
}

const initialState: HistoryState = {
  translations: [],
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    append: (state, action) => {
      state.translations.push(action.payload);
    },
    deleteById: (state, action) => {
      state.translations.filter((translation) => {
        translation.id != action.payload;
      });
    },
    clear: (state) => {
      state.translations = [];
    },
  },
});

export const { append, deleteById, clear } = historySlice.actions;
export default historySlice.reducer;
