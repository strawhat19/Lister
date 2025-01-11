import 'react-native-gesture-handler';

import { View } from '@/components/theme/Themed';
import SlideUp from '@/components/slide-up/slide-up';
import { createContext, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { ColumnType, ItemType } from '@/shared/types/types';
import { animationOptions, defaultBoardColumns } from './variables';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Animated, useWindowDimensions, Vibration } from 'react-native';

export const SharedContext = createContext({});

export default function Shared({ children }: { children: React.ReactNode; }) {
  let [indx, setIndx] = useState(0);
  let [user, setUser] = useState(null);
  let [beta, setBeta] = useState(false);
  let [blur, setBlur] = useState<any>(100);
  let [modalOpen, setModalOpen] = useState(false);
  let [isDragging, setDragging] = useState(false);
  let [selected, setSelected] = useState<ItemType | null>(null);
  let [carouselData, setCarouselData] = useState<ColumnType[]>(defaultBoardColumns);

  const progress = useSharedValue<number>(0);
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const blurBGContainerOpacity = useRef(new Animated.Value(0)).current;

  const onSheetChange = (index?: any) => {
    if (index === 0) {
      closeBottomSheet();
    }
  }

  const openBottomSheet = (item?: any) => {
    enterFadeBlur();
    setIndx(1);
    if (item) setSelected(item);
    Vibration.vibrate(1);
  }

  const closeBottomSheet = () => {
    setIndx(0);
    exitFadeBlur();
    setSelected(null);
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
        openBottomSheet,
        closeBottomSheet,
        selected, setSelected,
        isDragging, setDragging,
        modalOpen, setModalOpen,
        carouselData, setCarouselData,
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