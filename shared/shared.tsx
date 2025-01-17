import { User } from './models/User';
import 'react-native-gesture-handler';
import { defaultColumns } from './database';
import { View } from '@/components/theme/Themed';
import { animationOptions, log, useDatabase } from './variables';
import SlideUp from '@/components/slide-up/slide-up';
import { useSharedValue } from 'react-native-reanimated';
import { collection, onSnapshot } from 'firebase/firestore';
import { createContext, useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Animated, useWindowDimensions, Vibration } from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { itemsDatabaseCollection, db, tasksDatabaseCollection } from './server/firebase';
import { BoardType, ColumnType, ItemType, ItemViews, TaskType } from '@/shared/types/types';

configureReanimatedLogger({ strict: false, level: ReanimatedLogLevel.error });

export const SharedContext = createContext({});
export const defaultItemView = ItemViews.Tasks;

export default function Shared({ children }: { children: React.ReactNode; }) {
  let [indx, setIndx] = useState(0);
  let [beta, setBeta] = useState(false);
  let [blur, setBlur] = useState<any>(100);
  let [editing, setEditing] = useState(false);
  let [slideIndex, setSlideIndex] = useState(0);
  let [modalOpen, setModalOpen] = useState(false);
  let [isDragging, setDragging] = useState(false);
  let [view, setView] = useState(defaultItemView);
  let [items, setItems] = useState<ItemType[]>([]);
  let [tasks, setTasks] = useState<TaskType[]>([]);
  let [user, setUser] = useState<User | null>(null);
  let [users, setUsers] = useState<User[] | null>([]);
  let [itemsLoading, setItemsLoading] = useState(false);
  let [usersLoading, setUsersLoading] = useState(false);
  let [tasksLoading, setTasksLoading] = useState(false);
  let [selected, setSelected] = useState<ItemType | ColumnType | null>(null);
  let [boardColumns, setBoardColumns] = useState<BoardType | ColumnType[]>(defaultColumns);
  let [activeTopName, setActiveTopName] = useState(boardColumns[slideIndex]?.name);

  const progress = useSharedValue<number>(0);
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const blurBGContainerOpacity = useRef(new Animated.Value(0)).current;

  const closeBottomSheet = () => {
    setIndx(0);
    exitFadeBlur();
    setEditing(false);
    setSelected(null);
    setView(defaultItemView);
  }

  const onSheetChange = (index?: any) => {
    if (index === 0) {
      setActiveTopName(boardColumns[slideIndex]?.name);
      closeBottomSheet();
    }
  }

  const openBottomSheet = (item?: any, backgroundColor?: any) => {
    enterFadeBlur();
    setIndx(1);
    if (item) {
      log(`Opened Details for ${item?.type} that says "${item?.name}"`);
      if (item.name) setActiveTopName(item.name);
      if (backgroundColor) {
        item = {
          ...item,
          backgroundColor,
        }
      }
      setSelected(item);
    }
    Vibration.vibrate(1);
  }

  const enterFadeBlur = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      ...animationOptions,
    }).start();
    
    Animated.timing(blurBGContainerOpacity, {
      toValue: 1,
      ...animationOptions,
    }).start();
  }

  const exitFadeBlur = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      ...animationOptions,
    }).start();

    Animated.timing(blurBGContainerOpacity, {
      toValue: 0,
      ...animationOptions,
    }).start();
  }

  useEffect(() => {    
    if (useDatabase) {
      const itemsCollection = collection(db, itemsDatabaseCollection);
      const unsubscribeFromItemsDatabase = onSnapshot(itemsCollection, snapshot => {
          setItemsLoading(true);
          const itemsFromDB: any[] = [];
          snapshot.forEach((doc) => itemsFromDB.push({ ...doc.data() } as any));
          setItems(itemsFromDB);
          setItemsLoading(false);
          log(`${itemsFromDB.length} Item(s) from Database`);
        }, error => {
          setItemsLoading(false);
          log(`Error on Get Item(s) from Database`, error);
        }
      )
      
      const tasksCollection = collection(db, tasksDatabaseCollection);
      const unsubscribeFromTasksDatabase = onSnapshot(tasksCollection, snapshot => {
          setTasksLoading(true);
          const tasksFromDB: any[] = [];
          snapshot.forEach((doc) => tasksFromDB.push({ ...doc.data() } as any));
          setTasks(tasksFromDB);
          setTasksLoading(false);
          log(`${tasksFromDB.length} Task(s) from Database`);
        }, error => {
          setTasksLoading(false);
          log(`Error on Get Task(s) from Database`, error);
        }
      )

      return () => {
        unsubscribeFromItemsDatabase();
        unsubscribeFromTasksDatabase();
      }
    }
  }, [])

  return (
    <SharedContext.Provider 
      value={{ // Globally Shared State Data
        width,
        height,
        progress,
        fadeAnim,
        exitFadeBlur,
        view, setView,
        enterFadeBlur,
        user, setUser, 
        beta, setBeta, 
        indx, setIndx,
        blur, setBlur,
        onSheetChange,
        users, setUsers,
        items, setItems,
        tasks, setTasks,
        openBottomSheet,
        closeBottomSheet,
        editing, setEditing,
        selected, setSelected,
        blurBGContainerOpacity,
        isDragging, setDragging,
        modalOpen, setModalOpen,
        slideIndex, setSlideIndex,
        boardColumns, setBoardColumns,
        tasksLoading, setTasksLoading,
        itemsLoading, setItemsLoading,
        usersLoading, setUsersLoading,
        activeTopName, setActiveTopName,
      }}
    >
      <GestureHandlerRootView>
        <View style={{ flex: 1, width: `100%` }}>
          {children}
          {/* <SlideUp /> */}
        </View>
      </GestureHandlerRootView>
    </SharedContext.Provider>
  )
}