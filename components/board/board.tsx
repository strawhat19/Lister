import Item from './item';
import ItemForm from './item-form';
import { BlurView } from 'expo-blur';
import { boardStyles } from './styles';
import * as Haptics from 'expo-haptics';
import { web } from '@/shared/variables';
import ItemDetailView from './item-detail-view';
import { SharedContext } from '@/shared/shared';
import { runOnJS } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';
import { defaultVertImageCards } from '@/shared/database';
import React, { useContext, useRef, useState } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { appleBlue, Text, View, borderRadius } from '@/components/theme/Themed';
import { ListColumn, SheetComponents, VertImageCard } from '@/shared/types/types';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
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
    let { selected, setSelected } = useContext<any>(SharedContext);
    
    const progress = useSharedValue<number>(0);
    const { width, height } = useWindowDimensions();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const scrollOffsetValue = useSharedValue<number>(0);
    const carouselRef = useRef<ICarouselInstance>(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const blurBGContainerOpacity = useRef(new Animated.Value(0)).current;

    const [blur,] = useState<any>(100);
    const [indx, setIndx] = useState(0);
    const [snapPoints] = useState([`1%`, `85%`]);
    const [isDragging, setDragging] = useState(false);
    const [carouselData, setCarouselData] = useState<ListColumn[]>(defaultBoardColumns);
    const [sheetComponent, setSheetComponent] = useState<SheetComponents>(SheetComponents.ItemForm);

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

    const handleGesture = (event: any) => {
        'worklet';
        const { translationX, velocityX } = event.nativeEvent;
        const horizontalMovement = Math.abs(translationX) > 15 && Math.abs(velocityX) > 15;
        if (!horizontalMovement) return;
        runOnJS(swipeCarousel)(translationX);
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

    const boardColumnItem = ({ item, drag, isActive }: RenderItemParams<VertImageCard>) => {
        return (
            <Item
                item={item}
                drag={drag}
                isActive={isActive}
                fadeAnim={fadeAnim}
                openItem={openItem}
                closeBottomSheet={closeBottomSheet}
            />
        )
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
                        <PanGestureHandler enabled={!isDragging} onGestureEvent={handleGesture}>
                            <DraggableFlatList
                                data={item?.items}
                                renderItem={boardColumnItem}
                                keyExtractor={(item) => item?.key}
                                style={{ height: height - paginationHeightMargin }}
                                onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                                onDragBegin={() => {
                                    setDragging(true);
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                                }}
                                contentContainerStyle={{ 
                                    width: `100%`,
                                    gap: gridSpacing - 2, 
                                    padding: gridSpacing,  
                                    marginHorizontal: `auto`, 
                                }}
                                onDragEnd={({ data }) => {
                                    setDragging(false);
                                    setCarouselData((prevCarouselData: ListColumn[]) => prevCarouselData.map((list: ListColumn) => {
                                        if (list.id == data[0].listID) {
                                            return {
                                                ...list,
                                                items: data,
                                            }
                                        }
                                        return list;
                                    }))
                                }}
                            />
                        </PanGestureHandler>
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
                            style={{ backgroundColor: appleBlue, width: `92%`, padding: 1, borderRadius: borderRadius - 3 }}
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

        <BottomSheet
            index={indx}
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            onChange={onSheetChange}
            onClose={closeBottomSheet}
            enableHandlePanningGesture={!web()}
            enableContentPanningGesture={!web()}
            handleIndicatorStyle={boardStyles.handleStyle} // Hide handle on web
            enablePanDownToClose={true} // Only enable drag to close on mobile
            backgroundStyle={{ ...boardStyles.bottomSheetBackground, ...(selected != null && {backgroundColor: selected.backgroundColor}) }}
        >
            <BottomSheetView style={boardStyles.contentContainer}>
                <>
                    {selected != null ? <>
                        {sheetComponent == SheetComponents.ItemForm && <ItemForm />}
                        {sheetComponent == SheetComponents.Item && <ItemDetailView selected={selected} />}
                    </> : <></>}
                </>
            </BottomSheetView>
        </BottomSheet>
    </>
}