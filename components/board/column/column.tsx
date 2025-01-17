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
import { borderRadius, colors, globalStyles, Text, View } from '@/components/theme/Themed';
import { Alert, LayoutAnimation, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { getItemsForColumn, deleteItemFromDatabase, updateItemFieldsInDatabase, createItem } from '@/shared/server/firebase';
import { delayBeforeScrollingDown, findHighestNumberInArrayByKey, gridSpacing, log, maxItemNameLength, paginationHeightMargin, toFixedWithoutRounding } from '@/shared/variables';

export default function Column({ 
    column, 
    active, 
    carouselRef,
    swipeCarousel,
    animatedAdjacent, 
    blurIntensity = 0, 
    backgroundColor = colors.mainBG, 
}: ColumnType | any) {
    let { 
        items,
        height, 
        selected,
        fadeAnim, 
        isDragging,
        slideIndex,
        setDragging, 
        boardColumns,
        activeTopName,
        openBottomSheet, 
        closeBottomSheet, 
    } = useContext<any>(SharedContext);

    const listRef = useRef(null);

    const loadingMessages = {
        loading: `Loading`,
        zero: `No Items Yet`,
    }

    const [itemName, setItemName] = useState(``);
    const [loading, setLoading] = useState(false);
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
    }, [items])

    const onCancel = async () => {
        await Vibration.vibrate(1);
        await setItemName(``);
        await setAddingItem(false);
    }

    const onFocus = async () => {
        await Vibration.vibrate(1);
        await setAddingItem(true);
        await setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, delayBeforeScrollingDown);
    }

    const addItem = async () => {
        await setItemName(``);
        await setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, delayBeforeScrollingDown);
        await createItem(columnItems, column.id, itemName, items, closeBottomSheet);
    }

    const deleteItem = async (itemID: string = selected?.id) => {
        await setColumnItems(prevItems => prevItems.filter(itm => itm.id != itemID));
        await closeBottomSheet();
        await deleteItemFromDatabase(itemID);
    }

    // const itemForm = new ItemType({
    //     ...column,
    //     name: `+ Add Item`,
    //     listID: column?.id,
    //     type: Views.ItemForm,
    //     summary: `This is the Item Form`,
    //     description: `You can use this form to edit or create items`,
    // })

    // const onAddItem = async (openItemForm: boolean = false) => {
    //     if (openItemForm) {
    //         openBottomSheet(itemForm, colors.navy);
    //     } else {
    //         await Vibration.vibrate(1);
    //         await setAddingItem(true);
    //     }
    // }

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
                updateItemFieldsInDatabase(itm?.id, { index: itmIndex + 1 });
            })
        }
    }

    const scrollToEnd = async () => {
        await setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, delayBeforeScrollingDown);
    }

    const renderDraggableItem = useCallback(
        ({ item, drag, isActive, getIndex }: RenderItemParams<ItemType>) => {

        const swipeableRef = useRef<Swipeable>(null);
        const { items: itemsFromDatabase } = useContext<any>(SharedContext);
     
        const handleSwipe = async (itm: ItemType, direction: Directions) => {
            swipeableRef.current?.close();
            carouselRef
            swipeCarousel(direction);
            
            const nextIndex = column.index + (-1 * direction);
            const nextColIndex = nextIndex > boardColumns?.length ? 1 : nextIndex < 1 ? boardColumns?.length : nextIndex;
            const nextColumn = boardColumns?.find(col => col.index == nextColIndex);
            const nextListID = nextColumn?.id;

            let itemsForNextColumn = getItemsForColumn(itemsFromDatabase, nextListID);
            let newIndex = itemsForNextColumn?.length + 1;
            let highestColumnIndex = await findHighestNumberInArrayByKey(itemsForNextColumn, `index`);
            if (highestColumnIndex >= newIndex) newIndex = highestColumnIndex + 1;

            updateItemFieldsInDatabase(itm?.id, { listID: nextListID, index: newIndex });
            scrollToEnd();
        };
        
        const renderRightActions = () => (
            <View style={[titleRowStyles.rightAction, { borderRadius, marginLeft: 8 }]}>
                <FontAwesome name={`chevron-left`} color={colors.white} size={22} style={{ paddingHorizontal: 35 }} />
            </View>
        );
        
        const renderLeftActions = () => (
            <View style={[titleRowStyles.leftAction, { borderRadius, marginRight: 8 }]}>
                <FontAwesome name={`chevron-right`} color={colors.white} size={22} style={{ paddingHorizontal: 35 }} />
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
                        fadeAnim={fadeAnim}
                        openBottomSheet={openBottomSheet}
                        closeBottomSheet={closeBottomSheet}
                        isLast={getIndex() == columnItems.length - 1}
                        keyExtractor={(item: ItemType) => `${item.id}-${item.key}-${item.listID}`}
                    />
                </Swipeable>
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
                                        columnItems && columnItems.length > 0 ? (
                                            <Text style={titleRowStyles.subtitle}>
                                                {columnItems?.length + ` Item(s)`}
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
                                {(!loading || columnItems?.length > 0) ? (
                                    // <PanGestureHandler enabled={!isDragging} activeOffsetX={[-10, 10]} activeOffsetY={[-10, 10]} onGestureEvent={!isDragging ? handleGesture : null}>
                                        <DraggableFlatList
                                            ref={listRef}
                                            bounces={true}
                                            data={columnItems}
                                            onDragBegin={onDragBegin}
                                            scrollEnabled={!isDragging}
                                            directionalLockEnabled={true}
                                            renderItem={renderDraggableItem}
                                            keyExtractor={(item) => item.id.toString()}
                                            onScrollBeginDrag={() => setDragging(false)}
                                            onDragEnd={async (onDragEndData) => await onDragEnd(onDragEndData)}
                                            onPlaceholderIndexChange={async (onPlaceHolderIndexChangeData) => await onPlaceHolderIndexChange(onPlaceHolderIndexChangeData)}
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
                                    <View style={{ width: `100%`, backgroundColor, height: height - paginationHeightMargin, paddingTop: 35 }}>
                                        <Text style={[boardStyles.cardTitle, { textAlign: `center`, fontStyle: `italic`, fontSize: 16 }]}>
                                            {columnItems?.length > 0 ? loadingMessages.zero : loadingMessages.loading}
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
                                        <View style={[globalStyles.singleLineInput, titleRowStyles.addItemButton, { marginTop: 0, justifyContent: `center`, marginHorizontal: `auto` }]}>
                                            <CustomTextInput
                                                width={`100%`}
                                                value={itemName}
                                                showLabel={false}
                                                placeholder={`Name`}
                                                endIconName={`save`}
                                                onFocus={() => onFocus()}
                                                onChangeText={setItemName}
                                                onCancel={() => onCancel()}
                                                maxLength={maxItemNameLength}
                                                endIconPress={() => addItem()}
                                                onBlur={() => setAddingItem(false)}
                                                doneText={itemName == `` ? `Done` : `Add`}
                                                onDone={itemName == `` ? null : () => addItem()}
                                                doneColor={itemName == `` ? colors.disabledFont : colors.white}
                                                cancelColor={itemName == `` ? colors.disabledFont : colors.red}
                                                endIconColor={itemName == `` ? colors.disabledFont : colors.white}
                                                style={{ minHeight: 35, ...globalStyles.flexRow, marginBottom: 0, }}
                                                endIconStyle={{ minHeight: 35, maxHeight: 35, backgroundColor: colors.navy }}
                                                extraStyle={{ color: colors.white, width: `83%`, backgroundColor: colors.navy }}
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
        padding: 20,
        fontSize: 16,
        fontWeight: `bold`,
        fontStyle: `italic`,
        color: colors.white,
    },
})