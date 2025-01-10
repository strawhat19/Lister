import React from 'react';
import * as Haptics from 'expo-haptics';
import DraggableItem from './draggable-item';
import { colors, Text } from '../theme/Themed';
import { MARGIN, SIZE } from '@/shared/variables';
import { useSharedValue } from 'react-native-reanimated';
import { generateUniqueItems, mobile } from '@/shared/variables';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const items = generateUniqueItems(35, { label: `Drag` });
const colorsToUse = [colors.appleBlue, colors.appleRed, colors.appleGreen];
const getBGPatternColor = (idx: number) => colorsToUse[idx % colorsToUse.length];

export default function DraggableGrid() {
    const positions = useSharedValue(
        Object.assign({}, ...items.map((item, idx) => ({[idx]: idx}))),
    );

    const onDragEndTouch = () => {
        if (mobile()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <GestureHandlerRootView style={styles.container}>
                <SafeAreaView style={styles.container}>
                    <View id={`dragAndDropGrid`} style={styles.wrapper}>
                        {items.map((item, idx) => (
                            <TouchableOpacity 
                                key={idx}    
                                activeOpacity={0.5}
                                onPress={() =>  onDragEndTouch()}
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
      backgroundColor: `black`,
    },
    wrapper: {
        padding: 0,
        width: `100%`,
        flexWrap: `wrap`,
        flexDirection: `column`,
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