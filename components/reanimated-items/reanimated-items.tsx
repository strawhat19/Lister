import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { SharedContext } from '@/shared/shared';
import { scrollSensitivity } from '@/shared/variables';
import { titleRowStyles } from '../board/column/column';
import { Swipeable } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useContext, useRef, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { colors, View, globalStyles, isLightColor, Text } from '../theme/Themed';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { cancelAnimation, runOnJS, scrollTo, useAnimatedGestureHandler, useAnimatedReaction, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { deleteItemFromDatabase } from '@/shared/server/firebase';

function clamp(value, lowerBound, upperBound) {
  'worklet';
  return Math.max(lowerBound, Math.min(value, upperBound));
}

function objectMove(object, from, to) {
  'worklet';
  const newObject = Object.assign({}, object);

  for (const id in object) {
    if (object[id] === from) {
      newObject[id] = to;
    }

    if (object[id] === to) {
      newObject[id] = from;
    }
  }

  return newObject;
}

function listToObject(list) {
  const values = Object.values(list);
  const object = {};

  for (let i = 0; i < values.length; i++) {
    object[(values[i] as any).id] = i;
  }

  return object;
}

const itemHeight = 70;
const SCROLL_HEIGHT_THRESHOLD = itemHeight;

function MovableItem({
  id,
  itm,
  count,
  index,
  scrollY,
  positions,
}) {

  const { selected, setItems, closeBottomSheet } = useContext<any>(SharedContext);

  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const [moving, setMoving] = useState(false);
  const swipeableRef = useRef<Swipeable>(null);
  const top = useSharedValue(positions.value[id] * itemHeight);

  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition) {
        if (!moving) {
          top.value = withSpring(currentPosition * itemHeight);
        }
      }
    },
    [moving]
  );

  const gestureHandler = useAnimatedGestureHandler({
    onStart() {
      runOnJS(setMoving)(true);
      if (Platform.OS === `ios`) {
        runOnJS(Haptics.impactAsync)(
          Haptics.ImpactFeedbackStyle.Heavy
        );
      }
    },

    onActive(event) {
      const positionY = event.absoluteY + scrollY.value;

      if (positionY <= scrollY.value + SCROLL_HEIGHT_THRESHOLD) {
        const contentHeight = count * itemHeight;
        const containerHeight = dimensions.height - insets.top - insets.bottom;
        const maxScroll = -1 * ((contentHeight * scrollSensitivity) - containerHeight);
        scrollY.value = withTiming(maxScroll, { duration: 1500 });
      } else if (positionY >= scrollY.value + dimensions.height - SCROLL_HEIGHT_THRESHOLD) {
        const contentHeight = count * itemHeight;
        const containerHeight = dimensions.height - insets.top - insets.bottom;
        const maxScroll = (contentHeight * scrollSensitivity) - containerHeight;
        scrollY.value = withTiming(maxScroll, { duration: 1500 });
      } else {
        cancelAnimation(scrollY);
      }

      top.value = withTiming(positionY - itemHeight, {
        duration: 16,
      });

      const newPosition = clamp(
        Math.floor(positionY / itemHeight),
        0,
        count - 1
      );

      if (newPosition !== positions.value[id]) {
        positions.value = objectMove(
          positions.value,
          positions.value[id],
          newPosition
        );

        if (Platform.OS === `ios`) {
          runOnJS(Haptics.impactAsync)(
            Haptics.ImpactFeedbackStyle.Heavy
          );
        }
      }
    },

    onFinish() {
      top.value = positions.value[id] * itemHeight;
      runOnJS(setMoving)(false);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: 0,
      right: 0,
      top: top.value,
      shadowRadius: 10,
      position: `absolute`,
      zIndex: moving ? 1 : 0,
      shadowColor: colors.black,
      shadowOffset: { height: 0, width: 0, },
      shadowOpacity: withSpring(moving ? 0.2 : 0),
    };
  }, [moving]);

  const renderRightActions = () => (
    <View style={[titleRowStyles.rightAction, { borderRadius: 0, marginLeft: 0, backgroundColor: colors.red }]}>
        <FontAwesome name={`trash`} color={colors.white} size={22} style={{ paddingHorizontal: 35 }} />
    </View>
);

  const renderLeftActions = () => (
    <View style={[titleRowStyles.leftAction, { borderRadius: 0, marginRight: 0, backgroundColor: colors.red }]}>
        <FontAwesome name={`trash`} color={colors.white} size={22} style={{ paddingHorizontal: 35 }} />
    </View>
  );

    const deleteItem = async (itemID: string = selected?.id) => {
        await setItems(prevItems => prevItems.filter(itm => itm.id != itemID));
        await closeBottomSheet();
        await deleteItemFromDatabase(itemID);
    }

  return (
    <Animated.View style={animatedStyle}>
      <BlurView intensity={moving ? 100 : 0} tint={`light`}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={{ maxWidth: `auto` }}>
            <Swipeable
                friction={2}
                ref={swipeableRef}
                overshootLeft={false}
                overshootRight={false}
                renderLeftActions={renderLeftActions}
                renderRightActions={renderRightActions}
                onSwipeableLeftOpen={() => deleteItem(itm?.id)}
                onSwipeableRightOpen={() => deleteItem(itm?.id)}
                onActivated={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
            >
                {/* <Item
                    item={itm}
                    fadeAnim={fadeAnim}
                    isLast={index == itm.length - 1}
                    openBottomSheet={openBottomSheet}
                    closeBottomSheet={closeBottomSheet}
                    keyExtractor={(item: ItemType) => `${item.id}-${item.key}-${item.listID}`}
                /> */}
                <View style={{ flex: 1, width: `100%`, height: `100%`, minHeight: itemHeight, backgroundColor: itm?.backgroundColor, ...globalStyles.flexRow, justifyContent: `center` }}>
                    <Text style={{ width: `100%`, height: `auto`, color: isLightColor(itm?.backgroundColor) ? colors.dark : colors.white, fontWeight: `bold`, fontSize: 25, fontStyle: `italic`, textAlign: `center`, }}>
                        {index + 1}. {itm?.name}
                    </Text>
                </View>
            </Swipeable>
          </Animated.View>
        </PanGestureHandler>
      </BlurView>
    </Animated.View>
  );
}

export default function ReanimatedItems({ }) {
  const { items } = useContext<any>(SharedContext);

  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef();
  const positions = useSharedValue(listToObject(items));

  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => scrollTo(scrollViewRef, 0, scrolling, false)
  );

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.ScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ height: items.length * itemHeight, }}
            style={{ flex: 1, position: `relative`, backgroundColor: colors.black, }}
          >
            {items.map((itm, index) => (
              <MovableItem 
                    itm={itm} 
                    id={itm.id} 
                    key={itm.id} 
                    index={index} 
                    scrollY={scrollY} 
                    positions={positions} 
                    count={items?.length} 
                />
            ))}
          </Animated.ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}