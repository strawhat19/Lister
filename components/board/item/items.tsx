import * as Haptics from 'expo-haptics';
import { boardStyles } from '../styles';
import { SharedContext } from '@/shared/shared';
import { titleRowStyles } from '../column/column';
import { doc, writeBatch } from 'firebase/firestore';
import { Swipeable } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ItemType, TaskType, Views } from '@/shared/types/types';
import ForwardRefInput from '@/components/custom-input/forward-ref-input';
import { Alert, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { colors, globalStyles, draggableViewItemBorderRadius, Text, View, getFontColor } from '@/components/theme/Themed';
import { defaultBoardID, delayBeforeScrollingDown, isValid, itemHeight, maxItemNameLength, maxTaskNameLength } from '@/shared/variables';
import { addItemToDatabase, addTaskToDatabase, db, deleteItemFromDatabase, deleteTaskFromDatabase, getItemsForColumn, getTasksForItem, itemsDatabaseCollection, prepareItemForDatabase, prepareTaskForDatabase, tasksDatabaseCollection, updateItemFieldsInDatabase, updateTaskFieldsInDatabase } from '@/shared/server/firebase';

export default function Items({ simple = false, component }: any) {
    const listRef = useRef(null);
    const inputRef = useRef(null);

    let [itmName, setItmName] = useState(``);
    let [itmToEdit, setItmToEdit] = useState<TaskType | ItemType | null>(null);
    let [draggableItems, setDraggableItems] = useState<TaskType[] | ItemType[]>([]);
    let { selected, items, tasks, editing, setEditing } = useContext<any>(SharedContext);

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

    const onDragEnd = async (onDragEndData: any) => {
        let { data } = await onDragEndData;
        await setDraggableItems(data);
        if (data?.length > 0) {
            const batch = writeBatch(db);
            await data.forEach((itm, itmIndex) => {
                const now = new Date().toLocaleString(`en-US`);
                const databaseToUse = selected?.type == Views.Item ? tasksDatabaseCollection : itemsDatabaseCollection;
                const reference = doc(db, databaseToUse, itm?.id);
                batch.update(reference, { index: itmIndex + 1, updated: now });
            })
            await Vibration.vibrate(1);
            await batch.commit();
        }
    }

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
            const itemToAdd = new ItemType({
                A: itmName,
                name: itmName, 
                boardID: defaultBoardID,
                listID: selected?.listID,
            });
            const newItem = await prepareItemForDatabase(itemToAdd, items, selected?.id);
            await addItemToDatabase(newItem);
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
        ({ item: itm, drag, isActive, getIndex }: RenderItemParams<TaskType | ItemType | any>) => {

        let index = itm?.index;
        const swipeableRef = useRef<Swipeable>(null);
        let isFirst: boolean = index == 1 ? true : false;
        let isLast: boolean = index == draggableItems?.length ? true : false;

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
        
        const renderRightActions = () => (
            <View style={[titleRowStyles.rightAction, { backgroundColor: colors.red, borderRadius: draggableViewItemBorderRadius - 3, marginLeft: 3 }]}>
                <FontAwesome name={`trash`} color={colors.white} size={18} style={{ paddingHorizontal: 15 }} />
            </View>
        );
        
        const renderLeftActions = () => (
            <View style={[titleRowStyles.leftAction, { backgroundColor: itm.complete ? colors.activeColor : colors.success, borderRadius: draggableViewItemBorderRadius - 3, marginRight: 3 }]}>
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
                                borderTopLeftRadius: isFirst ? draggableViewItemBorderRadius : 0, 
                                borderTopRightRadius: isFirst ? draggableViewItemBorderRadius : 0, 
                                borderBottomLeftRadius: isLast ? draggableViewItemBorderRadius : 0, 
                                borderBottomRightRadius: isLast ? draggableViewItemBorderRadius : 0, 
                                backgroundColor: itm?.complete ? colors.taskBGComplete : colors.taskBG,
                            }]}
                        >
                            <View style={{width: `100%`, backgroundColor: colors.transparent, ...globalStyles.flexRow, gap: 15, paddingLeft: 15}}>
                                <FontAwesome 
                                    size={18} 
                                    name={itm?.complete ? `check` : `circle-o`} 
                                    color={itm?.complete ? colors.appleGreen : colors.white} 
                                />
                                <Text style={{ textAlign: `center`, fontWeight: `bold`, fontStyle: `italic`, color: itm?.complete ? colors.taskColorComplete : colors.taskColor, backgroundColor: itm?.complete ? colors.taskBGComplete : colors.taskBG, width: 20, height: 20, borderRadius: `100%`, paddingTop: 1.5 }}>
                                    {getIndex() + 1}
                                </Text>
                                <Text style={{ textAlign: `left`, fontWeight: `bold`, fontStyle: `italic`, color: itm?.complete ? colors.taskColorComplete : colors.taskColor, textDecorationLine: itm?.complete ? `line-through` : `none` }}>
                                    {itm?.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </Swipeable>
            </ScaleDecorator>
        )
    }, [])

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
                        maxHeight: editing ? 265 : (isValid(selected?.image) ? 185 : selected?.type == Views.Item ? 340 : 445), 
                    },
                ]
            }>
                {draggableItems.length > 0 ? (
                    <DraggableFlatList
                        ref={listRef}
                        bounces={true}
                        data={draggableItems}
                        style={{ height: `auto` }}
                        nestedScrollEnabled={true}
                        directionalLockEnabled={true}
                        renderItem={renderDraggableItem}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        onDragEnd={async (onDragEndData: any) => await onDragEnd(onDragEndData)}
                        onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                        onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
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
                        {/* <LoadingSpinner /> */}
                        <Text style={{ fontStyle: `italic`, textAlign: `center`, color: getFontColor(colors.listsBG, colors.taskBG), fontWeight: `bold` }}>
                            0 {selected?.type == Views.Item ? `Task(s)` : `Item(s)`}
                        </Text>
                    </View>
                )}
            </View>
            <View style={[globalStyles.singleLineInput, { position: `relative`, top: -10 }]}>
                <ForwardRefInput
                    ref={inputRef}
                    value={itmName}
                    showLabel={false}
                    endIconName={`save`}
                    onChangeText={setItmName}
                    onCancel={() => setItmName(``)}
                    onBlur={() => setEditing(false)}
                    onFocus={() => setEditing(true)}
                    endIconDisabled={itmName == ``}
                    cancelText={itmName == `` ? `Close` : `Cancel`}
                    endIconPress={() => itmToEdit == null ? addItm() : editItm()}
                    cancelColor={itmName == `` ? colors.disabledFont : colors.error}
                    doneColor={itmName == `` ? colors.disabledFont : colors.activeColor}
                    placeholder={`${selected?.type == Views.Item ? `Task` : `Item`} Name`}
                    endIconColor={itmName == `` ? colors.disabledFont : colors.inputColor}
                    doneText={itmName == `` ? `Done` : itmToEdit == null ? `Add` : `Save`}
                    onDone={itmName == `` ? null : () => itmToEdit == null ? addItm() : editItm()}
                    maxLength={selected?.type == Views.Item ? maxTaskNameLength : maxItemNameLength}
                    style={{ width: `80%`, minHeight: itemHeight, ...globalStyles.flexRow, marginBottom: 0, }}
                    endIconStyle={{ minHeight: itemHeight, maxHeight: itemHeight, backgroundColor: itmName == `` ? colors.inputBG : colors.activeColor }}
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