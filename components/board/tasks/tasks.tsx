import * as Haptics from 'expo-haptics';
import { boardStyles } from '../styles';
import { SharedContext } from '@/shared/shared';
import { defaultTasks } from '@/shared/database';
import { ItemType, TaskType, Views } from '@/shared/types/types';
import React, { useCallback, useContext, useState } from 'react';
import CustomTextInput from '@/components/custom-input/custom-input';
import { StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { colors, globalStyles, taskBorderRadius, Text, View } from '@/components/theme/Themed';
import DraggableFlatList, { DragEndParams, RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { genID } from '@/shared/variables';

export default function Tasks({ selected, taskItems = defaultTasks }: any) {
    let [taskName, setTaskName] = useState(``);
    let { setEditing } = useContext<any>(SharedContext);
    let [tasks, setTasks] = useState<TaskType[]>(taskItems);

    const addTask = () => {
        Vibration.vibrate(1);
        
        setTasks(prevTasks => {
            const type = Views.Task;
            const newIndex = prevTasks.length + 1;
            const { id } = genID(`Task`, Views.Task, newIndex);

            const newTask = new TaskType({ 
                id, 
                type,
                name: taskName, 
                index: newIndex, 
            })

            const updatedTasks = [...prevTasks, newTask];
            return updatedTasks;
        });

        setTaskName(``);
    }

    const onDragEnd = async (onDragEndData: any) => {
        const updatedTasks = onDragEndData?.data?.map((task, taskIndex) => ({ ...task, index: taskIndex + 1}));
        await setTasks(updatedTasks);
    }

    const renderDraggableItem = useCallback(
        ({ item, drag, isActive, getIndex }: RenderItemParams<ItemType>) => {
        let index = getIndex();
        let isFirst: boolean = index == 0 ? true : false;
        let isLast: boolean = index == tasks.length - 1 ? true : false;
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
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
                        <Text style={{ textAlign: `left`, paddingLeft: 35 }}>
                            {index + 1} - {item?.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            </ScaleDecorator>
        )
    }, [])

    return (
        <>
            <View style={styles.tasksContainer}>
                <DraggableFlatList
                    data={tasks}
                    bounces={true}
                    nestedScrollEnabled={true}
                    directionalLockEnabled={true}
                    renderItem={renderDraggableItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<>No Tasks Yet</>}
                    keyExtractor={(item) => item.id.toString()}
                    style={{ height: `auto`, minHeight: tasks.length * 35}}
                    onDragEnd={async (onDragEndData: any) => await onDragEnd(onDragEndData)}
                    onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                    onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                    contentContainerStyle={{
                        gap: 3,
                        width: `100%`,
                        height: `auto`,
                        marginHorizontal: `auto`,
                        paddingBottom: tasks.length * 8.5,
                    }}
                />
            </View>
            <View style={styles.addTaskForm}>
                <CustomTextInput
                    showLabel={false}
                    value={taskName}
                    placeholder={`Name`}
                    onSave={() => addTask()}
                    onChangeText={setTaskName}
                    onBlur={() => setEditing(false)}
                    onFocus={() => setEditing(true)}
                    placeholderTextColor={colors.white}
                    style={{ width: `80%`, minHeight: 35, ...globalStyles.flexRow, marginBottom: 0, }}
                />
                <TouchableOpacity onPress={() => addTask()} style={{ width: `20%`, minHeight: 35, backgroundColor: colors.black, ...globalStyles.flexRow, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>
                    <Text style={{ width: `100%`, color: colors.white, textAlign: `center` }}>
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    tasksContainer: { 
        flex: 1,
        width: `100%`,
        marginTop: 12,
        maxHeight: 185,
        overflow: `hidden`,
        position: `relative`, 
        borderRadius: taskBorderRadius,
        backgroundColor: colors.transparent,
    },
    addTaskForm: { 
        width: `100%`,
        maxHeight: 35,
        marginTop: 12,
        overflow: `hidden`,
        position: `relative`,
        borderRadius: taskBorderRadius,
        backgroundColor: colors.transparent,
        ...globalStyles.flexRow,
        gap: 5, 
    },
})