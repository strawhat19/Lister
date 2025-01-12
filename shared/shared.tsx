import 'react-native-gesture-handler';

import { defaultColumns } from './database';
import { animationOptions } from './variables';
import { View } from '@/components/theme/Themed';
import SlideUp from '@/components/slide-up/slide-up';
import { createContext, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { ColumnType, ItemType } from '@/shared/types/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Animated, useWindowDimensions, Vibration } from 'react-native';

export const SharedContext = createContext({});

export default function Shared({ children }: { children: React.ReactNode; }) {
  let [indx, setIndx] = useState(0);
  let [user, setUser] = useState(null);
  let [beta, setBeta] = useState(false);
  let [blur, setBlur] = useState<any>(100);
  let [editing, setEditing] = useState(false);
  let [slideIndex, setSlideIndex] = useState(0);
  let [modalOpen, setModalOpen] = useState(false);
  let [isDragging, setDragging] = useState(false);
  let [selected, setSelected] = useState<ItemType | null>(null);
  let [carouselData, setCarouselData] = useState<ColumnType[]>(defaultColumns);
  let [activeTopName, setActiveTopName] = useState(carouselData[slideIndex]?.name);

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
      setActiveTopName(carouselData[slideIndex]?.name);
      closeBottomSheet();
    }
  }

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
        openBottomSheet,
        closeBottomSheet,
        editing, setEditing,
        selected, setSelected,
        blurBGContainerOpacity,
        isDragging, setDragging,
        modalOpen, setModalOpen,
        slideIndex, setSlideIndex,
        carouselData, setCarouselData,
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