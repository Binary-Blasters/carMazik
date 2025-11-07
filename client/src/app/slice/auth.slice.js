import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

const authslice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.token = action.payload.token;
    },
    removeUser(state) {
      state.user = null;
      state.token = null;
    },
    
  },
});

export const { setUser } = authslice.actions;
export default authslice.reducer;
