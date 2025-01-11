import Slide from './slide/slide';
import { SharedContext } from '@/shared/shared';
import React, { useContext, useRef } from 'react';
import { colors } from '@/components/theme/Themed';
import SliderPagination from './pagination/pagination';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';

export default function Slider({ backgroundColor = colors.mainBG }: any) {
    const carouselRef = useRef<ICarouselInstance>(null);
    const scrollOffsetValue = useSharedValue<number>(0);
    let { 
        width, 
        height, 
        selected,
        progress, 
        carouselData,
        setSlideIndex,
    } = useContext<any>(SharedContext);

    useDerivedValue(() => {
        const absoluteProgress = progress.value;
        runOnJS(setSlideIndex)(absoluteProgress);
    }, [progress])

    const swipeCarousel = (translationX: number) => {
        if (selected == null) {
            carouselRef.current?.scrollTo({
                count: translationX > 0 ? -1 : 1,
                animated: true,
            })
        }
    }

    return (
        <>
            <Carousel
                loop={true}
                width={width}
                height={height}
                mode={`parallax`}
                ref={carouselRef}
                data={carouselData}
                enabled={selected == null}
                onProgressChange={progress}
                style={{ backgroundColor }}
                pagingEnabled={selected == null}
                defaultScrollOffsetValue={scrollOffsetValue}
                modeConfig={{ parallaxScrollingScale: 0.99, parallaxAdjacentItemScale: 0.55 }}
                renderItem={({ index, item }: any) => (
                    <Slide index={index} item={item} swipeCarousel={swipeCarousel} />
                )}
            />

            <SliderPagination carouselRef={carouselRef} />
        </>
    )
}