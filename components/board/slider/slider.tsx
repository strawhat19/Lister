import Column from '../column/column';
import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import SliderPagination from './pagination/pagination';
import Carousel from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';

export default function Slider({
    width,
    height,
    progress,
    openItem,
    fadeAnim,
    carouselRef,
    swipeCarousel,
    closeBottomSheet, 
}: any) {
    const scrollOffsetValue = useSharedValue<number>(0);
    let { carouselData } = useContext<any>(SharedContext);

    return (
        <>
            <Carousel
                loop={true}
                width={width}
                height={height}
                ref={carouselRef}
                data={carouselData}
                pagingEnabled={true}
                onProgressChange={progress}
                style={{ backgroundColor: `black` }}
                defaultScrollOffsetValue={scrollOffsetValue}
                renderItem={({ index, item }: any) => (
                    <Column
                        key={index}
                        item={item}
                        height={height}
                        openItem={openItem}
                        fadeAnim={fadeAnim}
                        swipeCarousel={swipeCarousel}
                        closeBottomSheet={closeBottomSheet}
                    />
                )}
            />

            <SliderPagination progress={progress} carouselRef={carouselRef} />
        </>
    )
}