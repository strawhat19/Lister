import * as Haptics from 'expo-haptics';
import { boardStyles } from '../styles';
import { TaskType } from '@/shared/types/types';
import { SharedContext } from '@/shared/shared';
import { titleRowStyles } from '../column/column';
import { Swipeable } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import ForwardRefInput from '@/components/custom-input/forward-ref-input';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { delayBeforeScrollingDown, itemHeight, maxTaskNameLength } from '@/shared/variables';
import { colors, globalStyles, taskBorderRadius, Text, View } from '@/components/theme/Themed';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { addTaskToDatabase, deleteTaskFromDatabase, getTasksForItem, prepareTaskForDatabase, updateTaskFieldsInDatabase } from '@/shared/server/firebase';

export default function Tasks({ selected }: any) {
    const listRef = useRef(null);
    const inputRef = useRef(null);

    let [taskName, setTaskName] = useState(``);
    let [itemTasks, setItemTasks] = useState<TaskType[]>([]);
    let [taskToEdit, setTaskToEdit] = useState<TaskType | null>(null);
    let { tasks, editing, setEditing } = useContext<any>(SharedContext);

    const onPressTask = (task: TaskType) => {
        Vibration.vibrate(1);
        onEditTask(task);
    }

    useEffect(() => {
        let tasksForItem = getTasksForItem(tasks, selected?.id);
        setItemTasks(tasksForItem);
    }, [tasks])

    const onDragEnd = async (onDragEndData: any) => {
        let { data } = await onDragEndData;
        await setItemTasks(data);
        if (data?.length > 0) {
            await data.forEach((tsk, tskIndex) => {
                updateTaskFieldsInDatabase(tsk?.id, { index: tskIndex + 1}, true, false);
            })
        }
    }

    // const deleteTaskWithConfirmation = (taskID: string) => {
    //     Vibration.vibrate(1);
    //     Alert.alert(
    //         `Delete Task`,
    //         `Are you sure you want to delete this task?`,
    //         [
    //             { text: `Cancel`, style: `cancel`, onPress: async () => await Vibration.vibrate(1) }, 
    //             { text: `Delete`, style: `destructive`, onPress: async () => await deleteTaskFromDatabase(taskID) }
    //         ],
    //         { cancelable: true, onDismiss: async () => await Vibration.vibrate(1) },
    //     )
    // }

    const editTask = async () => {
        await setTaskName(``);
        await setEditing(true);
        await setTaskToEdit(null);
        updateTaskFieldsInDatabase(taskToEdit?.id, { name: taskName });
    }

    const onEditTask = async (task) => {
        await Vibration.vibrate(1);
        await setEditing(true);
        await setTaskToEdit(task);
        await setTaskName(task?.name);
        await inputRef.current?.focus();
    }

    const addTask = async () => {
        const taskToAdd = new TaskType({
            name: taskName, 
            itemID: selected?.id,
            listID: selected?.listID,
        });
        await setTaskName(``);
        const newTask = await prepareTaskForDatabase(taskToAdd, tasks, selected?.id);
        await addTaskToDatabase(newTask);
        await setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, delayBeforeScrollingDown);
    }

    const renderDraggableItem = useCallback(
        ({ item: taskItem, drag, isActive, getIndex }: RenderItemParams<TaskType>) => {

        let index = taskItem?.index;
        const swipeableRef = useRef<Swipeable>(null);
        let isFirst: boolean = index == 1 ? true : false;
        let isLast: boolean = index == itemTasks?.length ? true : false;

        const handleRightSwipe = async (taskID: string = taskItem?.id) => {
            // swipeableRef.current?.close();
            await deleteTaskFromDatabase(taskID);
        };

        const handleLeftSwipe = (task = taskItem) => {
            swipeableRef.current?.close();
            Vibration.vibrate(1);
            updateTaskFieldsInDatabase(task?.id, { complete: !task.complete } as Partial<TaskType>);
        };
        
        const renderRightActions = () => (
            <View style={[titleRowStyles.rightAction, { backgroundColor: colors.red, borderRadius: taskBorderRadius - 3, marginLeft: 3 }]}>
                <FontAwesome name={`trash`} color={colors.white} size={18} style={{ paddingHorizontal: 15 }} />
            </View>
        );
        
        const renderLeftActions = () => (
            <View style={[titleRowStyles.leftAction, { backgroundColor: taskItem.complete ? colors.activeColor : colors.success, borderRadius: taskBorderRadius - 3, marginRight: 3 }]}>
                <FontAwesome name={taskItem.complete ? `circle-o` : `check`} color={colors.white} size={18} style={{ paddingHorizontal: 15 }} />
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
                    onSwipeableLeftOpen={() => handleLeftSwipe(taskItem)}
                    onSwipeableRightOpen={() => handleRightSwipe(taskItem?.id)}
                    onActivated={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                >    
                    <TouchableOpacity
                        onLongPress={drag}
                        disabled={isActive}
                        onPress={() => onPressTask(taskItem)}
                        style={[boardStyles.rowItem, { 
                            width: `100%`, 
                            minHeight: itemHeight, 
                            borderTopLeftRadius: isFirst ? taskBorderRadius : 0, 
                            borderTopRightRadius: isFirst ? taskBorderRadius : 0, 
                            borderBottomLeftRadius: isLast ? taskBorderRadius : 0, 
                            borderBottomRightRadius: isLast ? taskBorderRadius : 0, 
                            backgroundColor: taskItem?.complete ? colors.taskBGComplete : colors.taskBG,
                        }]}
                    >
                        <View style={{width: `100%`, backgroundColor: colors.transparent, ...globalStyles.flexRow, gap: 15, paddingLeft: 15}}>
                            <FontAwesome 
                                size={18} 
                                name={taskItem?.complete ? `check` : `circle-o`} 
                                color={taskItem?.complete ? colors.appleGreen : colors.white} 
                            />
                            <Text style={{ textAlign: `center`, fontWeight: `bold`, fontStyle: `italic`, color: taskItem?.complete ? colors.taskColorComplete : colors.taskColor, backgroundColor: taskItem?.complete ? colors.taskBGComplete : colors.taskBG, width: 20, height: 20, borderRadius: `100%`, paddingTop: 1.5 }}>
                                {getIndex() + 1}
                            </Text>
                            <Text style={{ textAlign: `left`, fontWeight: `bold`, fontStyle: `italic`, color: taskItem?.complete ? colors.taskColorComplete : colors.taskColor, textDecorationLine: taskItem?.complete ? `line-through` : `none` }}>
                                {taskItem?.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Swipeable>
            </ScaleDecorator>
        )
    }, [])

    return (
        <>
            <View style={
                [
                    styles.tasksContainer, 
                    { 
                        marginTop: editing ? -15 : 12, 
                        maxHeight: editing ? 265 : (selected?.image && selected?.image != `` ? 185 : 340), 
                    },
                ]
            }>
                {itemTasks.length > 0 ? (
                    <DraggableFlatList
                        ref={listRef}
                        bounces={true}
                        data={itemTasks}
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
                            paddingBottom: itemTasks.length * 0.25,
                            height: itemTasks.length == 0 ? `100%` : `auto`,
                        }}
                    />
                ) : (
                    <View style={{ flex: 1, backgroundColor: colors.transparent, paddingVertical: 10, ...globalStyles.flexRow, alignItems: `flex-start`, justifyContent: `center` }}>
                        <Text style={{ fontStyle: `italic`, textAlign: `center`, color: colors.taskBG }}>
                            0 Task(s)
                        </Text>
                    </View>
                )}
            </View>
            <View style={globalStyles.singleLineInput}>
                <ForwardRefInput
                    ref={inputRef}
                    value={taskName}
                    showLabel={false}
                    endIconName={`save`}
                    placeholder={`Task Name`}
                    onChangeText={setTaskName}
                    maxLength={maxTaskNameLength}
                    onCancel={() => setTaskName(``)}
                    onBlur={() => setEditing(false)}
                    onFocus={() => setEditing(true)}
                    endIconPress={() => taskToEdit == null ? addTask() : editTask()}
                    cancelColor={taskName == `` ? colors.disabledFont : colors.error}
                    endIconColor={taskName == `` ? colors.disabledFont : colors.inputBG}
                    doneColor={taskName == `` ? colors.disabledFont : colors.activeColor}
                    doneText={taskName == `` ? `Done` : taskToEdit == null ? `Add` : `Save`}
                    extraStyle={{ color: colors.inputColor, backgroundColor: colors.inputBG }}
                    onDone={taskName == `` ? null : () => taskToEdit == null ? addTask() : editTask()}
                    style={{ width: `80%`, minHeight: itemHeight, ...globalStyles.flexRow, marginBottom: 0, }}
                    endIconStyle={{ minHeight: itemHeight, maxHeight: itemHeight, backgroundColor: colors.inputBG }}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    tasksContainer: { 
        flex: 1,
        width: `100%`,
        overflow: `hidden`,
        position: `relative`, 
        borderRadius: taskBorderRadius,
        backgroundColor: colors.transparent,
    },
})