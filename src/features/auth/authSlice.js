import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signupStart(state) {
      state.status = "loading";
      state.error = null;
    },
    signupSuccess(state, action) {
      state.status = "succeeded";
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    signupFailure(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    signinStart(state) {
      state.status = "loading";
      state.error = null;
    },
    signinSuccess(state, action) {
      state.status = "succeeded";
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    signinFailure(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("user");
    },
  },
});

export const {
  signupStart,
  signupSuccess,
  signupFailure,
  signinStart,
  signinSuccess,
  signinFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
