import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  Layout,
} from "react-native-reanimated";

const NUM_ITEMS = 10;
const ITEM_HEIGHT = 100;
const items = Array.from({ length: NUM_ITEMS }, (_, index) => ({
  id: `item-${index}`,
  text: `Item ${index + 1}`,
}));

export default function DraggableFlatList() {
  const [data, setData] = useState(items);
  const positions = useSharedValue(data.map((_, index) => index));

  const handleDragEnd = (from: number, to: number) => {
    if (from !== to) {
      const newData = [...data];
      const movedItem = newData.splice(from, 1)[0];
      newData.splice(to, 0, movedItem);
      setData(newData);

      positions.value = newData.map((_, index) => index);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View>
        {data.map((item, index) => (
          <DraggableItem
            key={item.id}
            index={index}
            data={data}
            positions={positions}
            onDragEnd={handleDragEnd}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
}

function DraggableItem({ index, data, positions, onDragEnd }) {
  const positionY = useSharedValue(index * ITEM_HEIGHT);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: positionY.value }],
    zIndex: withTiming(positions.value[index] === index ? 0 : 1),
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = positionY.value;
    },
    onActive: (event, ctx) => {
      positionY.value = ctx.startY + (event.translationY as any);
    },
    onEnd: () => {
      const newPosition = Math.round(positionY.value / ITEM_HEIGHT);
      const clampedPosition = Math.min(Math.max(newPosition, 0), data.length - 1);
      onDragEnd(index, clampedPosition);
      positionY.value = withTiming(clampedPosition * ITEM_HEIGHT);
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <Text style={styles.text}>{data[index].text}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  item: {
    height: ITEM_HEIGHT,
    backgroundColor: "tomato",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});