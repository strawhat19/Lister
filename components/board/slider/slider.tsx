import Column from '../column/column';
import { SharedContext } from '@/shared/shared';
import React, { useContext, useRef } from 'react';
import { colors } from '@/components/theme/Themed';
import SliderPagination from './pagination/pagination';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { log } from '@/shared/variables';

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
        fadeAnim, 
        slideIndex, 
        setSlideIndex,
        openBottomSheet, 
        closeBottomSheet, 
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
        // <PanGestureHandler onGestureEvent={(event) => log(`carousel gesture`, event)}>
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
                    pagingEnabled={selected == null}
                    style={{ 
                        // top: 0,
                        // left: 0,
                        // zIndex: 1,                             
                        backgroundColor,
                        // width: `100%`,
                        // height: `100%`,
                        // position: `absolute`,
                        // pointerEvents: `auto`,
                        // backgroundColor: colors.transparent, 
                    }}
                    defaultScrollOffsetValue={scrollOffsetValue}
                    modeConfig={{ parallaxScrollingScale: 0.99, parallaxAdjacentItemScale: 0.55 }}
                    renderItem={({ index, item: column }: any) => (
                        // <GestureHandlerRootView>
                            // <PanGestureHandler onGestureEvent={(event) => log(`carousel gesture`, event)}>
                                // <>
                                    <Column
                                        key={index}
                                        column={column}
                                        height={height}
                                        fadeAnim={fadeAnim}
                                        swipeCarousel={swipeCarousel}
                                        openBottomSheet={openBottomSheet}
                                        closeBottomSheet={closeBottomSheet}
                                        active={(slideIndex + 1) == column.index}
                                    />
                                // </>
                            // </PanGestureHandler>
                        // </GestureHandlerRootView>
                    )}
                />

                <SliderPagination carouselRef={carouselRef} />
            </>
        // </PanGestureHandler>
    )
}