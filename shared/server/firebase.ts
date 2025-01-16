import { User } from '../models/User';
import { capWords, log } from '../variables';
import { initializeApp } from 'firebase/app';
import { ItemType, TaskType } from '../types/types';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';

export enum Environments {
  beta = `beta_`,
  production = ``,
}

export enum DatabaseTableNames {
  users = `users`,
  items = `items`,
  tasks = `tasks`,
  boards = `boards`,
  events = `events`,
  visits = `visits`,
  columns = `columns`,
  comments = `comments`,
  templates = `templates`,
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

export const getItemsForColumn = (items: ItemType[], listID: string) => (
  items && items?.length > 0 ? items?.filter(itm => itm?.listID == listID).sort((a, b) => a?.index - b?.index) : []
);

export const getTasksForItem = (tasks: TaskType[], itemID: string) => (
  tasks && tasks?.length > 0 ? tasks?.filter(tsk => tsk?.itemID == itemID).sort((a, b) => a?.index - b?.index) : []
);

export const userConverter = {
  toFirestore: (usr: User) => {
    return JSON.parse(JSON.stringify(usr));
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return new User(data);
  }
}

export const itemConverter = {
  toFirestore: (itm: ItemType) => {
    return JSON.parse(JSON.stringify(itm));
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return new ItemType(data);
  }
}

export const taskConverter = {
  toFirestore: (tsk: TaskType) => {
    return JSON.parse(JSON.stringify(tsk));
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return new TaskType(data);
  }
}

export const usersDatabaseCollection = environment + DatabaseTableNames.users;
export const itemsDatabaseCollection = environment + DatabaseTableNames.items;
export const tasksDatabaseCollection = environment + DatabaseTableNames.tasks;

export const addUserToDatabase = async (usr: User) => {
  const userReference = await doc(db, usersDatabaseCollection, usr?.id).withConverter(userConverter);
  await setDoc(userReference, usr as User);
}

export const addItemToDatabase = async (itm: ItemType) => {
  const itemReference = await doc(db, itemsDatabaseCollection, itm?.id).withConverter(itemConverter);
  await setDoc(itemReference, itm as ItemType);
}

export const addTaskToDatabase = async (tsk: TaskType) => {
  const taskReference = await doc(db, tasksDatabaseCollection, tsk?.id).withConverter(taskConverter);
  await setDoc(taskReference, tsk as TaskType);
}

export const deleteItemFromDatabase = async (itemID: string, cascade: boolean = true) => {
  try {
    if (cascade) {
      const tasksQuery = await getDocs(query(collection(db, tasksDatabaseCollection), where(`itemID`, `==`, itemID)));
      const taskDeletionPromises = tasksQuery.docs.map(taskDoc => deleteDoc(taskDoc.ref));
      await Promise.all(taskDeletionPromises);
    }
    const itemRef = await doc(db, itemsDatabaseCollection, itemID).withConverter(itemConverter);
    await deleteDoc(itemRef);
  } catch (error) {
    log(`Error Deleting Item ${itemID}`, error);
  }
}

export const deleteTaskFromDatabase = async (taskID: string) => {
  try {
    const taskRef = await doc(db, tasksDatabaseCollection, taskID).withConverter(taskConverter);
    await deleteDoc(taskRef);
  } catch (error) {
    log(`Error Deleting Task ${taskID}`, error);
  }
}

export const updateItemIndexInDatabase = async (itemID: string, newIndex: any, key: string = `index`) => {
  try {
    const itemRef = await doc(db, itemsDatabaseCollection, itemID).withConverter(itemConverter);
    await updateDoc(itemRef, { [key]: newIndex });
  } catch (error) {
    log(`Error Updating Item ${itemID} ${capWords(key)}`, error);
  }
}

export const updateTaskIndexInDatabase = async (taskID: string, newIndex: any, key: string = `index`) => {
  try {
    const taskRef = await doc(db, tasksDatabaseCollection, taskID).withConverter(taskConverter);
    await updateDoc(taskRef, { [key]: newIndex });
  } catch (error) {
    log(`Error Updating Task ${taskID} ${capWords(key)}`, error);
  }
}

export default app;