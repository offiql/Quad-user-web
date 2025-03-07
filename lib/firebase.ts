import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyDWLxU9VuRPLtaaUUFCzDgvtyWIjLarpYM",
  authDomain: "notification-system-f308a.firebaseapp.com",
  projectId: "notification-system-f308a",
  storageBucket: "notification-system-f308a.firebasestorage.app",
  messagingSenderId: "64564533290",
  appId: "1:64564533290:web:34018be19d9778c956cb53",
  measurementId: "G-HFH0EMXGFX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const registerServiceWorker = async () => {
  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      console.log("Service Worker registered successfully:", registration);
    }
  } catch (error) {
    console.error("Service Worker registration failed:", error);
  }
};

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BOUikLk1p1xc54HOkj75b6VbnDvkKINGjC35pQ1PRiKwYlRkebBtzRBy5mKzIEAycyNgxDtR04OdIajdlluDskc",
      });

      if (token) {
        localStorage.setItem("fcm_token", token);
      } else {
        console.log("No registration token available. Request permission.");
      }

      return token;
    } else {
      console.log("Permission denied for notifications");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      resolve(payload);
    });
  });

export { messaging, getToken, onMessage };
