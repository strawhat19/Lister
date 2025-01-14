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
        isDragging, 
        setSlideIndex,
    } = useContext<any>(SharedContext);

    useDerivedValue(() => {
        const absoluteProgress = progress.value;
        runOnJS(setSlideIndex)(absoluteProgress);
    }, [progress])

    const swipeCarousel = (translationX) => {
        if (selected == null) { // Ensure no swiping lock
            // swiping.current = true; // Lock swiping
            carouselRef.current?.scrollTo({
                count: translationX > 0 ? -1 : 1,
                animated: true,
            });
    
            // // Unlock swiping after animation completes (adjust based on animation duration)
            // setTimeout(() => {
            //     swiping.current = false;
            // }, 50); // Adjust the duration to match the carousel animation speed
        }
    }

    const handleGesture = (event: any) => {
        'worklet';
        if (isDragging) return; // Skip if dragging or swiping is locked

        const sensitivity = 30; // Adjust sensitivity for horizontal swipe
        const { translationX, translationY, velocityX } = event.nativeEvent;

        // Determine if the gesture is primarily horizontal
        const isHorizontalSwipe =
            Math.abs(translationX) > Math.abs(translationY) && // Horizontal motion dominates
            Math.abs(translationX) > sensitivity && // Sufficient horizontal movement
            Math.abs(velocityX) > sensitivity; // Sufficient horizontal velocity

        if (isHorizontalSwipe) {
            runOnJS(swipeCarousel)(translationX); // Trigger swipeCarousel with translationX
        }
    }

    return (
        <PanGestureHandler onGestureEvent={handleGesture}>
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