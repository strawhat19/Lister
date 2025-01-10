import Item from '../item/item';
import * as Haptics from 'expo-haptics';
import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import { runOnJS } from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import { ColumnType, ItemType } from '@/shared/types/types';
import { gridSpacing, paginationHeightMargin } from '../board';
import { PanGestureHandler } from 'react-native-gesture-handler';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

export default function Column({ item, openItem, fadeAnim, swipeCarousel, closeBottomSheet }: ColumnType | any) {
    const { height } = useWindowDimensions();
    let { isDragging, setDragging, setCarouselData } = useContext<any>(SharedContext);

    const handleGesture = (event: any) => {
        'worklet';
        const { translationX, velocityX } = event.nativeEvent;
        const horizontalMovement = Math.abs(translationX) > 15 && Math.abs(velocityX) > 15;
        if (!horizontalMovement) return;
        runOnJS(swipeCarousel)(translationX);
    }

    const ItemDraggable = ({ item, drag, isActive }: RenderItemParams<ItemType>) => {
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

    return (
        <PanGestureHandler enabled={!isDragging} onGestureEvent={handleGesture}>
            <DraggableFlatList
                data={item?.items}
                renderItem={ItemDraggable}
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
                    setCarouselData((prevCarouselData: ColumnType[]) => prevCarouselData.map((list: ColumnType) => {
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
    )
}