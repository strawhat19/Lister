import * as Haptics from 'expo-haptics';
import { boardStyles } from '../styles';
import { SharedContext } from '@/shared/shared';
import { defaultTasks } from '@/shared/database';
import { ItemType, TaskType } from '@/shared/types/types';
import React, { useCallback, useContext, useState } from 'react';
import CustomTextInput from '@/components/custom-input/custom-input';
import { StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { colors, globalStyles, taskBorderRadius, Text, View } from '@/components/theme/Themed';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

export default function Subtasks({ selected, tasks = defaultTasks }: any) {
    let [subtaskName, setSubtaskName] = useState(``);
    let { setEditing } = useContext<any>(SharedContext);
    let [subtasks, setSubtasks] = useState<TaskType[]>(tasks);

    const addTask = () => {
        Vibration.vibrate(1);
        setSubtasks(prevTasks => [...prevTasks, { id: prevTasks.length + 1, index: prevTasks.length + 1, name: subtaskName }]);
        setSubtaskName(``);
    }

    const renderDraggableItem = useCallback(
        ({ item, drag, isActive, getIndex }: RenderItemParams<ItemType>) => {
        let index = getIndex();
        let isFirst: boolean = index == 0 ? true : false;
        let isLast: boolean = index == subtasks.length - 1 ? true : false;
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
                    bounces={true}
                    data={subtasks}
                    nestedScrollEnabled={true}
                    directionalLockEnabled={true}
                    renderItem={renderDraggableItem}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    style={{ height: `auto`, minHeight: subtasks.length * 35}}
                    onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                    onDragEnd={async (onDragEndData) => await setSubtasks(onDragEndData?.data)}
                    onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                    contentContainerStyle={{
                        gap: 3,
                        width: `100%`,
                        height: `auto`,
                        marginHorizontal: `auto`,
                        paddingBottom: subtasks.length * 8.5,
                    }}
                />
            </View>
            <View style={styles.addTaskForm}>
                <CustomTextInput
                    showLabel={false}
                    value={subtaskName}
                    placeholder={`Name`}
                    onSave={() => addTask()}
                    onChangeText={setSubtaskName}
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