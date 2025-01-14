import Slide from './slide/slide';
import { SharedContext } from '@/shared/shared';
import React, { useContext, useRef } from 'react';
import { colors } from '@/components/theme/Themed';
import SliderPagination from './pagination/pagination';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';

export default function Slider({ backgroundColor = colors.mainBG }: any) {
    const swiping = useRef(false);
    const carouselRef = useRef<ICarouselInstance>(null);
    const scrollOffsetValue = useSharedValue<number>(0);
    let { 
        board,
        width, 
        height, 
        selected,
        progress, 
        setSlideIndex,
    } = useContext<any>(SharedContext);

    useDerivedValue(() => {
        const absoluteProgress = progress.value;
        runOnJS(setSlideIndex)(absoluteProgress);
    }, [progress])

    const swipeCarousel = (translationX) => {
        if (selected == null && !swiping.current) { // Ensure no swiping lock
            swiping.current = true; // Lock swiping
            carouselRef.current?.scrollTo({
                count: translationX > 0 ? -1 : 1,
                animated: true,
            });
    
            // Unlock swiping after animation completes (adjust based on animation duration)
            setTimeout(() => {
                swiping.current = false;
            }, 50); // Adjust the duration to match the carousel animation speed
        }
    }

    return (
        <PanGestureHandler
            onGestureEvent={({ nativeEvent }) => {
                const { translationX, velocityX } = nativeEvent;
                const sensitivity = 30;
                if (Math.abs(translationX) > sensitivity && Math.abs(velocityX) > sensitivity) {
                    // Pass horizontal swipe to the carousel
                    swipeCarousel(translationX);
                }
            }}
        >
            <>
                <Carousel
                    loop={true}
                    data={board}
                    width={width}
                    height={height}
                    mode={`parallax`}
                    ref={carouselRef}
                    enabled={selected == null}
                    onProgressChange={progress}
                    style={{ backgroundColor }}
                    pagingEnabled={selected == null}
                    defaultScrollOffsetValue={scrollOffsetValue}
                    modeConfig={{ parallaxScrollingScale: 0.99, parallaxAdjacentItemScale: 0.55 }}
                    renderItem={({ index, item: column }: any) => (
                        <Slide index={index} column={column} swipeCarousel={swipeCarousel} carouselRef={carouselRef} />
                    )}
                />

                <SliderPagination carouselRef={carouselRef} />
            </>
        </PanGestureHandler>
    )
}