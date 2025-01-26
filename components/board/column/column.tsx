import Item from '../item/item';
import { BlurView } from 'expo-blur';
import { boardStyles } from '../styles';
import * as Haptics from 'expo-haptics';
import { SharedContext } from '@/shared/shared';
import { doc, writeBatch } from 'firebase/firestore';
import { Swipeable } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { Layout } from 'react-native-reanimated';
import LoadingSpinner from '@/components/loading/loading-spinner';
import ForwardRefInput from '@/components/custom-input/forward-ref-input';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { ColumnType, Directions, ItemType, ItemViews } from '@/shared/types/types';
import { Alert, ListRenderItemInfo, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { borderRadius, colors, getFontColor, getFontColorForBackground, globalStyles, Text, View } from '@/components/theme/Themed';
import ReorderableList, { ReorderableListReorderEvent, reorderItems, useIsActive, useReorderableDrag } from 'react-native-reorderable-list';
import { getItemsForColumn, deleteItemFromDatabase, createItem, db, itemsDatabaseCollection, updateItemFieldsInDatabase } from '@/shared/server/firebase';
import { delayBeforeScrollingDown, findHighestNumberInArrayByKey, gridSpacing, itemHeight, maxItemNameLength, paginationHeightMargin, toFixedWithoutRounding } from '@/shared/variables';

export const defaultColumnView = ItemViews.Items;

export default function Column({ 
    column, 
    active, 
    swipeCarousel,
    animatedAdjacent, 
    blurIntensity = 0, 
}: ColumnType | any) {
    let { 
        items,
        height, 
        setView,
        selected,
        slideIndex,
        boardColumns,
        itemsLoading,
        activeTopName,
        selectedColor,
        colorPickerOpen,
        openBottomSheet,
        closeBottomSheet, 
    } = useContext<any>(SharedContext);

    const listRef = useRef(null);
    const fontColor = getFontColor(selected?.backgroundColor);

    const loadingMessages = {
        loading: `Loading`,
        zero: `No Items Yet`,
    }

    const [itemName, setItemName] = useState(``);
    const [addingItem, setAddingItem] = useState(false);
    const [columnItems, setColumnItems] = useState<ItemType[]>([]);

    const Card: React.FC<any> = memo(({id, index, item}) => {
        const isActive = useIsActive();
        const drag = useReorderableDrag();
        const swipeableRef = useRef<Swipeable>(null);
      
        const activateDrag = () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          drag();
        }

        const renderRightActions = () => (
            <View style={[titleRowStyles.rightAction, { borderRadius, marginLeft: 8, backgroundColor: colors.white }]}>
                <FontAwesome name={`angle-double-left`} color={colors.darkFont} size={35} style={{ paddingHorizontal: 15, fontWeight: `bold` }} />
            </View>
        );
        
        const renderLeftActions = () => (
            <View style={[titleRowStyles.leftAction, { borderRadius, marginRight: 8, backgroundColor: colors.white }]}>
                <FontAwesome name={`angle-double-right`} color={colors.darkFont} size={35} style={{ paddingHorizontal: 15, fontWeight: `bold` }} />
            </View>
        );

        const handleSwipe = async (itm: ItemType, direction: Directions) => {
            swipeableRef.current?.close();
            swipeCarousel(direction);
            
            const nextIndex = column.index + (-1 * direction);
            const nextColIndex = nextIndex > boardColumns?.length ? 1 : nextIndex < 1 ? boardColumns?.length : nextIndex;
            const nextColumn = boardColumns?.find(col => col.index == nextColIndex);
            const nextListID = nextColumn?.id;

            let itemsForNextColumn = getItemsForColumn(items, nextListID);
            let newIndex = itemsForNextColumn?.length + 1;
            let highestColumnIndex = await findHighestNumberInArrayByKey(itemsForNextColumn, `index`);
            if (highestColumnIndex >= newIndex) newIndex = highestColumnIndex + 1;

            await updateItemFieldsInDatabase(itm?.id, { listID: nextListID, index: newIndex });
        };
      
        return (
            <Animated.View key={id} layout={Layout.springify()}>
                <Swipeable
                    friction={2}
                    enabled={true}
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
                        index={index}
                        isActive={isActive}
                        drag={activateDrag}
                        isLast={index == columnItems.length}
                        keyExtractor={(item: ItemType) => item.id}
                    />
                </Swipeable>
            </Animated.View>
        );
    });
    
    const closeItem = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        closeBottomSheet();
    }

    const openColumnDetails = () => {
        setView(ItemViews.Items);
        openBottomSheet(column, colors.listsBG);
    }

    useEffect(() => {
        let itemsForColumn = getItemsForColumn(items, column?.id);
        setColumnItems(itemsForColumn);
        scrollToEnd();
    }, [items])

    const onCancel = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        // await Vibration.vibrate(1);
        await setItemName(``);
        await setAddingItem(false);
    }

    const onFocus = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        // await Vibration.vibrate(1);
        await setAddingItem(true);
        await scrollToEnd();
    }

    const addItem = async () => {
        await setItemName(``);
        await createItem(columnItems, column.id, itemName, items, closeBottomSheet);
        await scrollToEnd();
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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
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
    
    const renderItem = ({item, index}: ListRenderItemInfo<ItemType>) => {
        delete item.key;
        return (
            <Card {...item} key={item.id} index={index} item={item} />
        )
    };

    const onReorder = ({from, to}: ReorderableListReorderEvent) => {
        setColumnItems(value => {
            let updatedItems = reorderItems(value, from, to);
            const batch = writeBatch(db);
            updatedItems.forEach((itm, itmIndex) => {
                const now = new Date().toLocaleString(`en-US`);
                const itemRef = doc(db, itemsDatabaseCollection, itm?.id);
                batch.update(itemRef, { index: itmIndex + 1, updated: now });
            })
            batch.commit();
            return updatedItems;
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    };

    return (
        <View id={`column_${column?.id}`} style={[
            {  
                paddingTop: 5,
                width: `100%`,
                borderWidth: 0,
                marginHorizontal: `auto`,
                borderColor: colors.transparent,
                backgroundColor: colors.transparent,
                marginTop: selected == null ? 0 : 15,
                opacity: (active || !Number.isInteger(slideIndex + 1)) ? 1 : 0.55,
            }, 
            animatedAdjacent,
        ]}>
            <BlurView intensity={blurIntensity} style={[StyleSheet.absoluteFill, { borderRadius: 12 }]} />
            <View style={{ 
                padding: 0,
                width: `95%`, 
                // maxHeight: 525,
                borderWidth: 0,
                borderRadius: 12, 
                marginHorizontal: `auto`, 
                borderColor: colors.listsBG,
                opacity: (active || !Number.isInteger(slideIndex + 1)) ? 1 : 0.35,
                backgroundColor: selected == null ? colors.listsBG : colors.transparent, 
            }}>
                <TouchableOpacity onPress={() => openColumnDetails()} disabled={selected != null} style={[titleRowStyles.titleRow, { paddingVertical: 7, position: `relative`, }]}>
                    {selected == null && column?.category && column?.category?.length > 0 ? <>
                        <Text style={[titleRowStyles.subtitle, titleRowStyles.fontColor]}>
                            {column?.category}
                        </Text>
                        <FontAwesome style={{ position: `absolute`, top: 12, left: 95, paddingBottom: 5 }} size={12} name={`gears`} color={colors.disabledFont} />
                    </> : (
                        <TouchableOpacity onPress={() => deleteItemWithConfirmation()} style={[titleRowStyles.topButton, { backgroundColor: colorPickerOpen ? selectedColor : selected?.backgroundColor }]}>
                            <FontAwesome name={`trash`} size={14} color={colorPickerOpen ? getFontColorForBackground(selectedColor) : fontColor} />
                            <Text style={[{ textAlign: `center`, fontSize: 16, fontWeight: `bold`, color: colorPickerOpen ? getFontColorForBackground(selectedColor) : fontColor }]}>
                                Delete
                            </Text>
                        </TouchableOpacity>
                    )}
                    <Text numberOfLines={1} ellipsizeMode={`tail`} style={[titleRowStyles.title, titleRowStyles.fontColor, { ...(selected != null && {color: getFontColor(colors.mainBG)}), flexBasis: `50%` }]}>
                        {selected == null ? (
                            `${column?.name} ${Number.isInteger(slideIndex + 1) ? slideIndex + 1 : (
                                toFixedWithoutRounding(slideIndex + 1, 1)
                            )}`
                        ) : activeTopName}
                    </Text>
                    {selected == null ? <>
                        {columnItems && columnItems.length > 0 ? <>
                            <Text style={[titleRowStyles.subtitle, titleRowStyles.fontColor]}>
                                {columnItems?.length >= 10 ? columnItems?.length : columnItems?.length + ` Item${columnItems?.length > 1 ? `s` : `(s)`}`}
                            </Text>
                        </> : <>
                            <Text style={[titleRowStyles.subtitle, titleRowStyles.fontColor]}>
                                0 Item(s)
                            </Text>
                        </>}
                        <FontAwesome style={{ position: `absolute`, top: 12, right: 95, paddingBottom: 5 }} size={12} name={`gears`} color={colors.disabledFont} />
                    </> : (
                        <TouchableOpacity onPress={() => closeItem()} style={[titleRowStyles.topButton, { backgroundColor: colorPickerOpen ? selectedColor : selected?.backgroundColor }]}>
                            <FontAwesome name={`ban`} size={14} color={colorPickerOpen ? getFontColorForBackground(selectedColor) : fontColor} />
                            <Text style={[{ textAlign: `center`, fontSize: 16, fontWeight: `bold`, color: colorPickerOpen ? getFontColorForBackground(selectedColor) : fontColor }]}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
                {columnItems?.length > 0 ? (
                    <ReorderableList
                        ref={listRef}
                        data={columnItems}
                        onReorder={onReorder}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        style={{ 
                            height: `auto`, 
                            maxHeight: addingItem ? ((height - paginationHeightMargin) - 175) : height - paginationHeightMargin, 
                        }}
                        contentContainerStyle={{
                            width: `100%`,
                            height: `auto`,
                            paddingBottom: 2,
                            gap: gridSpacing - 12,
                            marginHorizontal: `auto`,
                            paddingHorizontal: gridSpacing,
                        }}
                    />
                ) : (
                    <View style={{ width: `100%`, backgroundColor: colors.transparent, height: `auto`, paddingVertical: 15, ...globalStyles.flexRow, justifyContent: `center`, gap: 15 }}>
                        {itemsLoading ? <LoadingSpinner /> : <></>}
                        <Text style={[boardStyles.cardTitle, { textAlign: `center`, fontStyle: `italic`, fontSize: 16 }]}>
                            {itemsLoading && items.length == 0 ? loadingMessages.loading : loadingMessages.zero}
                        </Text>
                    </View>
                )}
                <View id={`${column.id}-footer`} style={{ backgroundColor: colors.transparent, paddingTop: 5, paddingVertical: 10, width: `100%`, alignItems: `center`, justifyContent: `center`, display: `flex`, gap: 5 }}>
                    <View style={[globalStyles.singleLineInput, titleRowStyles.addItemButton, { marginTop: 5, justifyContent: `center`, marginHorizontal: `auto`, opacity: selected == null ? 1 : 0 }]}>
                        <ForwardRefInput
                            width={`100%`}
                            value={itemName}
                            showLabel={false}
                            endIconName={`save`}
                            onDoneVibrate={true}
                            placeholder={`Item Name`}
                            onFocus={() => onFocus()}
                            onChangeText={setItemName}
                            onCancel={() => onCancel()}
                            maxLength={maxItemNameLength}
                            onDoneDismiss={itemName == ``}
                            endIconPress={() => addItem()}
                            endIconDisabled={itemName == ``}
                            onBlur={() => setAddingItem(false)}
                            doneText={itemName == `` ? `Done` : `Add`}
                            cancelText={itemName == `` ? `Close` : `Cancel`}
                            onDone={itemName == `` ? () => {} : () => addItem()}
                            cancelColor={itemName == `` ? colors.disabledFont : colors.error}
                            doneColor={itemName == `` ? colors.disabledFont : colors.active}
                            endIconColor={itemName == `` ? colors.disabledFont : colors.inputColor}
                            extraStyle={{ 
                                width: `83%`, 
                                fontWeight: `bold`,
                                color: colors.inputColor, 
                                backgroundColor: colors.inputBG, 
                                fontStyle: itemName == `` ? `italic` : `normal`,
                            }}
                            style={{ 
                                marginBottom: 0, 
                                minHeight: itemHeight, 
                                ...globalStyles.flexRow, 
                            }}
                            endIconStyle={{ 
                                minHeight: itemHeight, 
                                maxHeight: itemHeight, 
                                backgroundColor: itemName == `` ? colors.inputBG : colors.active, 
                            }}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

export const titleRowStyles = StyleSheet.create({
    card: {
        alignItems: 'center',
        borderBottomWidth: 1,
        justifyContent: 'center',
        borderBottomColor: colors.black,
      },
      text: {
        fontSize: 20,
      },
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
        borderRadius: borderRadius, 
    },
    addItemButton: {
        padding: 1, 
        width: `92%`, 
        borderRadius: borderRadius,
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
        color: getFontColor(colors.listsBG), 
    },
})