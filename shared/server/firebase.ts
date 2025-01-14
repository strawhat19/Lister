import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  appId: process.env.FIREBASE_APPID,
  apiKey: process.env.FIREBASE_APIKEY,
  projectId: process.env.FIREBASE_PROJECTID,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  measurementId: process.env.FIREBASE_MEASUREMENTID,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const databaseNames = {
  users: `users`,
  items: `items`,
  tasks: `tasks`,
  boards: `boards`,
  columns: `columns`,
}

export default app;