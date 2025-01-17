import { User } from '../models/User';
import { Vibration } from 'react-native';
import { initializeApp } from 'firebase/app';
import { BoardTypes, ItemType, TaskType, Views } from '../types/types';
import { colors, findColorKey, isLightColor, lightColors, randomCardColor } from '@/components/theme/Themed';
import { defaultBoardID, findHighestNumberInArrayByKey, genID, isValid, log } from '../variables';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';

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
  try {
    await Vibration.vibrate(1);
    const userReference = await doc(db, usersDatabaseCollection, usr?.id).withConverter(userConverter);
    await setDoc(userReference, usr as User);
    log(`Added User "${usr?.name}" to Database`);
  } catch (error) {
    log(`Error Adding User to Database ${usersDatabaseCollection}`, error);
  }
}

export const addItemToDatabase = async (itm: ItemType) => {
  try {
    await Vibration.vibrate(1);
    const itemReference = await doc(db, itemsDatabaseCollection, itm?.id).withConverter(itemConverter);
    await setDoc(itemReference, itm as ItemType);
    log(`Added Item "${itm?.name}" to Database`);
  } catch (error) {
    log(`Error Adding Item to Database ${itemsDatabaseCollection}`, error);
  }
}

export const addTaskToDatabase = async (tsk: TaskType) => {
  try {
    await Vibration.vibrate(1);
    const taskReference = await doc(db, tasksDatabaseCollection, tsk?.id).withConverter(taskConverter);
    await setDoc(taskReference, tsk as TaskType);
    log(`Added Task "${tsk?.name}" to Database`);
  } catch (error) {
    log(`Error Adding Task to Database ${tasksDatabaseCollection}`, error);
  }
}

export const cloneItemToDatabase = async (itm: ItemType, items: ItemType[], nextListID: string) => {
  await Vibration.vibrate(1);
  const clonedItem = await prepareItemForDatabase(itm, items, nextListID);
  await addItemToDatabase(clonedItem);
}

export const deleteItemFromDatabase = async (itemID: string, cascade: boolean = true) => {
  try {
    await Vibration.vibrate(1);

    if (cascade) {
      const tasksQuery = await getDocs(
        query(collection(db, tasksDatabaseCollection), where(`itemID`, `==`, itemID))
      );
      const taskDeletionPromises = tasksQuery.docs.map(taskDoc => deleteDoc(taskDoc.ref));
      await Promise.all(taskDeletionPromises);
      log(`Deleted All Item's Associated Tasks from Database`, tasksQuery.docs.map(doc => doc.data().name));
    }

    const itemRef = await doc(db, itemsDatabaseCollection, itemID).withConverter(itemConverter);
    const deletedItemSnapshot = await getDoc(itemRef);
    const deletedItem = deletedItemSnapshot.exists() ? deletedItemSnapshot.data() : null;
    await deleteDoc(itemRef);

    log(`Deleted Item "${deletedItem?.name}" from Database`);
  } catch (error) {
    log(`Error Deleting Item from Database ${itemsDatabaseCollection}`, error);
  }
}

export const deleteTaskFromDatabase = async (taskID: string) => {
  try {
    await Vibration.vibrate(1);
    const taskRef = await doc(db, tasksDatabaseCollection, taskID).withConverter(taskConverter);
    const deletedTaskSnapshot = await getDoc(taskRef);
    const deletedTask = deletedTaskSnapshot.exists() ? deletedTaskSnapshot.data() : null;
    await deleteDoc(taskRef);

    log(`Deleted Task "${deletedTask?.name}" from Database`);
  } catch (error) {
    log(`Error Deleting Task ${taskID}  from Database ${tasksDatabaseCollection}`, error);
  }
}

export const updateItemFieldsInDatabase = async (itemID: string, updates: { [key: string]: any }, vibrate = true, logResult = true) => {
  const now = new Date().toLocaleString(`en-US`);
  const fields = { ...updates, updated: now };
  try {
    const itemRef = await doc(db, itemsDatabaseCollection, itemID).withConverter(itemConverter);
    if (vibrate) await Vibration.vibrate(1);
    await updateDoc(itemRef, fields);
    if (logResult) log(`Item Fields Updated in Database`);
  } catch (error) {
    log(`Error Updating Item Fields`, { error, fields });
  }
};

