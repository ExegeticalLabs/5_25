import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAfq8fw1_RvJyEKhq00ShDWsh95MTmtlIM",
  authDomain: "app-b7fb9.firebaseapp.com",
  projectId: "app-b7fb9",
  storageBucket: "app-b7fb9.firebasestorage.app",
  messagingSenderId: "156607047694",
  appId: "1:156607047694:web:f80c579d2097791d3ff45f",
  measurementId: "G-W4T5EKTL6R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
