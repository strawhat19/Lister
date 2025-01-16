import { log } from '@/shared/variables';
import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
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

  const onDragEnd = async (onDragEndData: any) => {
    let { data: dragEndData } = await onDragEndData;
    await setItems(dragEndData);
  }

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Item>) => {
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
                  { backgroundColor: isActive ? "blue" : item.backgroundColor },
                ]}
              >
                <Text style={styles.text}>{item.text}</Text>
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
      onDragEnd={async (onDragEndData) => await onDragEnd(onDragEndData)}
      renderPlaceholder={() => (
        <View style={{ flex: 1, backgroundColor: `tomato` }} />
      )}
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