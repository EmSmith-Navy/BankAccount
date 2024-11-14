import { createSlice } from "@reduxjs/toolkit";

/**
 * Each transaction is recorded as an object with the following properties.
 * @typedef Transaction
 * @property {"deposit"|"withdrawal"|"transfer/[name]"} type
 * @property {number} amount
 * @property {number} balance - The balance after the transaction is completed.
 */

// Set initial state to have a balance of 0 and an empty array of transactions.
const initialState = {
  balance: 0, // Initial balance
  history: [], // Initial empty transaction history
};

/* Add two reducers to the transactions slice: "deposit" and "transfer".
Both reducers update the balance and then record the transaction.
"deposit" should increase the balance by the amount in the payload,
while "transfer" should decrease the balance by the amount in the payload.
*/

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    withdrawal: (state, { payload }) => {
      state.balance -= payload.amount;
      state.history.push({
        type: "withdrawal",
        amount: payload.amount,
        balance: state.balance,
      });
    },
    deposit: (state, { payload }) => {
      state.balance += payload; // Increase balance by the amount in the payload
      state.history.push({
        type: "deposit",
        amount: payload,
        balance: state.balance,
      });
    },
    transfer: (state, { payload }) => {
      state.balance -= payload.amount; // Decrease balance by the amount in the payload
      state.history.push({
        type: `transfer/${payload.recipient}`, // Record the transfer type with recipient
        amount: payload.amount,
        balance: state.balance,
      });
    },
    setBalance: (state, { payload }) => {
      state.balance = payload; // Set balance to the payload value
    },
  },
});

// Export actions
export const { deposit, withdrawal, transfer, setBalance } = transactionsSlice.actions;

// Selectors
export const selectBalance = (state) => state.transactions.balance;
export const selectHistory = (state) => state.transactions.history;

// Export the reducer
export default transactionsSlice.reducer;
