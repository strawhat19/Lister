import Item from '../item/item';
import { boardStyles } from '../styles';
import * as Haptics from 'expo-haptics';
import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import { TouchableOpacity } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { gridSpacing, paginationHeightMargin } from '@/shared/variables';
import { borderRadius, colors, Text, View } from '@/components/theme/Themed';
import { ColumnType, ItemType, SheetComponents } from '@/shared/types/types';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

export default function Column({ item, openItem, fadeAnim, swipeCarousel, closeBottomSheet, height }: ColumnType | any) {
    let { isDragging, setDragging, setCarouselData } = useContext<any>(SharedContext);

    const handleGesture = (event: any) => {
        'worklet';
        const { translationX, velocityX } = event.nativeEvent;
        const horizontalMovement = Math.abs(translationX) > 15 && Math.abs(velocityX) > 15;
        if (!horizontalMovement) return;
        runOnJS(swipeCarousel)(translationX);
    }

    return (
        <>
            {item?.items?.length > 0 ? (
                <PanGestureHandler enabled={!isDragging} onGestureEvent={handleGesture}>
                    <DraggableFlatList
                        data={item?.items}
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
                        renderItem={({ item, drag, isActive }: RenderItemParams<ItemType>) => {
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
                    style={{ backgroundColor: colors.appleBlue, width: `92%`, padding: 1, borderRadius: borderRadius - 3 }}
                >
                    <Text style={[boardStyles.cardTitle, { textAlign: `center`, fontSize: 16, paddingVertical: 10 }]}>
                        + Add Item
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    )
}