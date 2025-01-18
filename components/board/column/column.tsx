import Item from '../item/item';
import { BlurView } from 'expo-blur';
import { boardStyles } from '../styles';
import * as Haptics from 'expo-haptics';
import { SharedContext } from '@/shared/shared';
import { Swipeable } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { Layout } from 'react-native-reanimated';
import CustomTextInput from '@/components/custom-input/custom-input';
import { ColumnType, Directions, ItemType, Views } from '@/shared/types/types';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Alert, LayoutAnimation, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { borderRadius, colors, globalStyles, isLightColor, Text, View } from '@/components/theme/Themed';
import { getItemsForColumn, deleteItemFromDatabase, updateItemFieldsInDatabase, createItem } from '@/shared/server/firebase';
import { delayBeforeScrollingDown, findHighestNumberInArrayByKey, gridSpacing, itemHeight, maxItemNameLength, paginationHeightMargin, toFixedWithoutRounding } from '@/shared/variables';
import LoadingSpinner from '@/components/loading/loading-spinner';

export default function Column({ 
    column, 
    active, 
    swipeCarousel,
    animatedAdjacent, 
    blurIntensity = 0, 
    backgroundColor = colors.transparent, 
}: ColumnType | any) {
    let { 
        items,
        height, 
        selected,
        isDragging,
        slideIndex,
        setDragging, 
        boardColumns,
        itemsLoading,
        activeTopName,
        closeBottomSheet, 
    } = useContext<any>(SharedContext);

    const listRef = useRef(null);

    const loadingMessages = {
        loading: `Loading`,
        zero: `No Items Yet`,
    }

    const [loading,] = useState(false);
    const [itemName, setItemName] = useState(``);
    const [addingItem, setAddingItem] = useState(false);
    const [columnItems, setColumnItems] = useState<ItemType[]>([]);

    const onPlaceHolderIndexChange = (onPlaceHolderIndexChangeData: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    const closeItem = () => {
        Vibration.vibrate(1);
        closeBottomSheet();
    }
    
    const onDragBegin = () => {
        setDragging(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    useEffect(() => {
        let itemsForColumn = getItemsForColumn(items, column?.id);
        setColumnItems(itemsForColumn);
        scrollToEnd();
    }, [items])

    const onCancel = async () => {
        await Vibration.vibrate(1);
        await setItemName(``);
        await setAddingItem(false);
    }

    const onFocus = async () => {
        await Vibration.vibrate(1);
        await setAddingItem(true);
        await scrollToEnd();
    }

    const addItem = async () => {
        await setItemName(``);
        await scrollToEnd();
        await createItem(columnItems, column.id, itemName, items, closeBottomSheet);
    }

    const deleteItem = async (itemID: string = selected?.id) => {
        await setColumnItems(prevItems => prevItems.filter(itm => itm.id != itemID));
        await closeBottomSheet();
        await deleteItemFromDatabase(itemID);
    }

    const scrollToEnd = async (columnRef = listRef) => {
        await setTimeout(() => {
            columnRef.current?.scrollToEnd({ animated: true });
        }, delayBeforeScrollingDown);
    }

    const deleteItemWithConfirmation = (itemID: string = selected?.id) => {
        Vibration.vibrate(1);
        Alert.alert(
            `Delete Item`,
            `Are you sure you want to delete this item?`,
            [
                { text: `Cancel`, style: `cancel` }, 
                { text: `Delete`, style: `destructive`, onPress: () => deleteItem(itemID) }
            ],
            { cancelable: true },
        )
    }

    const onDragEnd = async (onDragEndData: any) => {
        await LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        await setDragging(false);
        let { data } = await onDragEndData;
        await setColumnItems(data);
        if (data?.length > 0) {
            data.forEach((itm, itmIndex) => {
                updateItemFieldsInDatabase(itm?.id, { index: itmIndex + 1 }, true, false);
            })
        }
    }

    const renderDraggableItem = useCallback((dragItemParams: RenderItemParams<ItemType> | any) => {
        let { item, drag, isActive, getIndex } = dragItemParams;

        const swipeableRef = useRef<Swipeable>(null);
        const { items: itemsFromDatabase } = useContext<any>(SharedContext);
     
        const handleSwipe = async (itm: ItemType, direction: Directions) => {
            swipeableRef.current?.close();
            swipeCarousel(direction);
            
            const nextIndex = column.index + (-1 * direction);
            const nextColIndex = nextIndex > boardColumns?.length ? 1 : nextIndex < 1 ? boardColumns?.length : nextIndex;
            const nextColumn = boardColumns?.find(col => col.index == nextColIndex);
            const nextListID = nextColumn?.id;

            let itemsForNextColumn = getItemsForColumn(itemsFromDatabase, nextListID);
            let newIndex = itemsForNextColumn?.length + 1;
            let highestColumnIndex = await findHighestNumberInArrayByKey(itemsForNextColumn, `index`);
            if (highestColumnIndex >= newIndex) newIndex = highestColumnIndex + 1;

            await updateItemFieldsInDatabase(itm?.id, { listID: nextListID, index: newIndex });
        };
        
        const renderRightActions = () => (
            <View style={[titleRowStyles.rightAction, { borderRadius, marginLeft: 8, backgroundColor: colors.mainBG }]}>
                <FontAwesome name={`angle-double-left`} color={colors.white} size={22} style={{ paddingHorizontal: 20, fontWeight: `bold` }} />
            </View>
        );
        
        const renderLeftActions = () => (
            <View style={[titleRowStyles.leftAction, { borderRadius, marginRight: 8, backgroundColor: colors.mainBG }]}>
                <FontAwesome name={`angle-double-right`} color={colors.white} size={22} style={{ paddingHorizontal: 20, fontWeight: `bold` }} />
            </View>
        );

        return (
            <Animated.View layout={Layout.springify()}>
                <Swipeable
                    friction={2}
                    ref={swipeableRef}
                    overshootLeft={false}
                    overshootRight={false}
                    renderLeftActions={renderLeftActions}
                    renderRightActions={renderRightActions}
                    onSwipeableRightOpen={() => handleSwipe(item, Directions.Left)}
                    onSwipeableLeftOpen={() => handleSwipe(item, Directions.Right)}
                    onActivated={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                >
                    <Item
                        item={item}
                        drag={drag}
                        getIndex={getIndex}
                        isActive={isActive}
                        isLast={getIndex() == columnItems.length - 1}
                        keyExtractor={(item: ItemType) => `${item.id}-${item.key}-${item.listID}`}
                    />
                </Swipeable>
            </Animated.View>
        )
    }, [])

    const fontColor = isLightColor(selected?.backgroundColor) ? colors.darkFont : colors.lightFont;

    return (
        <>
            {/* <GestureHandlerRootView> */}
                {/* <PanGestureHandler enabled={!isDragging} onGestureEvent={!isDragging ? handleGesture : null}> */}
                    {/* <> */}
                        <View id={`column_${column?.id}`} style={[
                            {  
                                paddingTop: 5,
                                marginTop: 15,
                                width: `100%`,
                                backgroundColor, 
                                marginHorizontal: `auto`,
                                opacity: (active || !Number.isInteger(slideIndex + 1)) ? 1 : 0.55,
                            }, 
                            animatedAdjacent,
                        ]}>
                            <BlurView intensity={blurIntensity} style={[StyleSheet.absoluteFill, { borderRadius: 12, opacity: 0 }]} />
                            <View style={{ 
                                padding: 0,
                                width: `95%`, 
                                borderRadius: 12, 
                                marginHorizontal: `auto`, 
                                opacity: (active || !Number.isInteger(slideIndex + 1)) ? 1 : 0.35,
                                backgroundColor: selected == null ? colors.listsBG : colors.transparent, 
                            }}>
                                <View style={[titleRowStyles.titleRow, { paddingVertical: 7 }]}>
                                    {selected == null && column?.category && column?.category?.length > 0 ? (
                                        <Text style={[titleRowStyles.subtitle, titleRowStyles.fontColor]}>
                                            {column?.category}
                                        </Text>
                                    ) : (
                                        selected?.type == Views.Item ? (
                                            <TouchableOpacity onPress={() => deleteItemWithConfirmation()} style={[titleRowStyles.topButton, { backgroundColor: selected?.backgroundColor }]}>
                                                <FontAwesome name={`trash`} color={fontColor} size={14} />
                                                <Text style={[{ textAlign: `center`, fontSize: 16, fontWeight: `bold`, color: fontColor }]}>
                                                    Delete
                                                </Text>
                                            </TouchableOpacity>
                                        ) : <></>
                                    )}
                                    <Text numberOfLines={1} ellipsizeMode={`tail`} style={[titleRowStyles.title, titleRowStyles.fontColor, { flexBasis: selected?.type == Views.ItemForm ? `65%` : `45%` }]}>
                                        {selected == null ? (
                                            `${column?.name} ${Number.isInteger(slideIndex + 1) ? slideIndex + 1 : (
                                                toFixedWithoutRounding(slideIndex + 1, 1)
                                            )}`
                                        ) : activeTopName}
                                    </Text>
                                    {selected == null ? (
                                        columnItems && columnItems.length > 0 ? (
                                            <Text style={[titleRowStyles.subtitle, titleRowStyles.fontColor]}>
                                                {columnItems?.length + ` Item(s)`}
                                            </Text>
                                        ) : <>
                                            <Text style={[titleRowStyles.subtitle, titleRowStyles.fontColor]}>
                                                0 Item(s)
                                            </Text>
                                        </>
                                    ) : (
                                        <TouchableOpacity onPress={() => closeItem()} style={[titleRowStyles.topButton, { backgroundColor: selected?.backgroundColor }]}>
                                            <FontAwesome name={`ban`} color={fontColor} size={14} />
                                            <Text style={[{ textAlign: `center`, fontSize: 16, fontWeight: `bold`, color: fontColor }]}>
                                                Close
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {(columnItems?.length > 0) ? (
                                    // <PanGestureHandler enabled={!isDragging} activeOffsetX={[-10, 10]} activeOffsetY={[-10, 10]} onGestureEvent={!isDragging ? handleGesture : null}>
                                        <DraggableFlatList
                                            ref={listRef}
                                            bounces={true}
                                            data={columnItems}
                                            onDragBegin={onDragBegin}
                                            scrollEnabled={!isDragging}
                                            directionalLockEnabled={true}
                                            keyExtractor={(item) => item.id.toString()}
                                            onScrollBeginDrag={() => setDragging(false)}
                                            onDragEnd={(onDragEndData) => onDragEnd(onDragEndData)}
                                            renderItem={(onDragItem: RenderItemParams<ItemType>) => renderDraggableItem(onDragItem)}
                                            onPlaceholderIndexChange={(onPlaceHolderIndexChangeData) => onPlaceHolderIndexChange(onPlaceHolderIndexChangeData)}
                                            style={{ 
                                                height: `auto`, 
                                                maxHeight: addingItem ? ((height - paginationHeightMargin) - 155) : height - paginationHeightMargin, 
                                            }}
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
                                    <View style={{ width: `100%`, backgroundColor: colors.transparent, height: `auto`, paddingVertical: 15, ...globalStyles.flexRow, justifyContent: `center`, gap: 15 }}>
                                        <LoadingSpinner spinning={true} />
                                        <Text style={[boardStyles.cardTitle, { textAlign: `center`, fontStyle: `italic`, fontSize: 16 }]}>
                                            {itemsLoading ? loadingMessages.loading : loadingMessages.zero}
                                        </Text>
                                    </View>
                                )}
                                <View id={`${column.id}-footer`} style={{ backgroundColor: colors.transparent, paddingTop: 5, paddingVertical: 10, width: `100%`, alignItems: `center`, justifyContent: `center`, display: `flex`, gap: 5 }}>
                                    {/* {!addingItem ? (
                                        <TouchableOpacity onPress={() => onAddItem()} style={{ ...titleRowStyles.addItemButton, ...globalStyles.flexRow, backgroundColor: colors.navy, opacity: selected == null ? 1 : 0, justifyContent: `space-around` }}>
                                            <FontAwesome name={`bars`} color={colors.lightBlue} size={20} />
                                            <Text style={[boardStyles.cardTitle, { textAlign: `center`, fontSize: 16, paddingVertical: 10 }]}>
                                                + Add Item
                                            </Text>
                                            <FontAwesome name={`bars`} color={colors.lightBlue} size={20} />
                                        </TouchableOpacity>
                                    ) : ( */}
                                        <View style={[globalStyles.singleLineInput, titleRowStyles.addItemButton, { marginTop: 5, justifyContent: `center`, marginHorizontal: `auto`, opacity: selected == null ? 1 : 0 }]}>
                                            <CustomTextInput
                                                width={`100%`}
                                                value={itemName}
                                                showLabel={false}
                                                endIconName={`save`}
                                                placeholder={`Item Name`}
                                                onFocus={() => onFocus()}
                                                onChangeText={setItemName}
                                                onCancel={() => onCancel()}
                                                maxLength={maxItemNameLength}
                                                endIconPress={() => addItem()}
                                                endIconDisabled={itemName == ``}
                                                onBlur={() => setAddingItem(false)}
                                                doneText={itemName == `` ? `Done` : `Add`}
                                                onDone={itemName == `` ? null : () => addItem()}
                                                cancelColor={itemName == `` ? colors.white : colors.error}
                                                doneColor={itemName == `` ? colors.white : colors.activeColor}
                                                endIconColor={itemName == `` ? colors.disabledFont : colors.inputColor}
                                                extraStyle={{ color: colors.inputColor, width: `83%`, backgroundColor: colors.inputBG }}
                                                style={{ 
                                                    marginBottom: 0, 
                                                    minHeight: itemHeight, 
                                                    ...globalStyles.flexRow, 
                                                }}
                                                endIconStyle={{ 
                                                    minHeight: itemHeight, 
                                                    maxHeight: itemHeight, 
                                                    backgroundColor: itemName == `` ? colors.inputBG : colors.activeColor, 
                                                }}
                                            />
                                        </View>
                                    {/* )} */}
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
        borderRadius: borderRadius - 3,
    },
    itemText: {
        fontSize: 18,
    },
    leftAction: {
        alignItems: `flex-end`,
        justifyContent: `center`,
        backgroundColor: colors.navy,
    },
    rightAction: {
        alignItems: `flex-end`,
        justifyContent: `center`,
        backgroundColor: colors.navy,
    },
    actionText: {
        padding: 1,
        fontSize: 16,
        fontWeight: `bold`,
        fontStyle: `italic`,
        color: colors.white,
    },
    fontColor: { 
        fontWeight: `bold`,
        color: isLightColor(colors.listsBG) ? colors.darkFont : colors.lightFont, 
    },
})