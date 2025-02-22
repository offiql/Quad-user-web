import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  type: "email" | "push" | "sms" | "system";
  createdAt: string;
  updatedAt: string;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload); // Add new notifications at the top
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(
        (n) => n._id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
    },
  },
});

export const { setNotifications, addNotification, markAsRead, markAllAsRead } =
  notificationSlice.actions;
export default notificationSlice.reducer;
