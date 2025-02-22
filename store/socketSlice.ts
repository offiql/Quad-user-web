import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  isConnected: boolean;
  socketId: string | null;
}

const initialState: SocketState = {
  isConnected: false,
  socketId: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocketConnected: (state, action: PayloadAction<string | null>) => {
      state.isConnected = action.payload !== null;
      state.socketId = action.payload;
    },
  },
});

export const { setSocketConnected } = socketSlice.actions;
export default socketSlice.reducer;
