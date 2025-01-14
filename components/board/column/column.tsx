import Item from '../item/item';
import { BlurView } from 'expo-blur';
import { boardStyles } from '../styles';
import * as Haptics from 'expo-haptics';
import { SharedContext } from '@/shared/shared';
import React, { useCallback, useContext } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { Layout, runOnJS } from 'react-native-reanimated';
import { ColumnType, ItemType, SheetComponents } from '@/shared/types/types';
import { borderRadius, colors, Text, View } from '@/components/theme/Themed';
import { Alert, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { gridSpacing, log, paginationHeightMargin, toFixedWithoutRounding } from '@/shared/variables';

export default function Column({ 
    column, 
    active, 
    swipeCarousel,
    animatedAdjacent, 
    blurIntensity = 0, 
    backgroundColor = colors.mainBG, 
}: ColumnType | any) {
    let { 
        users,
        board,
        height, 
        setBoard, 
        selected,
        fadeAnim, 
        isDragging,
        slideIndex,
        setDragging, 
        activeTopName,
        openBottomSheet, 
        closeBottomSheet, 
    } = useContext<any>(SharedContext);

    const closeItem = () => {
        Vibration.vibrate(1);
        closeBottomSheet();
    }

    const onDragBegin = () => {
        setDragging(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    const itemForm = new ItemType({
        ...column,
        name: `+ Add Item`,
        listID: column?.id,
        type: SheetComponents.ItemForm,
        summary: `This is the Item Form`,
        description: `You can use this form to edit or create items`,
    })

    const deleteItemWithConfirmation = () => {
        Vibration.vibrate(1);
        Alert.alert(
            `Delete Item`,
            `Are you sure you want to delete this item?`,
            [{ text: `Cancel`, style: `cancel` }, { text: `Delete`, style: `destructive`, onPress: () => deleteItem() }],
            { cancelable: true },
        )
    }

    const onDragEnd = (onDragEndData: any) => {
        setDragging(false);
        log(`onDragEndData`, onDragEndData);
        let { data } = onDragEndData;
        const updatedBoardData = board.map((list: ColumnType) => {
            if (list.id === data[0].listID) {
                return { ...list, items: data };
            }
            return list;
        })
        setBoard(updatedBoardData);
    }

    const handleGesture = (event: any) => {
        'worklet';
        if (isDragging) return; // Skip if dragging or swiping is locked
        log(`gesture inner`);

        const sensitivity = 30; // Adjust sensitivity for horizontal swipe
        const { translationX, translationY, velocityX } = event.nativeEvent;

        // Determine if the gesture is primarily horizontal
        const isHorizontalSwipe =
            Math.abs(translationX) > Math.abs(translationY) && // Horizontal motion dominates
            Math.abs(translationX) > sensitivity && // Sufficient horizontal movement
            Math.abs(velocityX) > sensitivity; // Sufficient horizontal velocity

        if (isHorizontalSwipe) {
            log(`horizontal inner`, isHorizontalSwipe);
            runOnJS(swipeCarousel)(translationX); // Trigger swipeCarousel with translationX
        }
    }

    const renderDraggableItem = useCallback(
        ({ item, drag, isActive }: RenderItemParams<ItemType>) => {
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
    }, [])

    const deleteItem = () => {
        const updatedBoardData = board.map((list: ColumnType) => {
            if (list.id === column?.id) {
                return { 
                    ...list, 
                    items: list.items.filter(itm => itm?.id != selected?.id)
                }
            }
            return list;
        });
        setBoard(updatedBoardData);
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
                            <TouchableOpacity onPress={() => deleteItemWithConfirmation()} style={[titleRowStyles.topButton, { backgroundColor: colors.red }]}>
                                <FontAwesome name={`trash`} color={colors.white} size={14} />
                                <Text style={[{ textAlign: `center`, fontSize: 16, fontWeight: `bold` }]}>
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        ) : <></>
                    )}
                    <Text style={[titleRowStyles.title, { flexBasis: selected?.type == SheetComponents.ItemForm ? `70%` : `50%` }]}>
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
                        <TouchableOpacity onPress={() => closeItem()} style={[titleRowStyles.topButton, { backgroundColor: colors.navy }]}>
                            <FontAwesome name={`ban`} color={colors.white} size={14} />
                            <Text style={[{ textAlign: `center`, fontSize: 16, fontWeight: `bold` }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                {column?.items?.length > 0 ? (
                    // <PanGestureHandler waitFor={carouselRef} enabled={!isDragging} onGestureEvent={!isDragging ? handleGesture : null}>
                        <DraggableFlatList
                            bounces={true}
                            data={column?.items}
                            onDragBegin={onDragBegin}
                            directionalLockEnabled={true}
                            renderItem={renderDraggableItem}
                            keyExtractor={(item) => `${item.id}-${item?.key}`}
                            style={{ height: height - paginationHeightMargin }}
                            onDragEnd={(onDragEndData) => onDragEnd(onDragEndData)}
                            onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                            contentContainerStyle={{
                                width: `100%`,
                                paddingBottom: 3,
                                gap: gridSpacing - 8,
                                marginHorizontal: `auto`,
                                paddingHorizontal: gridSpacing,
                            }}
                        />
                    // </PanGestureHandler>
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
    topButton: {
        gap: 5,
        padding: 5, 
        display: `flex`,
        flexDirection: `row`,
        alignItems: `center`,
        paddingHorizontal: 10, 
        borderRadius: borderRadius - 3, 
    },
})