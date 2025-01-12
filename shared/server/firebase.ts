import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  appId: process.env.APPID,
  apiKey: process.env.APIKEY,
  projectId: process.env.PROJECTID,
  authDomain: process.env.AUTHDOMAIN,
  storageBucket: process.env.STORAGEBUCKET,
  measurementId: process.env.MEASUREMENTID,
  messagingSenderId: process.env.MESSAGINGSENDERID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const databaseNames = {
    users: `users`,
    items: `items`,
    boards: `boards`,
    columns: `columns`,
}

export default app;