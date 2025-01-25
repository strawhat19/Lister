import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { getPosition, ITEM_HEIGHT, MARGIN } from './draggable-list';
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function DraggableListItem({ children, index, positions }) {
  const position = getPosition(positions?.value[index]);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);
  const isGestureActive = useSharedValue(false);

  useAnimatedReaction(
    () => positions?.value[index],
    (newIndex) => {
      const { x, y } = getPosition(newIndex);
      translateX.value = withTiming(x);
      translateY.value = withTiming(y);
    }
  );

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
      isGestureActive.value = true;
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
      const { x, y } = getPosition(positions?.value[index]);
      translateX.value = withTiming(x);
      translateY.value = withTiming(y);
      if (Platform.OS === `ios`) {
        runOnJS(Haptics.impactAsync)(
          Haptics.ImpactFeedbackStyle.Heavy
        );
      }
    },
    onFinish: () => {
      isGestureActive.value = false;
      if (Platform.OS === `ios`) {
        runOnJS(Haptics.impactAsync)(
          Haptics.ImpactFeedbackStyle.Heavy
        );
      }
    }
  });

  const animatedStyle = useAnimatedStyle((): any => {
    const scale = isGestureActive.value ? 1.05 : 1;
    const zIndex = isGestureActive.value ? 99999 : 1;
    return {
      zIndex,
      width: `100%`,
      position: `absolute`,
      height: ITEM_HEIGHT + MARGIN,
      transform: [
        { scale },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    }
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
}