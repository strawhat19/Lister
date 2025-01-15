import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export enum Environments {
  beta = `beta_`,
  production = ``,
}

export enum DatabaseTableNames {
  users = `users`,
  items = `items`,
  tasks = `tasks`,
  boards = `boards`,
  columns = `columns`,
  notifications = `notifications`,
}

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

export const isProduction = process.env.NODE_ENV == `production`;
export const environment = isProduction ? Environments.production : Environments.beta;

export const usersDatabaseCollection = environment + DatabaseTableNames.users;

export default app;