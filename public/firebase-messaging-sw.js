importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js");

// Initialize Firebase inside service worker
firebase.initializeApp({
    apiKey: "AIzaSyDWLxU9VuRPLtaaUUFCzDgvtyWIjLarpYM",
    authDomain: "notification-system-f308a.firebaseapp.com",
    projectId: "notification-system-f308a",
    storageBucket: "notification-system-f308a.firebasestorage.app",
    messagingSenderId: "64564533290",
    appId: "1:64564533290:web:34018be19d9778c956cb53",
    measurementId: "G-HFH0EMXGFX"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png", // Add a custom icon if needed
  });
});
