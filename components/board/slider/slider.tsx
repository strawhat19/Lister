import Column from '../column/column';
import { SharedContext } from '@/shared/shared';
import React, { useContext, useRef } from 'react';
import { colors } from '@/components/theme/Themed';
import SliderPagination from './pagination/pagination';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

export default function Slider({ backgroundColor = colors.columnBG }: any) {
    const carouselRef = useRef<ICarouselInstance>(null);
    const scrollOffsetValue = useSharedValue<number>(0);
    let { 
        width, 
        height, 
        progress, 
        fadeAnim, 
        carouselData, 
        openBottomSheet, 
        closeBottomSheet, 
    } = useContext<any>(SharedContext);

    const swipeCarousel = (translationX: number) => {
        carouselRef.current?.scrollTo({
            count: translationX > 0 ? -1 : 1,
            animated: true,
        })
    }

    return (
        <>
            <Carousel
                loop={true}
                width={width}
                height={height}
                ref={carouselRef}
                mode={`parallax`}
                data={carouselData}
                pagingEnabled={true}
                onProgressChange={progress}
                style={{ backgroundColor }}
                defaultScrollOffsetValue={scrollOffsetValue}
                modeConfig={{
                    parallaxScrollingScale: 0.99,
                    parallaxAdjacentItemScale: 0.55,
                }}
                renderItem={({ index, item }: any) => (
                    <Column
                        key={index}
                        item={item}
                        height={height}
                        fadeAnim={fadeAnim}
                        swipeCarousel={swipeCarousel}
                        openBottomSheet={openBottomSheet}
                        closeBottomSheet={closeBottomSheet}
                    />
                )}
            />

            <SliderPagination carouselRef={carouselRef} />
        </>
    )
}