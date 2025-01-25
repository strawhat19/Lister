import React from 'react';
import * as Haptics from 'expo-haptics';
import { colors, Text } from '../theme/Themed';
import DraggableListItem from './draggable-list-item';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export const MARGIN = 8;
export const ITEM_HEIGHT = 80;
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
  const positions = useSharedValue(
    Object.assign({}, ...items.map((_, idx) => ({ [idx]: idx })))
  );

  return (
    <SafeAreaProvider style={styles.container}>
      <GestureHandlerRootView>
        <SafeAreaView>
          <View style={styles.listContainer}>
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
                    <Text style={styles.text}>{item.label}</Text>
                  </View>
                </DraggableListItem>
              </TouchableOpacity>
            ))}
          </View>
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
  listContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  item: {
    width: width * 0.9,
    height: ITEM_HEIGHT,
    marginVertical: MARGIN / 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});