import 'react-native-gesture-handler';
import { defaultColumns } from './database';
import { View } from '@/components/theme/Themed';
import SlideUp from '@/components/slide-up/slide-up';
import { databaseNames, db } from './server/firebase';
import { animationOptions, devEnv } from './variables';
import { useSharedValue } from 'react-native-reanimated';
import { ColumnType, ItemType } from '@/shared/types/types';
import { collection, onSnapshot } from 'firebase/firestore';
import { createContext, useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Animated, useWindowDimensions, Vibration } from 'react-native';

export const SharedContext = createContext({});

export default function Shared({ children }: { children: React.ReactNode; }) {
  let [indx, setIndx] = useState(0);
  let [user, setUser] = useState(null);
  let [users, setUsers] = useState([]);
  let [beta, setBeta] = useState(false);
  let [blur, setBlur] = useState<any>(100);
  let [editing, setEditing] = useState(false);
  let [slideIndex, setSlideIndex] = useState(0);
  let [modalOpen, setModalOpen] = useState(false);
  let [isDragging, setDragging] = useState(false);
  let [usersLoading, setUsersLoading] = useState(false);
  let [board, setBoard] = useState<ColumnType[]>(defaultColumns);
  let [selected, setSelected] = useState<ItemType | ColumnType | null>(null);
  let [activeTopName, setActiveTopName] = useState(board[slideIndex]?.name);

  const progress = useSharedValue<number>(0);
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const blurBGContainerOpacity = useRef(new Animated.Value(0)).current;

  const closeBottomSheet = () => {
    setIndx(0);
    exitFadeBlur();
    setSelected(null);
  }

  const onSheetChange = (index?: any) => {
    if (index === 0) {
      setActiveTopName(board[slideIndex]?.name);
      closeBottomSheet();
    }
  }

  useEffect(() => {    
    const usersCollection = collection(db, databaseNames.users);
    const unsubscribeFromUserDatabase = onSnapshot(usersCollection, snapshot => {
        setUsersLoading(true);
        const usersFromDB: any[] = [];
        snapshot.forEach((doc) => usersFromDB.push({ ...doc.data() } as any));
        devEnv && console.log(`Users Update from Firebase`, JSON.stringify(usersFromDB, null, 2));
        setUsers(usersFromDB);
        setUsersLoading(false);
      }, error => {
        console.log(`Error getting Users from Firebase`, JSON.stringify(error, null, 2));
        setUsersLoading(false);
      }
    )

    return () => {
      unsubscribeFromUserDatabase();
    }
  }, [])

  const openBottomSheet = (item?: any, backgroundColor?: any) => {
    enterFadeBlur();
    setIndx(1);
    if (item) {
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

  return (
    <SharedContext.Provider 
      value={{ // Globally Shared State Data
        width,
        height,
        progress,
        fadeAnim,
        exitFadeBlur,
        enterFadeBlur,
        user, setUser, 
        beta, setBeta, 
        indx, setIndx,
        blur, setBlur,
        onSheetChange,
        board, setBoard,
        users, setUsers,
        openBottomSheet,
        closeBottomSheet,
        editing, setEditing,
        selected, setSelected,
        blurBGContainerOpacity,
        isDragging, setDragging,
        modalOpen, setModalOpen,
        slideIndex, setSlideIndex,
        usersLoading, setUsersLoading,
        activeTopName, setActiveTopName,
      }}
    >
      <GestureHandlerRootView>
        <View style={{ flex: 1, width: `100%` }}>
          {children}
          <SlideUp 
            indx={indx} 
            onSheetChange={onSheetChange} 
            closeBottomSheet={closeBottomSheet} 
            blurBGContainerOpacity={blurBGContainerOpacity}
          />
        </View>
      </GestureHandlerRootView>
    </SharedContext.Provider>
  )
}