import Column from '../column/column';
import { web } from '@/shared/variables';
import { SharedContext } from '@/shared/shared';
import { colors } from '@/components/theme/Themed';
import SliderPagination from './pagination/pagination';
import React, { useContext, useMemo, useRef } from 'react';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';

export default function Slider({ backgroundColor = colors.transparent }: any) {
    const swiping = useRef(false);
    const carouselRef = useRef<ICarouselInstance>(null);
    const scrollOffsetValue = useSharedValue<number>(0);
    let { 
        width, 
        height,
        selected,
        progress, 
        fadeAnim, 
        slideIndex, 
        sliderMode,
        boardColumns,
        setSlideIndex,
    } = useContext<any>(SharedContext);

    const columnRefs = useMemo(() => {
        return boardColumns.reduce((acc, col) => {
            acc[col.id] = React.createRef();
            return acc;
        }, {});
    }, [boardColumns]);      

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
            }, 0); // Adjust the duration to match the carousel animation speed
        }
    }

    return (
        web() ? (
            <div>Hello</div>
        ) : <>
            <Carousel
                width={width}
                height={height}
                ref={carouselRef}
                mode={sliderMode}
                data={boardColumns}
                onProgressChange={progress}
                loop={boardColumns?.length > 1}
                pagingEnabled={selected == null}
                containerStyle={{ backgroundColor }}
                style={{ backgroundColor: colors.mainBG,}}
                defaultScrollOffsetValue={scrollOffsetValue}
                modeConfig={{ parallaxScrollingScale: 0.99, parallaxAdjacentItemScale: 0.55 }}
                renderItem={({ index, item: column }: any) => (
                    <Column
                        key={index}
                        column={column}
                        height={height}
                        fadeAnim={fadeAnim}
                        columnRefs={columnRefs}
                        carouselRef={carouselRef}
                        swipeCarousel={swipeCarousel}
                        columnRef={columnRefs[column.id]}
                        active={(slideIndex + 1) == column.index}
                    />
                )}
            />

            <SliderPagination carouselRef={carouselRef} />
        </>
    )
}