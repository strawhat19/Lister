import Column from '../column/column';
import { TouchableOpacity } from 'react-native';
import { SharedContext } from '@/shared/shared';
import { SliderModes } from '@/shared/types/types';
import SliderPagination from './pagination/pagination';
import { hapticFeedback, web } from '@/shared/variables';
import React, { useContext, useMemo, useRef } from 'react';
import { colors, Text, View } from '@/components/theme/Themed';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';

export default function Slider({ backgroundColor = colors.transparent }: any) {
    const swiping = useRef(false);
    const carouselRef = useRef<ICarouselInstance>(null);
    const scrollOffsetValue = useSharedValue<number>(0);
    let { 
        user,
        width, 
        height,
        selected,
        progress, 
        fadeAnim, 
        slideIndex, 
        boardColumns,
        setSlideIndex,
        sliderModeParallax, 
        setSliderModeParallax,
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

    const onBoardRowPress = () => {
        setSliderModeParallax(!sliderModeParallax);
        hapticFeedback();
    }

    const swipeCarousel = (translationX) => {
        if (selected == null && !swiping.current) {
            swiping.current = true;
            carouselRef.current?.scrollTo({
                count: translationX > 0 ? -1 : 1,
                animated: true,
            });
            setTimeout(() => {
                swiping.current = false;
            }, 0);
        }
    }

    return (
        web() ? (
            <div>Hello</div>
        ) : user == null ? <>
            {/* Empty */}
        </> : 
        <>
            {selected == null && (
                <View style={{ width: `100%`, backgroundColor: colors.mainBG, justifyContent: `center`, alignItems: `center`, paddingTop: 20 }}>
                    <TouchableOpacity onPress={() => onBoardRowPress()} style={{ width: `100%`, backgroundColor: colors.mainBG, justifyContent: `center`, alignItems: `center`, paddingVertical: 5, }}>
                        <Text style={{ fontSize: 22, fontStyle: `italic`, fontWeight: `bold`, color: colors.white }}>
                            Board
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <Carousel
                width={width}
                height={height}
                ref={carouselRef}
                data={boardColumns}
                enabled={selected == null}
                onProgressChange={progress}
                loop={boardColumns?.length > 1}
                pagingEnabled={selected == null}
                containerStyle={{ backgroundColor }}
                style={{ backgroundColor: colors.mainBG, }}
                defaultScrollOffsetValue={scrollOffsetValue}
                mode={sliderModeParallax == true ? SliderModes.Parallax : undefined}
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