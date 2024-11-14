import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "../features/transactions/transactionsSlice";

// Configure the store to use the reducer from the transactions slice
const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
  },
});

export default store;
