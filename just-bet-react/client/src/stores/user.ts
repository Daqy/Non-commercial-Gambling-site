import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    balance: 0,
  },
  reducers: {
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
    updateUsername: (state, action) => {
      state.username = action.payload;
    },
  },
});

export const { updateBalance, updateUsername } = counterSlice.actions;
export const useUsername = (state) => state.user.username;
export const useBalance = (state) => state.user.balance;
export const useUser = (state) => ({
  username: state.user.username,
  balance: state.user.balance,
});
export default counterSlice.reducer;
