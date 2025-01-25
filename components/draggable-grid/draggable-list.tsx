import * as Haptics from 'expo-haptics';
import React, { useContext, useEffect } from 'react';
import { colors, Text } from '../theme/Themed';
import { SharedContext } from '@/shared/shared';
import DraggableListItem from './draggable-list-item';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export const MARGIN = 3;
export const ITEM_HEIGHT = 35;
const { width } = Dimensions.get(`window`);

export const getPosition = (index) => {
  'worklet';
  return {
    x: -168,
    y: index * (ITEM_HEIGHT + MARGIN),
  };
};

export default function DraggableList() {
  const { items } = useContext<any>(SharedContext);

  const positions = useSharedValue(
    Object.assign({}, ...items.map((_, idx) => ({ [idx]: idx })))
  );

  useEffect(() => {
    positions.value = Object.assign(
      {},
      ...items.map((_, idx) => ({ [idx]: idx }))
    );
  }, [items]);

  return (
    <SafeAreaProvider style={styles.container}>
      <GestureHandlerRootView>
        <SafeAreaView>
          <Animated.ScrollView style={{ width: `100%`, height: `100%` }} contentContainerStyle={{ width: `100%`, height: `100%`, alignItems: `center` }}>
            {items.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
              >
                <DraggableListItem index={idx} positions={positions} items={items}>
                  <View
                    id={`draggableItem-${item.id}`}
                    style={[
                      styles.item,
                      { backgroundColor: item?.backgroundColor },
                    ]}
                  >
                    <Text style={styles.text}>
                      {item.name}
                    </Text>
                  </View>
                </DraggableListItem>
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  item: {
    borderRadius: 5,
    width: width * 0.9,
    height: ITEM_HEIGHT,
    alignItems: `center`,
    justifyContent: `center`,
    marginVertical: MARGIN / 2,
  },
  text: {
    fontSize: 18,
    color: `white`,
    fontWeight: `bold`,
  },
});