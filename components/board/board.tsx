import Column from './column/column';
import { BlurView } from 'expo-blur';
import { boardStyles } from './styles';
import { web } from '@/shared/variables';
import SlideUp from '../slide-up/slide-up';
import BottomSheet from '@gorhom/bottom-sheet';
import { SharedContext } from '@/shared/shared';
import { SheetComponents } from '@/shared/types/types';
import { useSharedValue } from 'react-native-reanimated';
import { defaultVertImageCards } from '@/shared/database';
import React, { useContext, useRef, useState } from 'react';
import { colors, Text, View, borderRadius } from '@/components/theme/Themed';
import { Animated, TouchableOpacity, Vibration, useWindowDimensions } from 'react-native';
import Carousel, { Pagination, ICarouselInstance } from 'react-native-reanimated-carousel';

export const gridSpacing = 15;
export const animationDuration = 300;
export const paginationHeightMargin = 200;
export const cardImageWidth = web() ? `25%` : `33%`;

export const defaultBoardColumns = [
    { 
        name: `Items`, 
        category: `Items`,
        id: `1-listColumn-items`,
        items: [defaultVertImageCards[0], defaultVertImageCards[1]],
    }, 
    { 
        name: `Active`, 
        category: `Active`,
        id: `2-listColumn-active`,
        items: [defaultVertImageCards[2], defaultVertImageCards[3]],
    },
    { 
        name: `Complete`, 
        category: `Complete`,
        id: `3-listColumn-complete`,
        items: [defaultVertImageCards[4], defaultVertImageCards[5], defaultVertImageCards[6]],
    },
]

export default function Board() {
    let { setSelected, carouselData } = useContext<any>(SharedContext);
    
    const progress = useSharedValue<number>(0);
    const { width, height } = useWindowDimensions();
    const scrollOffsetValue = useSharedValue<number>(0);
    const carouselRef = useRef<ICarouselInstance>(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const blurBGContainerOpacity = useRef(new Animated.Value(0)).current;

    const [blur,] = useState<any>(100);
    const [indx, setIndx] = useState(0);
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

    const onPressPagination = (index: number) => {
        carouselRef.current?.scrollTo({
          count: index - progress.value,
          animated: true,
        });
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
            toValue: 0.25,
            duration: animationDuration,
            useNativeDriver: true,
        }).start();
        
        Animated.timing(blurBGContainerOpacity, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
        }).start();
    }

    const exitFadeBlur = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
        }).start();

        Animated.timing(blurBGContainerOpacity, {
            toValue: 0,
            duration: animationDuration,
            useNativeDriver: true,
        }).start();
    }

    return <>
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
                <>
                    {item?.items?.length > 0 ? (
                        <Column
                            key={index}
                            item={item}
                            openItem={openItem}
                            fadeAnim={fadeAnim}
                            swipeCarousel={swipeCarousel}
                            closeBottomSheet={closeBottomSheet}
                        />
                    ) : (
                        <View style={{ width: `100%`, height: height - paginationHeightMargin, paddingTop: 35 }}>
                            <Text style={[boardStyles.cardTitle, { textAlign: `center`, fontStyle: `italic`, fontSize: 16 }]}>
                                No Items Yet
                            </Text>
                        </View>
                    )}
                    <View id={`${item.id}-footer`} style={{ paddingTop: 10, marginTop: -35, width: `100%`, alignItems: `center`, justifyContent: `space-between`, display: `flex`, gap: 5 }}>
                        <Text style={[boardStyles.cardTitle, { textAlign: `center`, fontStyle: `italic`, fontSize: 16 }]}>
                            {item?.name}    
                        </Text>
                        <TouchableOpacity 
                            onPress={() => openItem(item, SheetComponents.ItemForm)}
                            style={{ backgroundColor: colors.appleBlue, width: `92%`, padding: 1, borderRadius: borderRadius - 3 }}
                        >
                            <Text style={[boardStyles.cardTitle, { textAlign: `center`, fontSize: 16, paddingVertical: 10 }]}>
                                + Add Item
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        />

        <View style={{ flex: 1, width: `100%`, marginTop: -1 * (paginationHeightMargin - 55), pointerEvents: `none` }}>
            <Pagination.Basic
                size={8}
                data={carouselData}
                progress={progress}
                onPress={onPressPagination}
                containerStyle={{ gap: 10, }}
                activeDotStyle={{ backgroundColor: `#fff` }}
                dotStyle={{ backgroundColor: `rgba(255, 255, 255, 0.5)`, borderRadius: 40 }}
            />
        </View>

        <Animated.View 
            id={`blurBGContainer`} 
            style={[
                boardStyles.absolute, 
                { 
                    pointerEvents: `none`, 
                    opacity: blurBGContainerOpacity, 
                    ...(web() && { backgroundColor: `rgba(0, 0, 0, 0.4)` }), 
                },
            ]}
        >
            {web() ? <></> : <BlurView id={`blurBG`} intensity={blur} tint={`dark`} style={boardStyles.absolute} />}
        </Animated.View>

        <SlideUp 
            indx={indx} 
            onSheetChange={onSheetChange} 
            closeBottomSheet={closeBottomSheet} 
        />
    </>
}