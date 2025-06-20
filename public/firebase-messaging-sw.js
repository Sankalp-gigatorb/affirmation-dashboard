// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDsK2AqdJgI8Qs8Tq5oz2AwYTIItpcmg7s",
  authDomain: "affirmation-dcb89.firebaseapp.com",
  projectId: "affirmation-dcb89",
  storageBucket: "affirmation-dcb89.firebasestorage.app",
  messagingSenderId: "943424358644",
  appId: "1:943424358644:web:a287f1c9a5e27614b536a1",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/vite.svg",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
