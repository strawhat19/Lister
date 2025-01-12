import Item from '../item/item';
import { BlurView } from 'expo-blur';
import { boardStyles } from '../styles';
import * as Haptics from 'expo-haptics';
import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import { runOnJS } from 'react-native-reanimated';
import Animated, { Layout } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { ColumnType, ItemType, SheetComponents } from '@/shared/types/types';
import { borderRadius, colors, Text, View } from '@/components/theme/Themed';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { gridSpacing, paginationHeightMargin, toFixedWithoutRounding } from '@/shared/variables';

export default function Column({ 
    column, 
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

    const closeItem = () => {
        Vibration.vibrate(1);
        closeBottomSheet();
    }

    const handleGesture = (event: any) => {
        'worklet';
        const sensitivity = 25;
        const { translationX, velocityX } = event.nativeEvent;
        const horizontalMovement = Math.abs(translationX) > sensitivity && Math.abs(velocityX) > sensitivity;
        if (!horizontalMovement) return;
        runOnJS(swipeCarousel)(translationX);
    }

    const itemForm = new ItemType({
        ...column,
        name: `+ Add Item`,
        listID: column?.id,
        type: SheetComponents.ItemForm,
        summary: `This is the Item Form`,
        description: `You can use this form to edit or create items`,
    })

    const deleteItem = () => {
        const updatedCarouselData = carouselData.map((list: ColumnType) => {
            if (list.id === column?.id) {
                return { 
                    ...list, 
                    items: list.items.filter(itm => itm?.id != selected?.id)
                };
            }
            return list;
        });
        setCarouselData(updatedCarouselData);
        closeItem();
    }

    return (
        <View id={`column_${column?.id}`} style={[
            {  
                width: `100%`,
                marginTop: 15,
                paddingTop: 5,
                backgroundColor, 
                marginHorizontal: `auto`,
                opacity: (active || !Number.isInteger(slideIndex + 1)) ? 1 : 0.55,
            }, 
            animatedAdjacent,
        ]}>
            <BlurView intensity={blurIntensity} style={[StyleSheet.absoluteFill, { borderRadius: 12 }]} />
            <View style={{ 
                padding: 0,
                width: `95%`, 
                borderRadius: 12, 
                marginHorizontal: `auto`, 
                backgroundColor: selected == null ? colors.background : colors.black, 
            }}>
                <View style={[titleRowStyles.titleRow, { paddingVertical: 7 }]}>
                    {selected == null && column?.category && column?.category?.length > 0 ? (
                        <Text style={titleRowStyles.subtitle}>
                            {column?.category}
                        </Text>
                    ) : (
                        selected?.type == SheetComponents.Item ? (
                            <TouchableOpacity onPress={() => deleteItem()} style={{ backgroundColor: colors.red, padding: 5, paddingHorizontal: 10, borderRadius: borderRadius - 3 }}>
                                <Text style={[{ textAlign: `center`, fontSize: 16, fontWeight: `bold` }]}>
                                    X Delete
                                </Text>
                            </TouchableOpacity>
                        ) : <></>
                    )}
                    <Text style={[titleRowStyles.title, { flexBasis: selected?.type == SheetComponents.ItemForm ? `75%` : `50%` }]}>
                        {selected == null ? (
                            `${column?.name} - ${Number.isInteger(slideIndex + 1) ? slideIndex + 1 : (
                                toFixedWithoutRounding(slideIndex + 1, 1)
                            )}`
                        ) : activeTopName}
                    </Text>
                    {selected == null ? (
                        column?.items && column?.items.length > 0 ? (
                            <Text style={titleRowStyles.subtitle}>
                                {column?.items?.length + ` Item(s)`}
                            </Text>
                        ) : <>
                            <Text style={titleRowStyles.subtitle}>
                                0 Item(s)
                            </Text>
                        </>
                    ) : (
                        <TouchableOpacity onPress={() => closeItem()} style={{ backgroundColor: colors.navy, padding: 5, paddingHorizontal: 10, borderRadius: borderRadius - 3 }}>
                            <Text style={[{ textAlign: `center`, fontSize: 16, fontWeight: `bold` }]}>
                                X Close
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                {column?.items?.length > 0 ? (
                    <PanGestureHandler enabled={!isDragging} onGestureEvent={handleGesture}>
                        <DraggableFlatList
                            data={column?.items}
                            keyExtractor={(item) => `${item.id}-${item?.key}`}
                            style={{ height: height - paginationHeightMargin }}
                            onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                            onDragBegin={() => {
                                setDragging(true);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                            }}
                            contentContainerStyle={{ 
                                width: `100%`,
                                gap: gridSpacing - 8, 
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
                    <View style={{ width: `100%`, backgroundColor, height: height - paginationHeightMargin, paddingTop: 35 }}>
                        <Text style={[boardStyles.cardTitle, { textAlign: `center`, fontStyle: `italic`, fontSize: 16 }]}>
                            No Items Yet
                        </Text>
                    </View>
                )}
                <View id={`${column.id}-footer`} style={{ backgroundColor: colors.transparent, paddingTop: 5, paddingVertical: 10, width: `100%`, alignItems: `center`, justifyContent: `space-between`, display: `flex`, gap: 5 }}>
                    <TouchableOpacity 
                        onPress={() => openBottomSheet(itemForm, colors.navy)}
                        style={{ opacity: selected == null ? 1 : 0, backgroundColor: colors.navy, width: `92%`, padding: 1, borderRadius: borderRadius - 3 }}
                    >
                        <Text style={[boardStyles.cardTitle, { textAlign: `center`, fontSize: 16, paddingVertical: 10 }]}>
                            + Add Item
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export const titleRowStyles = StyleSheet.create({
    titleRow: {
        width: `100%`, 
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
        color: `white`, 
        fontWeight: `bold`, 
        textAlign: `center`, 
    },
    subtitle: { 
        fontSize: 16, 
        width: `auto`, 
        color: `white`, 
        flexBasis: `25%`, 
        textAlign: `center`, 
    },
})