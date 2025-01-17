import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

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

export default function ReanimatedList() {
  const [items, setItems] = useState(initialData);
  const positions = useSharedValue(
    Object.assign({}, ...items.map((_, idx) => ({ [idx]: idx })))
  );

  const renderItem = useCallback(({ item, drag, isActive }) => {
    const animatedStyle: any = useAnimatedStyle(() => ({
      transform: [
        { scale: withTiming(isActive ? 1.1 : 1, { duration: 150 }) },
        { translateY: withTiming(isActive ? -10 : 0, { duration: 150 }) },
      ],
    } as any));

    return (
      <TouchableOpacity onLongPress={drag} style={styles.item}>
        <Animated.View style={[styles.animatedItem, animatedStyle]}>
          <Text style={styles.text}>
            {item.text}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <DraggableFlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      onDragEnd={({ data }) => setItems(data)}
      onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    height: 100,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedItem: {
    width: '90%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 8,
  },
  text: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});