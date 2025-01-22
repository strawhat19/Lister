import React from 'react';
import * as Haptics from 'expo-haptics';
import DraggableItem from './draggable-item';
import { colors, Text } from '../theme/Themed';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export const COL = 5;
export const MARGIN = 8;
export const SIZE = Dimensions.get(`window`).width / COL - MARGIN;

export const getOrder = (x: any, y: any) => {
    'worklet';
    const row = Math.round(y / SIZE);
    const col = Math.round(x / SIZE);
    return row * COL + col;
  }
  
  export const getPosition = (index: any) => {
    'worklet';
    return {
      x: (index % COL) * SIZE,
      y: Math.floor(index / COL) * SIZE,
    }
  }

export const generateID = () => {
    let id = Math.random().toString(36).substr(2, 9);
    return Array.from(id).map(char => {
      return Math.random() > 0.5 ? char.toUpperCase() : char;
    }).join(``);
  }

export const generateUniqueID = (existingIDs?: string[]) => {
  let newID = generateID();
  if (existingIDs && existingIDs.length > 0) {
    while (existingIDs.includes(newID)) {
      newID = generateID();
    }
  }
  return newID;
}

export const generateUniqueItems = (amount: number, data: any = null) => {
  const ids = [];
  const items = [];
  for (let i = 0; i < amount; i++) {
    let id = generateUniqueID(ids);
    ids.push(id);
    items.push({
      id,
      ...data,
    })
  }
  return items;
}

const items = generateUniqueItems(35, { label: `Drag` });
const colorsToUse = [colors.appleBlue, colors.appleRed, colors.appleGreen];
const getBGPatternColor = (idx: number) => colorsToUse[idx % colorsToUse.length];

export default function DraggableGrid() {
    const positions = useSharedValue(
        Object.assign({}, ...items.map((item, idx) => ({[idx]: idx}))),
    );

    return (
        <SafeAreaProvider style={styles.container}>
            <GestureHandlerRootView>
                <SafeAreaView>
                    <View id={`dragAndDropGrid`}>
                        {items.map((item, idx) => (
                            <TouchableOpacity 
                                key={idx}    
                                activeOpacity={0.5}
                                onPress={() =>  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                                onLongPress={() =>  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                            >
                                <DraggableItem index={idx} positions={positions}>
                                    <View id={`draggableItem-${item.id}`} style={[styles.item, { backgroundColor: getBGPatternColor(idx) }]}>
                                        <Text style={styles.text}>
                                            {idx + 1}
                                        </Text>
                                        <Text style={styles.text}>
                                            {item.label}
                                        </Text>
                                    </View>
                                </DraggableItem>
                            </TouchableOpacity>
                        ))}
                    </View>
                </SafeAreaView>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: `100%`,
      backgroundColor: colors.black,
    },
    item: {
        width: SIZE,
        height: SIZE,
        margin: MARGIN,
        borderRadius: 0,
        alignItems: `center`,
        justifyContent: `center`,
    },
    text: {
        fontSize: 16,
        color: `white`,
        fontWeight: `bold`,
    },
})