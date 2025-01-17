import * as Haptics from 'expo-haptics';
import { boardStyles } from '../styles';
import { SharedContext } from '@/shared/shared';
import { titleRowStyles } from '../column/column';
import { Swipeable } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { delayBeforeScrollingDown, genID, maxTaskNameLength } from '@/shared/variables';
import { ItemType, TaskType, Views } from '@/shared/types/types';
import CustomTextInput from '@/components/custom-input/custom-input';
import { Alert, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { colors, globalStyles, taskBorderRadius, Text, View } from '@/components/theme/Themed';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { addTaskToDatabase, deleteTaskFromDatabase, getTasksForItem, updateTaskFieldsInDatabase } from '@/shared/server/firebase';

export default function Tasks({ selected }: any) {
    const listRef = useRef(null);

    let [taskName, setTaskName] = useState(``);
    let [itemTasks, setItemTasks] = useState<TaskType[]>([]);
    let { tasks, editing, setEditing } = useContext<any>(SharedContext);

    const onPressTask = (task: TaskType) => {
        Vibration.vibrate(1);
        editTaskWithConfirmation(task);
        // log(task?.type, task);
    }

    useEffect(() => {
        let tasksForItem = getTasksForItem(tasks, selected?.id);
        setItemTasks(tasksForItem);
    }, [tasks])

    const onDragEnd = async (onDragEndData: any) => {
        let { data } = await onDragEndData;
        if (data?.length > 0) {
            // const updatedTasks = data?.map((task, taskIndex) => ({ ...task, index: taskIndex + 1}));
            // await setTasks(updatedTasks);
            data.forEach((tsk, tskIndex) => {
                updateTaskFieldsInDatabase(tsk?.id, { index: tskIndex + 1});
            })
        }
    }

    const deleteTaskWithConfirmation = (taskID: string) => {
        Vibration.vibrate(1);
        Alert.alert(
            `Delete Task`,
            `Are you sure you want to delete this task?`,
            [
                { text: `Cancel`, style: `cancel`, onPress: async () => await Vibration.vibrate(1) }, 
                { text: `Delete`, style: `destructive`, onPress: async () => await deleteTaskFromDatabase(taskID) }
            ],
            { cancelable: true, onDismiss: async () => await Vibration.vibrate(1) },
        )
    }

    const editTaskWithConfirmation = async (task) => {
        await Vibration.vibrate(1);
        await setEditing(true);
        await Alert.prompt(
            `Edit Task`,
            ``,
            async (value: string) => {
                await Vibration.vibrate(1);
                await setEditing(false);
                await updateTaskFieldsInDatabase(task?.id, { name: value }, false);
            },
            undefined,
            task?.name,
            undefined,
            { cancelable: true, onDismiss: async () => {
                await Vibration.vibrate(1)
                await setEditing(false);
            } }
        )
    }

    const addTask = async () => {
        await setTaskName(``);
        
        // setItemTasks(prevTasks => {
            const type = Views.Task;
            const newKey = tasks?.length + 1;
            const newIndex = itemTasks?.length + 1;
            // const newIndex = prevTasks.length + 1;
            const { id, uuid, date } = await genID(type, newIndex);

            const newTask = await new TaskType({ 
                id, 
                type,
                uuid,
                key: newKey,
                created: date,
                updated: date,
                name: taskName, 
                index: newIndex, 
                itemID: selected?.id,
            })

            await addTaskToDatabase(newTask);

            // const updatedTasks = [...prevTasks, newTask];

            
            // return updatedTasks;
            // });
            
        await setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, delayBeforeScrollingDown);
    }

    const renderDraggableItem = useCallback(
        ({ item, drag, isActive, getIndex }: RenderItemParams<ItemType>) => {

        let index = item?.index;
        const swipeableRef = useRef<Swipeable>(null);
        let isFirst: boolean = index == 1 ? true : false;
        let isLast: boolean = index == itemTasks?.length ? true : false;

        const handleRightSwipe = (taskID: string = item?.id) => {
            swipeableRef.current?.close();
            deleteTaskWithConfirmation(taskID);
        };

        const handleLeftSwipe = (task = item) => {
            swipeableRef.current?.close();
            editTaskWithConfirmation(task);
        };
        
        const renderRightActions = () => (
            <View style={[titleRowStyles.rightAction, { backgroundColor: colors.red, borderRadius: taskBorderRadius - 3, marginLeft: 3 }]}>
                <FontAwesome name={`trash`} color={colors.white} size={18} style={{ paddingHorizontal: 15 }} />
            </View>
        );
        
        const renderLeftActions = () => (
            <View style={[titleRowStyles.leftAction, { backgroundColor: colors.appleBlue, borderRadius: taskBorderRadius - 3, marginRight: 3 }]}>
                <FontAwesome name={`bars`} color={colors.white} size={18} style={{ paddingHorizontal: 15 }} />
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
                    onSwipeableLeftOpen={() => handleLeftSwipe(item)}
                    onSwipeableRightOpen={() => handleRightSwipe(item?.id)}
                    onActivated={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                >    
                    <TouchableOpacity
                        onLongPress={drag}
                        disabled={isActive}
                        onPress={() => onPressTask(item)}
                        style={[boardStyles.rowItem, { 
                            width: `100%`, 
                            minHeight: 35, 
                            backgroundColor: colors.black,
                            borderTopLeftRadius: isFirst ? taskBorderRadius : 0, 
                            borderTopRightRadius: isFirst ? taskBorderRadius : 0, 
                            borderBottomLeftRadius: isLast ? taskBorderRadius : 0, 
                            borderBottomRightRadius: isLast ? taskBorderRadius : 0, 
                        }]}
                    >
                        <View style={{width: `100%`, backgroundColor: colors.transparent}}>
                            <Text style={{ textAlign: `left`, paddingLeft: 55, fontWeight: `bold`, fontStyle: `italic` }}>
                                {getIndex() + 1}. {item?.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Swipeable>
            </ScaleDecorator>
        )
    }, [])

    return (
        <>
            <View style={[styles.tasksContainer, { maxHeight: editing ? 225 : (selected?.image && selected?.image != `` ? 185 : 340), marginTop: editing ? 0 : 12, }]}>
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
                    ListEmptyComponent={(
                        <View style={{ flex: 1, backgroundColor: colors.black, paddingVertical: 10, ...globalStyles.flexRow, justifyContent: `center` }}>
                            <Text style={{ fontStyle: `italic`, textAlign: `center` }}>
                                No Tasks Yet
                            </Text>
                        </View>
                    )}
                    contentContainerStyle={{
                        gap: 3,
                        width: `100%`,
                        marginHorizontal: `auto`,
                        paddingBottom: itemTasks.length * 0.25,
                        height: itemTasks.length == 0 ? `100%` : `auto`,
                    }}
                />
            </View>
            <View style={globalStyles.singleLineInput}>
                <CustomTextInput
                    value={taskName}
                    showLabel={false}
                    placeholder={`Name`}
                    endIconName={`save`}
                    onChangeText={setTaskName}
                    maxLength={maxTaskNameLength}
                    endIconPress={() => addTask()}
                    onCancel={() => setTaskName(``)}
                    onBlur={() => setEditing(false)}
                    onFocus={() => setEditing(true)}
                    extraStyle={{ color: colors.white }}
                    doneText={taskName == `` ? `Done` : `Add`}
                    onDone={taskName == `` ? null : () => addTask()}
                    doneColor={taskName == `` ? colors.disabledFont : colors.white}
                    cancelColor={taskName == `` ? colors.disabledFont : colors.red}
                    endIconColor={taskName == `` ? colors.disabledFont : colors.white}
                    endIconStyle={{ minHeight: 35, maxHeight: 35, backgroundColor: colors.black }}
                    style={{ width: `80%`, minHeight: 35, ...globalStyles.flexRow, marginBottom: 0, }}
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