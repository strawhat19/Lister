import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { getOrder, getPosition, log, MARGIN } from '@/shared/variables';
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

let bumps = 0;

export default function DraggableItem({ children, positions, index }: any) {
  const position = getPosition(positions?.value[index]);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);

  const isGestureActive = useSharedValue(false);

  useAnimatedReaction(
    () => positions?.value[index],
    (newOrder) => {
      const newPostions = getPosition(newOrder);
      translateX.value = withTiming(newPostions.x);
      translateY.value = withTiming(newPostions.y);
    },
  );  

  const panGesture = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      isGestureActive.value = true;
      if (Platform.OS === `ios`) {
        runOnJS(Haptics.impactAsync)(
          Haptics.ImpactFeedbackStyle.Heavy
        );
      }
    },
    onActive: (evt, ctx: any) => {
      bumps = bumps + 1;

      translateX.value = ctx.startX + evt.translationX;
      translateY.value = ctx.startY + evt.translationY;

      const oldOrder = positions?.value[index];
      const newOrder = getOrder(translateX.value, translateY.value);
      if (oldOrder !== newOrder) {
        const idToSwap = Object.keys(positions?.value).find(
          key => positions?.value[key] === newOrder,
        )
        if (idToSwap) {
          const newPostions = JSON.parse(JSON.stringify(positions?.value));
          newPostions[index] = newOrder;
          newPostions[idToSwap] = oldOrder;
          positions.value = newPostions;
          if (Platform.OS === `ios`) {
            runOnJS(Haptics.impactAsync)(
              Haptics.ImpactFeedbackStyle.Heavy
            );
          }
        }
      }
    },
    onEnd: () => {
      const destination = getPosition(positions?.value[index]);
      translateX.value = withTiming(destination.x);
      translateY.value = withTiming(destination.y);
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
    },
  });

  const animatedStyle = useAnimatedStyle((): any => {
    const zIndex = isGestureActive.value ? 1000 : 1;
    const scale = isGestureActive.value ? 1.1 : 1;
    return {
      zIndex,
      margin: MARGIN * 2,
      position: `absolute`,
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale},
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={{ display: `flex`, flex: 1, width: `100%` }}>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  )
}