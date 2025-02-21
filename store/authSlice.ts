import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  userData: any | null;
  patient: any;
}

const initialState: AuthState = {
  access_token: null,
  refresh_token: null,
  userData: null,
  patient: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens(
      state,
      action: PayloadAction<{ access_token: string; refresh_token: string }>
    ) {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
    },
    setUserData(state, action: PayloadAction<any>) {
      state.userData = action.payload;
    },
    setPatientData(state, action: PayloadAction<any>) {
      state.patient = action.payload;
    },
    clearAuth(state) {
      state.access_token = null;
      state.refresh_token = null;
      state.userData = null;
    },
  },
});

export const { setTokens, setUserData, setPatientData, clearAuth } = authSlice.actions;
export default authSlice.reducer;
