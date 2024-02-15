import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
  },
  reducers: {
    update: (state) => {
      state.username = "daqy";
    },
  },
});

export const { update } = counterSlice.actions;
export const useUser = (state) => state.chat.value;
export default counterSlice.reducer;
