import * as Haptics from 'expo-haptics';
import { boardStyles } from '../styles';
import { genID, log } from '@/shared/variables';
import { SharedContext } from '@/shared/shared';
import { defaultTasks } from '@/shared/database';
import { ItemType, TaskType, Views } from '@/shared/types/types';
import CustomTextInput from '@/components/custom-input/custom-input';
import { StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { colors, globalStyles, taskBorderRadius, Text, View } from '@/components/theme/Themed';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

export default function Tasks({ selected, taskItems = defaultTasks }: any) {
    const listRef = useRef(null);

    let [taskName, setTaskName] = useState(``);
    let { setEditing } = useContext<any>(SharedContext);
    let [tasks, setTasks] = useState<TaskType[]>(taskItems);

    const onPressTask = (item: TaskType) => {
        Vibration.vibrate(1);
        log(`Task`, item);
    }

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

            setTimeout(() => {
                listRef.current?.scrollToEnd({ animated: true });
            }, 100);

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
                    ref={listRef}
                    bounces={true}
                    style={{ height: `auto`}}
                    nestedScrollEnabled={true}
                    directionalLockEnabled={true}
                    renderItem={renderDraggableItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<>No Tasks Yet</>}
                    keyExtractor={(item) => item.id.toString()}
                    onDragEnd={async (onDragEndData: any) => await onDragEnd(onDragEndData)}
                    onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                    onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                    contentContainerStyle={{
                        gap: 3,
                        width: `100%`,
                        height: `auto`,
                        marginHorizontal: `auto`,
                        paddingBottom: tasks.length * 0.25,
                    }}
                />
            </View>
            <View style={styles.addTaskForm}>
                <CustomTextInput
                    value={taskName}
                    showLabel={false}
                    placeholder={`Name`}
                    endIconName={`save`}
                    onChangeText={setTaskName}
                    endIconPress={() => addTask()}
                    endIconDisabled={taskName == ``}
                    onBlur={() => setEditing(false)}
                    onFocus={() => setEditing(true)}
                    placeholderTextColor={colors.white}
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