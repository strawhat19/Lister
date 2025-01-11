import Column from '../../column/column';
import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import { useAnimatedStyle } from 'react-native-reanimated';

export default function Slide({ index, item, swipeCarousel }: any) {
    let { 
        height, 
        progress, 
        fadeAnim, 
        slideIndex, 
        openBottomSheet, 
        closeBottomSheet, 
    } = useContext<any>(SharedContext);

    const animatedStyle = useAnimatedStyle(() => {
        const distance = Math.abs(progress.value - index);
        const opacity = distance > 1 ? 0.3 : 1 - distance * 0.3; // Smoothly reduce opacity
        return { opacity };
    })

    const blurIntensity = Math.abs(progress.value - index) > 1
        ? 50 // Higher blur for distant items
        : Math.abs(progress.value - index) * 50; // Dynamic blur for adjacent items

    return (
        <Column
            key={index}
            item={item}
            height={height}
            fadeAnim={fadeAnim}
            swipeCarousel={swipeCarousel}
            blurIntensity={blurIntensity}
            animatedAdjacent={animatedStyle}
            openBottomSheet={openBottomSheet}
            closeBottomSheet={closeBottomSheet}
            active={(slideIndex + 1) == item.index}
        />
    )
}