import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDknZL9YXFW46LQMzHtv5jjgN2Yar6kalU",
  authDomain: "movie-app-453f6.firebaseapp.com",
  projectId: "movie-app-453f6",
  storageBucket: "movie-app-453f6.firebasestorage.app",
  messagingSenderId: "844358097956",
  appId: "1:844358097956:web:a002ab8de6e0c2525fccb1",
  measurementId: "G-S9946B5GCM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;