export const updateTaskFieldsInDatabase = async (taskID: string, updates: { [key: string]: any }, vibrate = true, logResult = true) => {
  const now = new Date().toLocaleString(`en-US`);
  const fields = { ...updates, updated: now };
  try {
    const taskRef = await doc(db, tasksDatabaseCollection, taskID).withConverter(taskConverter);
    if (vibrate) await Vibration.vibrate(1);
    await updateDoc(taskRef, fields);
    if (logResult) log(`Task Fields Updated in Database`, fields);
  } catch (error) {
    log(`Error Updating Task Fields`, { error, fields });
  }
};

export const prepareTaskForDatabase = async (tsk: TaskType, tasks: TaskType[], itemID: string) => {
  let tasksForItem = getTasksForItem(tasks, itemID);

  let type = Views.Task;
  let newKey = tasks?.length + 1;
  let newIndex = tasksForItem?.length + 1;

  let highestKey = await findHighestNumberInArrayByKey(tasks, `key`);
  let highestIndex = await findHighestNumberInArrayByKey(tasks, `index`);
  let highestColumnIndex = await findHighestNumberInArrayByKey(tasksForItem, `index`);

  const maxHighest = Math.max(highestKey ?? -Infinity, highestIndex ?? -Infinity);

  if (maxHighest >= newKey) newKey = maxHighest + 1;
  if (highestColumnIndex >= newIndex) newIndex = highestColumnIndex + 1;

  const { id, uuid, date } = await genID(type, newIndex);

  const preparedTask = await new TaskType({ 
    ...tsk,
    id, 
    type,
    uuid,
    key: newKey,
    created: date,
    updated: date,
    index: newIndex, 
    boardID: defaultBoardID,
    // name: taskName, 
    // itemID: selected?.id,
    // listID: selected?.listID,
  })

  return preparedTask;
}

export const prepareItemForDatabase = async (itm: ItemType, items: ItemType[], listID: string) => {
  let itemsForColumn = getItemsForColumn(items, listID);

  let type = Views.Item;
  let newKey = items?.length + 1;
  let newIndex = itemsForColumn?.length + 1;

  let highestKey = await findHighestNumberInArrayByKey(items, `key`);
  let highestIndex = await findHighestNumberInArrayByKey(items, `index`);
  let highestColumnIndex = await findHighestNumberInArrayByKey(itemsForColumn, `index`);

  const maxHighest = Math.max(highestKey ?? -Infinity, highestIndex ?? -Infinity);

  if (maxHighest >= newKey) newKey = maxHighest + 1;
  if (highestColumnIndex >= newIndex) newIndex = highestColumnIndex + 1;

  const { id, uuid, date } = await genID(type, newIndex);

  const preparedItem = await new ItemType({
    ...itm,
    id,
    uuid,
    type,
    listID,
    key: newKey,
    created: date,
    updated: date,
    index: newIndex,
  } as ItemType);

  return preparedItem;
}

export const createItem = async (columnItems, listID: string, name, items, closeBottomSheet) => {
  if (listID && isValid(listID)) {
    let lastColor = ``;
    let backgroundColor = await randomCardColor();

    if (columnItems && columnItems?.length > 0) {
      let lastItemColor = columnItems[columnItems.length - 1]?.backgroundColor;
      if (lastItemColor) {
        lastColor = lastItemColor;
        if (lastColor) {
          if (lastColor == backgroundColor) {
            backgroundColor = await randomCardColor(undefined, lastColor);
          }
        }
      }
    }

    const isLightBGColor = isLightColor(backgroundColor);
    const colorKey = findColorKey(backgroundColor, colors);

    const itemToAdd = await new ItemType({
      name,
      listID,
      tasks: [],
      summary: ``,
      description: ``,
      backgroundColor,
      color: colorKey,
      boardID: defaultBoardID,
      ...(isLightBGColor && { fontColor: colors.darkFont }),
    } as ItemType);

    const newItem = await prepareItemForDatabase(itemToAdd, items, listID);
    await addItemToDatabase(newItem);
    await closeBottomSheet();
  }
}

export default app;