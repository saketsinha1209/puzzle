import { createSlice } from "@reduxjs/toolkit";

const currencySlice = createSlice({
  name: "currency",
  initialState: {
    currencyAmount: 0,
  },
  reducers: {
    updateCurrency: (state, action) => {
      state.currencyAmount += action.payload;
    },
  },
});

export const { updateCurrency } = currencySlice.actions;
export default currencySlice.reducer;
