import { configureStore } from "@reduxjs/toolkit";
import currencyReducer from "./create"; 

const store = configureStore({
  reducer: {
    currency: currencyReducer,
  },
});

export default store;
