import React from 'react';
import * as Haptics from 'expo-haptics';
import { colors, Text } from '../theme/Themed';
import DraggableListItem from './draggable-list-item';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef, useSharedValue } from 'react-native-reanimated';

export const MARGIN = 5.5;
export const ITEM_HEIGHT = 55;
const { width } = Dimensions.get('window');

export const getOrder = (y) => {
  'worklet';
  return Math.round(y / (ITEM_HEIGHT + MARGIN));
};

export const getPosition = (index) => {
  'worklet';
  return {
    x: -165,
    y: index * (ITEM_HEIGHT + MARGIN),
  };
};

const generateID = () => Math.random().toString(36).substr(2, 9);
const generateUniqueItems = (amount) => {
  return Array.from({ length: amount }, (_, i) => ({
    id: generateID(),
    label: `Item ${i + 1}`,
  }));
};

const items = generateUniqueItems(20);
const colorsToUse = [colors.appleBlue, colors.appleRed, colors.appleGreen];
const getBGPatternColor = (idx) => colorsToUse[idx % colorsToUse.length];

export default function DraggableList() {
  // const scrollY = useSharedValue(0);
  // const scrollViewRef = useAnimatedRef();

  const positions = useSharedValue(
    Object.assign({}, ...items.map((_, idx) => ({ [idx]: idx })))
  );

  return (
    <SafeAreaProvider style={styles.container}>
      <GestureHandlerRootView>
        <SafeAreaView>
          <Animated.ScrollView style={{ width: `100%`, height: `100%` }} contentContainerStyle={{ width: `100%`, height: `100%`, alignItems: `center` }}>
            {items.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
              >
                <DraggableListItem index={idx} positions={positions}>
                  <View
                    id={`draggableItem-${item.id}`}
                    style={[
                      styles.item,
                      { backgroundColor: getBGPatternColor(idx) },
                    ]}
                  >
                    <Text style={styles.text}>
                      {item.label}
                    </Text>
                  </View>
                </DraggableListItem>
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  item: {
    borderRadius: 8,
    width: width * 0.9,
    height: ITEM_HEIGHT,
    alignItems: `center`,
    justifyContent: `center`,
    marginVertical: MARGIN / 2,
  },
  text: {
    fontSize: 18,
    color: `white`,
    fontWeight: `bold`,
  },
});