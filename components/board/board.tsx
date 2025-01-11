import Slider from './slider/slider';
import SlideUp from '../slide-up/slide-up';
import { SharedContext } from '@/shared/shared';
import { animationOptions } from '@/shared/variables';
import { SheetComponents } from '@/shared/types/types';
import { useSharedValue } from 'react-native-reanimated';
import React, { useContext, useRef, useState } from 'react';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { Animated, Vibration, useWindowDimensions } from 'react-native';

export default function Board({  }: any) {
    let { setSelected } = useContext<any>(SharedContext);
    
    const [indx, setIndx] = useState(0);
    const progress = useSharedValue<number>(0);
    const { width, height } = useWindowDimensions();
    const carouselRef = useRef<ICarouselInstance>(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const blurBGContainerOpacity = useRef(new Animated.Value(0)).current;
    const [, setSheetComponent] = useState<SheetComponents>(SheetComponents.ItemForm);

    const onSheetChange = (index?: any) => {
        if (index === 0) closeBottomSheet();
    }

    const openItem = (item, componentString: SheetComponents = SheetComponents.Item) => {
        setSheetComponent(componentString);
        openBottomSheet(item);
    }

    const closeBottomSheet = () => {
        setIndx(0);
        exitFadeBlur();
        setSelected(null);
    }

    const swipeCarousel = (translationX: number) => {
        carouselRef.current?.scrollTo({
            count: translationX > 0 ? -1 : 1,
            animated: true,
        })
    }

    const openBottomSheet = (item?: any) => {
        enterFadeBlur();
        setIndx(1);
        if (item) setSelected(item);
        Vibration.vibrate(1);
    }

    const enterFadeBlur = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            ...animationOptions,
        }).start();
        
        Animated.timing(blurBGContainerOpacity, {
            toValue: 1,
            ...animationOptions,
        }).start();
    }

    const exitFadeBlur = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            ...animationOptions,
        }).start();

        Animated.timing(blurBGContainerOpacity, {
            toValue: 0,
            ...animationOptions,
        }).start();
    }

    return <>
        <Slider
            width={width}
            height={height}
            progress={progress}
            openItem={openItem}
            fadeAnim={fadeAnim}
            carouselRef={carouselRef}
            swipeCarousel={swipeCarousel}
            closeBottomSheet={closeBottomSheet} 
        />

        <SlideUp 
            indx={indx} 
            onSheetChange={onSheetChange} 
            closeBottomSheet={closeBottomSheet} 
            blurBGContainerOpacity={blurBGContainerOpacity}
        />
    </>
}