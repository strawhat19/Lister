import Item from '../item/item';
import { BlurView } from 'expo-blur';
import { boardStyles } from '../styles';
import * as Haptics from 'expo-haptics';
import { SharedContext } from '@/shared/shared';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { Layout, runOnJS } from 'react-native-reanimated';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ColumnType, ItemType, Views } from '@/shared/types/types';
import { borderRadius, colors, globalStyles, Text, View } from '@/components/theme/Themed';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { Alert, LayoutAnimation, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
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

    const loadingMessages = {
        loading: `Loading`,
        zero: `No Items Yet`,
    }

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState(column?.items);

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
        type: Views.ItemForm,
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

    const onDragEnd = async (onDragEndData: any) => {
        // setLoading(true);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setDragging(false);
        let { data } = onDragEndData;
        const updatedItems = data?.map((item, itemIndex) => ({ ...item, index: itemIndex + 1}));
        await setItems(updatedItems);
    }

    // useEffect(() => {
    //     setLoading(false);
    // }, [columnData])

    useEffect(() => {
       let thisColumn = board?.find(col => col?.id == column.id);
       if (thisColumn) {
        setItems(thisColumn?.items);
       }  
    }, [board])

    const deleteItem = () => {
        const updatedBoardData = board.map((list: ColumnType, listIndex) => {
            let updatedIndexList = { ...list, index: listIndex + 1 };
            if (list.id === column?.id) {
                return { 
                    ...updatedIndexList, 
                    items: list.items.filter(itm => itm?.id != selected?.id)
                }
            }
            return updatedIndexList;
        });
        setBoard(updatedBoardData);
        closeItem();
    }

    const renderDraggableItem = useCallback(
        ({ item, drag, isActive, getIndex }: RenderItemParams<ItemType>) => {
        return (
            <Animated.View layout={Layout.springify()}>
                <Item
                    item={item}
                    drag={drag}
                    getIndex={getIndex}
                    isActive={isActive}
                    fadeAnim={fadeAnim}
                    openBottomSheet={openBottomSheet}
                    closeBottomSheet={closeBottomSheet}
                    keyExtractor={(item: ItemType) => `${item.id}-${item.key}-${item.listID}`}
                />
            </Animated.View>
        )
    }, [])

    // const handleGesture = (event: any) => {
    //     'worklet';

    //     log(`gesture`);

    //     if (isDragging) return; // Skip if dragging or swiping is locked

    //     const sensitivity = 20; // Adjust sensitivity for horizontal swipe
    //     const { translationX, translationY, velocityX } = event.nativeEvent;

    //     // Determine if the gesture is primarily horizontal
    //     const isHorizontalSwipe =
    //         Math.abs(translationX) > Math.abs(translationY) && // Horizontal motion dominates
    //         Math.abs(translationX) > sensitivity && // Sufficient horizontal movement
    //         Math.abs(velocityX) > sensitivity; // Sufficient horizontal velocity

    //     if (isHorizontalSwipe) {
    //         runOnJS(swipeCarousel)(translationX); // Trigger swipeCarousel with translationX
    //     }
    // }

    return (
        <>
            {/* <GestureHandlerRootView> */}
                {/* <PanGestureHandler enabled={!isDragging} onGestureEvent={!isDragging ? handleGesture : null}> */}
                    {/* <> */}
                        <View id={`column_${column?.id}`} style={[
                            {  
                                // top: 0,
                                // left: 0,
                                // zIndex: -1,
                                // height: `100%`,
                                // position: `absolute`,
                                // pointerEvents: `auto`,

                                width: `100%`,
                                paddingTop: 5,
                                marginTop: 15,
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
                                        selected?.type == Views.Item ? (
                                            <TouchableOpacity onPress={() => deleteItemWithConfirmation()} style={[titleRowStyles.topButton, { backgroundColor: colors.red }]}>
                                                <FontAwesome name={`trash`} color={colors.white} size={14} />
                                                <Text style={[{ textAlign: `center`, fontSize: 16, fontWeight: `bold` }]}>
                                                    Delete
                                                </Text>
                                            </TouchableOpacity>
                                        ) : <></>
                                    )}
                                    <Text style={[titleRowStyles.title, { flexBasis: selected?.type == Views.ItemForm ? `70%` : `50%` }]}>
                                        {selected == null ? (
                                        `${column?.name} - ${Number.isInteger(slideIndex + 1) ? slideIndex + 1 : (
                                                toFixedWithoutRounding(slideIndex + 1, 1)
                                            )}`
                                        ) : activeTopName}
                                    </Text>
                                    {selected == null ? (
                                        items && items.length > 0 ? (
                                            <Text style={titleRowStyles.subtitle}>
                                                {items?.length + ` Item(s)`}
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
                                {(!loading || items?.length > 0) ? (
                                    // <PanGestureHandler enabled={!isDragging} activeOffsetX={[-10, 10]} activeOffsetY={[-10, 10]} onGestureEvent={!isDragging ? handleGesture : null}>
                                        <DraggableFlatList
                                            bounces={true}
                                            data={items}
                                            onDragBegin={onDragBegin}
                                            scrollEnabled={!isDragging}
                                            directionalLockEnabled={true}
                                            renderItem={renderDraggableItem}
                                            keyExtractor={(item) => item.id.toString()}
                                            onScrollBeginDrag={() => setDragging(false)}
                                            onDragEnd={async (onDragEndData) => await onDragEnd(onDragEndData)}
                                            style={{ height: `auto`, maxHeight: height - paginationHeightMargin}}
                                            onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                                            contentContainerStyle={{
                                                width: `100%`,
                                                height: `auto`,
                                                paddingBottom: 2,
                                                gap: gridSpacing - 8,
                                                marginHorizontal: `auto`,
                                                paddingHorizontal: gridSpacing,
                                            }}
                                        />
                                    // </PanGestureHandler>
                                ) : (
                                    <View style={{ width: `100%`, backgroundColor, height: height - paginationHeightMargin, paddingTop: 35 }}>
                                        <Text style={[boardStyles.cardTitle, { textAlign: `center`, fontStyle: `italic`, fontSize: 16 }]}>
                                            {items?.length > 0 ? loadingMessages.zero : loadingMessages.loading}
                                        </Text>
                                    </View>
                                )}
                                <View id={`${column.id}-footer`} style={{ backgroundColor: colors.transparent, paddingTop: 5, paddingVertical: 10, width: `100%`, alignItems: `center`, justifyContent: `space-between`, display: `flex`, gap: 5 }}>
                                    <TouchableOpacity  onPress={() => openBottomSheet(itemForm, colors.navy)} style={{ ...titleRowStyles.addItemButton, ...globalStyles.flexRow, opacity: selected == null ? 1 : 0, justifyContent: `space-around` }}>
                                        <FontAwesome name={`bars`} color={colors.lightBlue} size={20} />
                                        <Text style={[boardStyles.cardTitle, { textAlign: `center`, fontSize: 16, paddingVertical: 10 }]}>
                                            + Add Item
                                        </Text>
                                        <FontAwesome name={`bars`} color={colors.lightBlue} size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    {/* </> */}
                {/* </PanGestureHandler> */}
            {/* </GestureHandlerRootView> */}
        </>
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
    addItemButton: {
        padding: 1, 
        width: `92%`, 
        backgroundColor: colors.navy, 
        borderRadius: borderRadius - 3,
    },
})