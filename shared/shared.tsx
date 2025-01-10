import 'react-native-gesture-handler';

import { createContext, useState } from 'react';
import { View } from '@/components/theme/Themed';
import { VertImageCard } from '@/shared/types/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const SharedContext = createContext({});

export default function Shared({ children }: { children: React.ReactNode; }) {
  let [user, setUser] = useState(null);
  let [beta, setBeta] = useState(false);
  let [modalOpen, setModalOpen] = useState(false);

  let [indx, setIndx] = useState(0);
  let [blur, setBlur] = useState<any>(100);
  let [selected, setSelected] = useState<VertImageCard | null>(null);

  return (
    <SharedContext.Provider 
      value={{ // Globally Shared State Data
        user, setUser, 
        beta, setBeta, 
        indx, setIndx,
        blur, setBlur,
        selected, setSelected,
        modalOpen, setModalOpen,
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