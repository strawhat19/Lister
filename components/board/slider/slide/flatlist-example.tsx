import * as Haptics from 'expo-haptics';
import { colors } from '@/components/theme/Themed';
import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, useAnimatedReaction } from 'react-native-reanimated';
import DraggableFlatList, { ScaleDecorator, ShadowDecorator, OpacityDecorator, RenderItemParams, } from 'react-native-draggable-flatlist';

export function getColor(i: number, numItems: number = 25) {
  const multiplier = 255 / (numItems - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

export const mapIndexToData = (_d: any, index: number, arr: any[]) => {
  const backgroundColor = getColor(index, arr.length);
  return {
    height: 75,
    backgroundColor,
    text: `${index}`,
    key: `key-${index}`,
  };
};

const NUM_ITEMS = 10;
const initialData: Item[] = [...Array(NUM_ITEMS)].map(mapIndexToData);
  
export type Item = ReturnType<typeof mapIndexToData>;

export default function FlatListExample() {
  const [items, setItems] = useState(initialData);
  const positions = useSharedValue(
    Object.assign({}, ...items.map((_, idx) => ({ [idx]: idx })))
  );

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Item>) => {

      const animatedStyle: any = useAnimatedStyle(() => ({
        transform: [
          { scale: withTiming(isActive ? 1.1 : 1, { duration: 150 }) },
          { translateY: withTiming(isActive ? -10 : 0, { duration: 150 }) },
        ],
      } as any));

      useAnimatedReaction(
        () => positions.value[item.key],
        (newIndex) => {
          if (newIndex !== undefined) {
            positions.value[item.key] = newIndex;
          }
        },
        []
      );

      return (
        <ShadowDecorator>
          <ScaleDecorator>
            <OpacityDecorator>
              <TouchableOpacity
                activeOpacity={1}
                onLongPress={drag}
                disabled={isActive}
                style={[
                  styles.rowItem,
                  { backgroundColor: isActive ? colors.blue : item.backgroundColor },
                ]}
              >
                <Animated.View style={[animatedStyle]}>
                  <Text style={styles.text}>
                    {item.text}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </OpacityDecorator>
          </ScaleDecorator>
        </ShadowDecorator>
      );
    },
    []
  );

  return (
    <DraggableFlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      onDragEnd={({ data }) => setItems(data)}
      renderPlaceholder={() => <View style={{ flex: 1, backgroundColor: colors.tomato }} />}
      onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
    />
  );
}

const styles = StyleSheet.create({
  rowItem: {
    height: 100,
    alignItems: `center`,
    justifyContent: `center`,
  },
  text: {
    fontSize: 24,
    color: `white`,
    fontWeight: `bold`,
    textAlign: `center`,
  },
});