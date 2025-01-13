import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';

export function getColor(i: number, numItems: number = 25) {
    const multiplier = 255 / (numItems - 1);
    const colorVal = i * multiplier;
    return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

export const mapIndexToData = (_d: any, index: number, arr: any[]) => {
    const backgroundColor = getColor(index, arr.length);
    return {
      text: `${index}`,
      key: `key-${index}`,
      backgroundColor,
      height: 75,
    };
};

export type Item = ReturnType<typeof mapIndexToData>;

const NUM_ITEMS = 100;

const initialData: Item[] = [...Array(NUM_ITEMS)].map(mapIndexToData);

export default function HorizontalFlatList() {
  const [data, setData] = useState(initialData);

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Item>) => {
      return (
        <ScaleDecorator>
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={drag}
            disabled={isActive}
            style={[
              styles.rowItem,
              { opacity: isActive ? 0.5 : 1 },
              { backgroundColor: isActive ? "blue" : item.backgroundColor },
            ]}
          >
            <Text style={styles.text}>{item.text}</Text>
          </TouchableOpacity>
        </ScaleDecorator>
      );
    },
    []
  );

  return (
    <DraggableFlatList
      horizontal
      data={data}
      onDragEnd={({ data }) => setData(data)}
      keyExtractor={(item) => {
        return item.key;
      }}
      renderItem={renderItem}
      renderPlaceholder={() => (
        <View style={{ flex: 1, backgroundColor: "tomato" }} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  rowItem: {
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});