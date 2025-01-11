import Item from '../item/item';
import { BlurView } from 'expo-blur';
import { boardStyles } from '../styles';
import * as Haptics from 'expo-haptics';
import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import { runOnJS } from 'react-native-reanimated';
import Animated, { Layout } from 'react-native-reanimated';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { ColumnType, ItemType, SheetComponents } from '@/shared/types/types';
import { borderRadius, colors, Text, View } from '@/components/theme/Themed';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { gridSpacing, paginationHeightMargin, toFixedWithoutRounding } from '@/shared/variables';

export default function Column({ 
    item, 
    active, 
    swipeCarousel, 
    animatedAdjacent, 
    blurIntensity = 0, 
    backgroundColor = colors.mainBG, 
}: ColumnType | any) {
    let { 
        height, 
        selected,
        fadeAnim, 
        slideIndex,
        isDragging, 
        setDragging, 
        carouselData,
        activeTopName,
        setCarouselData, 
        openBottomSheet, 
        closeBottomSheet, 
    } = useContext<any>(SharedContext);

    const handleGesture = (event: any) => {
        'worklet';
        const { translationX, velocityX } = event.nativeEvent;
        const horizontalMovement = Math.abs(translationX) > 15 && Math.abs(velocityX) > 15;
        if (!horizontalMovement) return;
        runOnJS(swipeCarousel)(translationX);
    }

    return (
        <View id={`column_${item?.id}`} style={[
            {  
                backgroundColor, 
                opacity: (active || !Number.isInteger(slideIndex + 1)) ? 1 : 0.55,
            }, 
            animatedAdjacent,
        ]}>
            <BlurView
                intensity={blurIntensity}
                style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
            />
            <View style={titleRowStyles.titleRow}>
                {selected == null && item?.items && item?.items.length > 0 ? (
                    <Text style={titleRowStyles.subtitle}>
                        {item?.category}
                    </Text>
                ) : <></>}
                <Text style={[titleRowStyles.title, { flexBasis: selected != null ? `100%` : `50%` }]}>
                    {selected == null ? (
                        `${item?.name} - ${Number.isInteger(slideIndex + 1) ? slideIndex + 1 : (
                            toFixedWithoutRounding(slideIndex + 1, 2)
                        )}`
                    ) : activeTopName}
                </Text>
                {selected == null && item?.items && item?.items.length > 0 ? (
                    <Text style={titleRowStyles.subtitle}>
                        {item?.items?.length + ` Item(s)`}
                    </Text>
                ) : <></>}
            </View>
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
                            gap: gridSpacing - 7, 
                            marginHorizontal: `auto`, 
                            paddingHorizontal: gridSpacing,  
                        }}
                        onDragEnd={({ data }) => {
                            setDragging(false);
                            const updatedCarouselData = carouselData.map((list: ColumnType) => {
                                if (list.id === data[0].listID) {
                                    return { ...list, items: data };
                                }
                                return list;
                            });
                            setCarouselData(updatedCarouselData);
                        }}
                        renderItem={({ item, drag, isActive }: RenderItemParams<ItemType>) => {
                            return (
                                <Animated.View layout={Layout.springify()}>
                                    <Item
                                        item={item}
                                        drag={drag}
                                        isActive={isActive}
                                        fadeAnim={fadeAnim}
                                        openBottomSheet={openBottomSheet}
                                        closeBottomSheet={closeBottomSheet}
                                        keyExtractor={(item: ItemType) => `${item.id}-${item.key}-${item.listID}`}
                                    />
                                </Animated.View>
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
            <View id={`${item.id}-footer`} style={{ backgroundColor, paddingTop: 10, width: `100%`, alignItems: `center`, justifyContent: `space-between`, display: `flex`, gap: 5 }}>
                <TouchableOpacity 
                    onPress={() => openBottomSheet(new ItemType({
                        ...item,
                        name: `+ Add Item`,
                        type: SheetComponents.ItemForm,
                        summary: `This is the Item Form`,
                        description: `You can use this form to edit or create items`,
                    }), colors.appleBlue)}
                    style={{ opacity: selected == null ? 1 : 0, backgroundColor: colors.appleBlue, width: `92%`, padding: 1, borderRadius: borderRadius - 3 }}
                >
                    <Text style={[boardStyles.cardTitle, { textAlign: `center`, fontSize: 16, paddingVertical: 10 }]}>
                        + Add Item
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const titleRowStyles = StyleSheet.create({
    titleRow: {
        width: `90%`, 
        display: `flex`, 
        flexWrap: `wrap`, 
        flexDirection: `row`, 
        alignItems: `center`,
        marginHorizontal: `auto`, 
        backgroundColor: `transparent`,
        justifyContent: `space-between`,
    },
    title: { 
        fontSize: 20, 
        width: `auto`, 
        paddingTop: 25, 
        color: `white`, 
        flexBasis: `50%`, 
        paddingBottom: 15, 
        fontWeight: `bold`, 
        textAlign: `center`, 
    },
    subtitle: { 
        fontSize: 16, 
        width: `auto`, 
        paddingTop: 25, 
        color: `white`, 
        flexBasis: `25%`, 
        paddingBottom: 15, 
        textAlign: `center`, 
    },
})