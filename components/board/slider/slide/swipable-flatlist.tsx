import React, { useState, useRef, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  LayoutAnimation,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import SwipeableItem, {
  useSwipeableItemParams,
} from 'react-native-swipeable-item';
import Carousel from 'react-native-reanimated-carousel';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

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

const OVERSWIPE_DIST = 20;
const NUM_ITEMS = 20;

const initialData: Item[] = [...Array(NUM_ITEMS)].fill(0).map(mapIndexToData);

function SwipableFlatList() {
  const [data, setData] = useState(initialData);
  const itemRefs = useRef(new Map());

  const renderFlatList = useCallback(
    ({ index }: { index: number }) => {
      const renderItem = (params: RenderItemParams<Item>) => {
        const onPressDelete = () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          setData((prev) => prev.filter((i) => i !== params.item));
        };

        return (
          <RowItem
            {...params}
            itemRefs={itemRefs}
            onPressDelete={onPressDelete}
          />
        );
      };

      return (
        <View style={styles.carouselItem}>
          <DraggableFlatList
            keyExtractor={(item) => item.key}
            data={data}
            renderItem={renderItem}
            onDragEnd={({ data }) => setData(data)}
            activationDistance={20}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
      );
    },
    [data]
  );

  return (
    <Carousel
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT * 0.8} // Adjust to fit the screen height
      data={[...Array(NUM_ITEMS)]}
      renderItem={renderFlatList}
      mode="parallax" // Options: "parallax", "default", "horizontal-stack", etc.
      loop={false}
    />
  );
}

export default SwipableFlatList;

type RowItemProps = {
  item: Item;
  drag: () => void;
  onPressDelete: () => void;
  itemRefs: React.MutableRefObject<Map<any, any>>;
};

function RowItem({ item, itemRefs, drag, onPressDelete }: RowItemProps) {
  const [snapPointsLeft, setSnapPointsLeft] = useState([150]);

  return (
    <ScaleDecorator>
      <SwipeableItem
        key={item.key}
        item={item}
        ref={(ref) => {
          if (ref && !itemRefs.current.get(item.key)) {
            itemRefs.current.set(item.key, ref);
          }
        }}
        onChange={({ open }: any) => {
          if (open) {
            [...itemRefs.current.entries()].forEach(([key, ref]) => {
              if (key !== item.key && ref) ref.close();
            });
          }
        }}
        overSwipe={OVERSWIPE_DIST}
        renderUnderlayLeft={() => (
          <UnderlayLeft drag={drag} onPressDelete={onPressDelete} />
        )}
        renderUnderlayRight={() => <UnderlayRight />}
        snapPointsLeft={snapPointsLeft}
      >
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          style={[
            styles.row,
            { backgroundColor: item.backgroundColor, height: item.height },
          ]}
        >
          <Text style={styles.text}>{`${item.text}`}</Text>
        </TouchableOpacity>
      </SwipeableItem>
    </ScaleDecorator>
  );
}

const UnderlayLeft = ({
  drag,
  onPressDelete,
}: {
  drag: () => void;
  onPressDelete: () => void;
}) => {
  const { percentOpen } = useSwipeableItemParams<Item>();
  const animStyle = useAnimatedStyle(() => ({ opacity: percentOpen.value }), [
    percentOpen,
  ]);

  return (
    <Animated.View style={[styles.row, styles.underlayLeft, animStyle]}>
      <TouchableOpacity onPress={onPressDelete}>
        <Text style={styles.text}>{`[delete]`}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

function UnderlayRight() {
  const { close } = useSwipeableItemParams<Item>();
  return (
    <Animated.View style={[styles.row, styles.underlayRight]}>
      <TouchableOpacity onPressOut={close as any}>
        <Text style={styles.text}>CLOSE</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    width: SCREEN_WIDTH * 0.9, // Make rows fit nicely
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  underlayRight: {
    flex: 1,
    backgroundColor: 'teal',
    justifyContent: 'flex-start',
  },
  underlayLeft: {
    flex: 1,
    backgroundColor: 'tomato',
    justifyContent: 'flex-end',
  },
});