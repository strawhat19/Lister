import * as Haptics from 'expo-haptics';
import React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { getPosition, ITEM_HEIGHT, MARGIN } from './draggable-list';
import { Platform } from 'react-native';

export default function DraggableListItem({ children, index, positions }) {
  const position = getPosition(positions.value[index]);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
      if (Platform.OS === `ios`) {
        runOnJS(Haptics.impactAsync)(
          Haptics.ImpactFeedbackStyle.Heavy
        );
      }
    },
    onActive: (event, context: any) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;

      const newIndex = Math.round(translateY.value / (ITEM_HEIGHT + MARGIN));
      if (newIndex !== positions.value[index] && newIndex >= 0 && newIndex < 10) {
        const currentIndex = positions.value[index];
        positions.value = {
          ...positions.value,
          [index]: newIndex,
          ...Object.keys(positions.value).reduce((acc, key) => {
            if (parseInt(key) !== index && positions.value[key] === newIndex) {
              acc[key] = currentIndex;
            }
            return acc;
          }, {}),
        };
        if (Platform.OS === `ios`) {
          runOnJS(Haptics.impactAsync)(
            Haptics.ImpactFeedbackStyle.Heavy
          );
        }
      }
    },
    onEnd: () => {
      const { x, y } = getPosition(positions.value[index]);
      translateX.value = withTiming(x);
      translateY.value = withTiming(y);
      if (Platform.OS === `ios`) {
        runOnJS(Haptics.impactAsync)(
          Haptics.ImpactFeedbackStyle.Heavy
        );
      }
    },
    onFinish: () => {
      if (Platform.OS === `ios`) {
        runOnJS(Haptics.impactAsync)(
          Haptics.ImpactFeedbackStyle.Heavy
        );
      }
    }
  });

  useAnimatedReaction(
    () => positions.value[index],
    (newIndex) => {
      const { x, y } = getPosition(newIndex);
      translateX.value = withTiming(x);
      translateY.value = withTiming(y);
    }
  );

  const animatedStyle = useAnimatedStyle((): any => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    width: '50%',
    position: 'absolute',
    height: ITEM_HEIGHT + MARGIN,
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </PanGestureHandler>
  );
}