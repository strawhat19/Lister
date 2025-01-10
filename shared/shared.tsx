import 'react-native-gesture-handler';

import { createContext, useState } from 'react';
import { View } from '@/components/theme/Themed';
import { ColumnType, ItemType } from '@/shared/types/types';
import { defaultBoardColumns } from '@/components/board/board';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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

  return (
    <SharedContext.Provider 
      value={{ // Globally Shared State Data
        user, setUser, 
        beta, setBeta, 
        indx, setIndx,
        blur, setBlur,
        selected, setSelected,
        isDragging, setDragging,
        modalOpen, setModalOpen,
        carouselData, setCarouselData,
      }}
    >
      <GestureHandlerRootView>
        <View style={{ flex: 1, width: `100%` }}>
          {children}
        </View>
      </GestureHandlerRootView>
    </SharedContext.Provider>
  )
}