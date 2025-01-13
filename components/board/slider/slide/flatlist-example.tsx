import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
  ShadowDecorator,
  OpacityDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';

export const mapIndexToData = (_d: any, index: number, arr: any[]) => {
    const backgroundColor = getColor(index, arr.length);
    return {
      text: `${index}`,
      key: `key-${index}`,
      backgroundColor,
      height: 75,
    };
};

const NUM_ITEMS = 100;
const initialData: Item[] = [...Array(NUM_ITEMS)].map(mapIndexToData);

export function getColor(i: number, numItems: number = 25) {
    const multiplier = 255 / (numItems - 1);
    const colorVal = i * multiplier;
    return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}
  
export type Item = ReturnType<typeof mapIndexToData>;

export default function FlatListExample() {
  const [data, setData] = useState(initialData);

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
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        onDragEnd={({ data }) => setData(data)}
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