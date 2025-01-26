import * as Haptics from 'expo-haptics';
import { boardStyles } from '../styles';
import { SharedContext } from '@/shared/shared';
import { titleRowStyles } from '../column/column';
import { doc, writeBatch } from 'firebase/firestore';
import { Swipeable } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Directions, ItemType, TaskType, Views } from '@/shared/types/types';
import ForwardRefInput from '@/components/custom-input/forward-ref-input';
import { Alert, ListRenderItemInfo, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { delayBeforeScrollingDown, isValid, itemHeight, maxItemNameLength, maxTaskNameLength } from '@/shared/variables';
import { colors, globalStyles, draggableViewItemBorderRadius, Text, View, getFontColor } from '@/components/theme/Themed';
import { addTaskToDatabase, createItem, db, deleteItemFromDatabase, deleteTaskFromDatabase, getItemsForColumn, getTasksForItem, itemsDatabaseCollection, prepareTaskForDatabase, tasksDatabaseCollection, updateItemFieldsInDatabase, updateTaskFieldsInDatabase } from '@/shared/server/firebase';
import ReorderableList, { ReorderableListReorderEvent, reorderItems, useIsActive, useReorderableDrag } from 'react-native-reorderable-list';
import Animated, { Layout } from 'react-native-reanimated';

export default function Items({ simple = false, component }: any) {
    const listRef = useRef(null);
    const inputRef = useRef(null);

    let [itmName, setItmName] = useState(``);
    let [itmToEdit, setItmToEdit] = useState<TaskType | ItemType | null>(null);
    let [draggableItems, setDraggableItems] = useState<TaskType[] | ItemType[] | any[]>([]);
    let { selected, items, tasks, editing, setEditing, closeBottomSheet } = useContext<any>(SharedContext);

    const onPressItm = (itm: TaskType | ItemType) => {
        Vibration.vibrate(1);
        onEditItem(itm);
    }

    useEffect(() => {
        if (selected?.type == Views.Item) {
            let tasksForItem = getTasksForItem(tasks, selected?.id);
            setDraggableItems(tasksForItem);
        }
        if (selected?.type == Views.Column) {
            let itemsForColumn = getItemsForColumn(items, selected?.id);
            setDraggableItems(itemsForColumn);
        }
    }, [items, tasks])

    // const onDragEnd = async (onDragEndData: any) => {
    //     let { data } = await onDragEndData;
    //     const updatedData = data.map((itm, itmIndex) => ({ ...itm, index: itmIndex + 1 })).sort((a, b) => a?.index - b?.index);
    //     setDraggableItems(updatedData);
    //     if (data?.length > 0) {
    //         const batch = writeBatch(db);
    //         await data.forEach((itm, itmIndex) => {
    //             const now = new Date().toLocaleString(`en-US`);
    //             const databaseToUse = selected?.type == Views.Item ? tasksDatabaseCollection : itemsDatabaseCollection;
    //             const reference = doc(db, databaseToUse, itm?.id);
    //             batch.update(reference, { index: itmIndex + 1, updated: now });
    //         })
    //         await Vibration.vibrate(1);
    //         await batch.commit();
    //     }
    // }

    const deleteItemWithConfirmation = (itemID: string) => {
        Vibration.vibrate(1);
        Alert.alert(
            `Delete Item`,
            `Are you sure you want to delete this item?`,
            [
                { text: `Cancel`, style: `cancel`, onPress: async () => await Vibration.vibrate(1) }, 
                { text: `Delete`, style: `destructive`, onPress: async () => await deleteItemFromDatabase(itemID) }
            ],
            { cancelable: true, onDismiss: async () => await Vibration.vibrate(1) },
        )
    }

    const editItm = async () => {
        await setItmName(``);
        await setEditing(true);
        await setItmToEdit(null);
        if (selected?.type == Views.Item) updateTaskFieldsInDatabase(itmToEdit?.id, { name: itmName });
        if (selected?.type == Views.Column) updateItemFieldsInDatabase(itmToEdit?.id, { name: itmName });
    }

    const onEditItem = async (itm) => {
        await Vibration.vibrate(1);
        await setEditing(true);
        await setItmToEdit(itm);
        await setItmName(itm?.name);
        await inputRef.current?.focus();
    }

    const addItm = async () => {
        if (selected?.type == Views.Column) {
            await createItem(draggableItems, selected?.id, itmName, items, closeBottomSheet, false);
        }
        if (selected?.type == Views.Item) {
            const taskToAdd = new TaskType({
                A: itmName,
                name: itmName, 
                itemID: selected?.id,
                listID: selected?.listID,
            });
            const newTask = await prepareTaskForDatabase(taskToAdd, tasks, selected?.id);
            await addTaskToDatabase(newTask);
        }
        await setItmName(``);
        await setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, delayBeforeScrollingDown);
    }

    const renderDraggableItem = useCallback(
        ({ item: itm, drag, isActive, getIndex, draggableItems }: any | RenderItemParams<TaskType | ItemType>) => {

        // let index = itm?.index;
        let index = getIndex() + 1;
        const swipeableRef = useRef<Swipeable>(null);
        let isFirst: boolean = index == 1 ? true : false;
        let isLast: boolean = index == draggableItems?.length ? true : false;
        
        let bgColor = itm?.complete ? colors.taskBGComplete : (itm?.type == Views.Task ? colors.taskBG : itm?.backgroundColor);
        let fColor = itm?.complete ? colors.taskColorComplete : (itm?.type == Views.Task ? colors.taskColor : getFontColor(itm?.backgroundColor));

        const handleRightSwipe = async (itmID: string = itm?.id) => {
            swipeableRef.current?.close();
            if (itm?.type == Views.Task) {
                await deleteTaskFromDatabase(itmID);
            }
            if (itm?.type == Views.Item) {
                let emptyDetails = !isValid(itm?.summary) && !isValid(itm?.description) && !isValid(itm?.image);
                if (itm?.complete || emptyDetails) {
                    await deleteItemFromDatabase(itmID);
                } else {
                    await deleteItemWithConfirmation(itmID);
                }
            }
        };

        const handleLeftSwipe = (itmSwiped = itm) => {
            swipeableRef.current?.close();
            Vibration.vibrate(1);
            if (itm?.type == Views.Task) {
                updateTaskFieldsInDatabase(itmSwiped?.id, { complete: !itmSwiped.complete } as Partial<TaskType | ItemType>);
            }
            if (itm?.type == Views.Item) {
                updateItemFieldsInDatabase(itmSwiped?.id, { complete: !itmSwiped.complete } as Partial<TaskType | ItemType>);
            }
        };
        
        const swipeableBorderRadius = draggableViewItemBorderRadius - 3;

        const renderRightActions = () => (
            <View style={[titleRowStyles.rightAction, { 
                marginLeft: 3, 
                borderTopLeftRadius: 0, 
                borderBottomLeftRadius: 0, 
                backgroundColor: colors.red, 
                borderTopRightRadius: isFirst ? swipeableBorderRadius : 0, 
                borderBottomRightRadius: isLast ? swipeableBorderRadius : 0, 
            }]}>
                <FontAwesome name={`trash`} color={colors.white} size={18} style={{ paddingHorizontal: 15 }} />
            </View>
        );
        
        const renderLeftActions = () => (
            <View style={[titleRowStyles.leftAction, { 
                marginRight: 3, 
                borderTopRightRadius: 0, 
                borderBottomRightRadius: 0, 
                borderTopLeftRadius: isFirst ? swipeableBorderRadius : 0, 
                borderBottomLeftRadius: isLast ? swipeableBorderRadius : 0, 
                backgroundColor: itm.complete ? colors.active : colors.success, 
            }]}>
                <FontAwesome name={itm.complete ? `circle-o` : `check`} color={colors.white} size={18} style={{ paddingHorizontal: 15 }} />
            </View>
        );

        return (
            <ScaleDecorator>
                <Swipeable
                    friction={1}
                    ref={swipeableRef}
                    overshootLeft={false}
                    overshootRight={false}
                    renderLeftActions={renderLeftActions}
                    renderRightActions={renderRightActions}
                    onSwipeableLeftOpen={() => handleLeftSwipe(itm)}
                    onSwipeableRightOpen={() => handleRightSwipe(itm?.id)}
                    onActivated={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                >    
                    {simple ? component : (
                        <TouchableOpacity
                            onLongPress={drag}
                            disabled={isActive}
                            onPress={() => onPressItm(itm)}
                            style={[boardStyles.rowItem, { 
                                width: `100%`, 
                                minHeight: itemHeight, 
                                backgroundColor: bgColor,
                                borderTopLeftRadius: isFirst ? draggableViewItemBorderRadius : 0, 
                                borderTopRightRadius: isFirst ? draggableViewItemBorderRadius : 0, 
                                borderBottomLeftRadius: isLast ? draggableViewItemBorderRadius : 0, 
                                borderBottomRightRadius: isLast ? draggableViewItemBorderRadius : 0, 
                            }]}
                        >
                            <View style={{width: `100%`, backgroundColor: colors.transparent, ...globalStyles.flexRow, gap: 15, paddingLeft: 15}}>
                                <FontAwesome 
                                    size={18} 
                                    name={itm?.complete ? `check` : `circle-o`} 
                                    color={itm?.complete ? colors.success : fColor} 
                                />
                                <Text style={{ textAlign: `center`, fontWeight: `bold`, fontStyle: `italic`, color: fColor, width: 20, height: 20, borderRadius: `100%`, paddingTop: 1.5 }}>
                                    {getIndex() + 1}
                                </Text>
                                <Text style={{ textAlign: `left`, fontWeight: `bold`, fontStyle: `italic`, color: fColor, textDecorationLine: itm?.complete ? `line-through` : `none` }}>
                                    {itm?.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </Swipeable>
            </ScaleDecorator>
        )
    }, [])

    
    const Card: React.FC<any> = memo(({id, index, item, draggableItems}) => {
        const isActive = useIsActive();
        const drag = useReorderableDrag();
        const swipeableRef = useRef<Swipeable>(null);
        const swipeableBorderRadius = draggableViewItemBorderRadius - 3;
      
        const activateDrag = () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          drag();
        }

        let isFirst: boolean = index == 1 ? true : false;
        let isLast: boolean = index == draggableItems?.length ? true : false;
        
        let bgColor = item?.complete ? colors.taskBGComplete : (item?.type == Views.Task ? colors.taskBG : item?.backgroundColor);
        let fColor = item?.complete ? colors.taskColorComplete : (item?.type == Views.Task ? colors.taskColor : getFontColor(item?.backgroundColor));

        const handleRightSwipe = async (itmID: string = item?.id) => {
            swipeableRef.current?.close();
            if (item?.type == Views.Task) {
                await deleteTaskFromDatabase(itmID);
            }
            if (item?.type == Views.Item) {
                let emptyDetails = !isValid(item?.summary) && !isValid(item?.description) && !isValid(item?.image);
                if (item?.complete || emptyDetails) {
                    await deleteItemFromDatabase(itmID);
                } else {
                    await deleteItemWithConfirmation(itmID);
                }
            }
        };

        const handleLeftSwipe = (itmSwiped = item) => {
            swipeableRef.current?.close();
            Vibration.vibrate(1);
            if (item?.type == Views.Task) {
                updateTaskFieldsInDatabase(itmSwiped?.id, { complete: !itmSwiped.complete } as Partial<TaskType | ItemType>);
            }
            if (item?.type == Views.Item) {
                updateItemFieldsInDatabase(itmSwiped?.id, { complete: !itmSwiped.complete } as Partial<TaskType | ItemType>);
            }
        };

        const renderRightActions = () => (
            <View style={[titleRowStyles.rightAction, { 
                marginLeft: 3, 
                borderTopLeftRadius: 0, 
                borderBottomLeftRadius: 0, 
                backgroundColor: colors.red, 
                borderTopRightRadius: isFirst ? swipeableBorderRadius : 0, 
                borderBottomRightRadius: isLast ? swipeableBorderRadius : 0, 
            }]}>
                <FontAwesome name={`trash`} color={colors.white} size={18} style={{ paddingHorizontal: 15 }} />
            </View>
        );
        
        const renderLeftActions = () => (
            <View style={[titleRowStyles.leftAction, { 
                marginRight: 3, 
                borderTopRightRadius: 0, 
                borderBottomRightRadius: 0, 
                borderTopLeftRadius: isFirst ? swipeableBorderRadius : 0, 
                borderBottomLeftRadius: isLast ? swipeableBorderRadius : 0, 
                backgroundColor: item?.complete ? colors.active : colors.success, 
            }]}>
                <FontAwesome name={item?.complete ? `circle-o` : `check`} color={colors.white} size={18} style={{ paddingHorizontal: 15 }} />
            </View>
        );
      
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
                    onSwipeableLeftOpen={() => handleLeftSwipe(item)}
                    onSwipeableRightOpen={() => handleRightSwipe(item)}
                    onActivated={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                >
                    <TouchableOpacity
                        disabled={isActive}
                        onLongPress={activateDrag}
                        onPress={() => onPressItm(item)}
                        style={[boardStyles.rowItem, { 
                            width: `100%`, 
                            minHeight: itemHeight, 
                            backgroundColor: bgColor,
                            borderTopLeftRadius: isFirst ? draggableViewItemBorderRadius : 0, 
                            borderTopRightRadius: isFirst ? draggableViewItemBorderRadius : 0, 
                            borderBottomLeftRadius: isLast ? draggableViewItemBorderRadius : 0, 
                            borderBottomRightRadius: isLast ? draggableViewItemBorderRadius : 0, 
                        }]}
                    >
                        <View style={{width: `100%`, backgroundColor: colors.transparent, ...globalStyles.flexRow, gap: 15, paddingLeft: 15}}>
                            <FontAwesome 
                                size={18} 
                                name={item?.complete ? `check` : `circle-o`} 
                                color={item?.complete ? colors.success : fColor} 
                            />
                            <Text style={{ textAlign: `center`, fontWeight: `bold`, fontStyle: `italic`, color: fColor, width: 20, height: 20, borderRadius: `100%`, paddingTop: 1.5 }}>
                                {index}
                            </Text>
                            <Text style={{ textAlign: `left`, fontWeight: `bold`, fontStyle: `italic`, color: fColor, textDecorationLine: item?.complete ? `line-through` : `none` }}>
                                {item?.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Swipeable>
            </Animated.View>
        );
    });

    const renderItem = ({item, index}: ListRenderItemInfo<any>) => {
        delete item.key;
        return (
            <Card {...item} key={item.id} index={index + 1} item={item} draggableItems={draggableItems} />
        )
    };
    
    const onReorder = ({from, to}: ReorderableListReorderEvent) => {
        setDraggableItems(value => {
            let updatedItems = reorderItems(value, from, to);
            const batch = writeBatch(db);
            updatedItems.forEach((itm, itmIndex) => {
                const now = new Date().toLocaleString(`en-US`);
                const databaseToUse = selected?.type == Views.Item ? tasksDatabaseCollection : itemsDatabaseCollection;
                const reference = doc(db, databaseToUse, itm?.id);
                batch.update(reference, { index: itmIndex + 1, updated: now });
            })
            batch.commit();
            return updatedItems;
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    };

    return (
        simple ? (
            renderDraggableItem({selected} as any)
        ) : (
            <>
                <View style={
                    [
                        styles.tasksContainer, 
                        { 
                            marginTop: editing ? -15 : selected?.type == Views.Item ? 12 : -3, 
                            marginBottom: selected?.type == Views.Item ? (editing ? 5 : 4) : (editing ? 10 : 12),
                            maxHeight: editing ? 265 : (isValid(selected?.image) ? 185 : selected?.type == Views.Item ? 340 : 435), 
                        },
                    ]
                }>
                    {draggableItems.length > 0 ? (
                        <ReorderableList
                            ref={listRef}
                            data={draggableItems}
                            onReorder={onReorder}
                            renderItem={renderItem}
                            style={{ height: `auto` }}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{
                                gap: 3,
                                width: `100%`,
                                marginHorizontal: `auto`,
                                paddingBottom: draggableItems.length * 0.25,
                                height: draggableItems.length == 0 ? `100%` : `auto`,
                            }}
                        />
                    ) : (
                        <View style={{ flex: 1, backgroundColor: colors.transparent, paddingVertical: 10, ...globalStyles.flexRow, alignItems: `flex-start`, justifyContent: `center`, gap: 15 }}>
                            <Text style={{ fontStyle: `italic`, textAlign: `center`, color: getFontColor(selected?.backgroundColor), fontWeight: `bold` }}>
                                0 {selected?.type == Views.Item ? `Task(s)` : `Item(s)`}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={[globalStyles.singleLineInput, { 
                    marginTop: selected?.type == Views.Column ? 0 : 3,
                    marginBottom: selected?.type == Views.Column ? -5 : 0, 
                }]}>
                    <ForwardRefInput
                        ref={inputRef}
                        value={itmName}
                        showLabel={false}
                        endIconName={`save`}
                        onChangeText={setItmName}
                        onCancel={() => setItmName(``)}
                        endIconDisabled={itmName == ``}
                        onBlur={() => setEditing(false)}
                        onFocus={() => setEditing(true)}
                        cancelText={itmName == `` ? `Close` : `Cancel`}
                        endIconPress={() => itmToEdit == null ? addItm() : editItm()}
                        doneColor={itmName == `` ? colors.disabledFont : colors.active}
                        cancelColor={itmName == `` ? colors.disabledFont : colors.error}
                        placeholder={`${selected?.type == Views.Item ? `Task` : `Item`} Name`}
                        endIconColor={itmName == `` ? colors.disabledFont : colors.inputColor}
                        doneText={itmName == `` ? `Done` : itmToEdit == null ? `Add` : `Save`}
                        onDone={itmName == `` ? null : () => itmToEdit == null ? addItm() : editItm()}
                        maxLength={selected?.type == Views.Item ? maxTaskNameLength : maxItemNameLength}
                        style={{ width: `80%`, minHeight: itemHeight, ...globalStyles.flexRow, marginBottom: 0, }}
                        endIconStyle={{ minHeight: itemHeight, maxHeight: itemHeight, backgroundColor: itmName == `` ? colors.inputBG : colors.active }}
                        extraStyle={{ color: colors.inputColor, backgroundColor: colors.inputBG, fontWeight: `bold`, fontStyle: itmName == `` ? `italic` : `normal` }}
                    />
                </View>
            </>
        )
    )
}

const styles = StyleSheet.create({
    tasksContainer: { 
        flex: 1,
        width: `100%`,
        overflow: `hidden`,
        position: `relative`, 
        backgroundColor: colors.transparent,
        borderRadius: draggableViewItemBorderRadius,
    },
})