import * as Haptics from 'expo-haptics';
import { boardStyles } from '../styles';
import { TouchableOpacity } from 'react-native';
import { defaultTasks } from '@/shared/database';
import React, { useCallback, useState } from 'react';
import { ItemType, TaskType } from '@/shared/types/types';
import { colors, Text, View } from '@/components/theme/Themed';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

export default function Subtasks({ tasks = defaultTasks }: any) {
    let [subtasks, setSubtasks] = useState<TaskType[]>(tasks);

    const renderDraggableItem = useCallback(
        ({ item, drag, isActive, getIndex }: RenderItemParams<ItemType>) => {
        
        let index = getIndex();
        // let isLast = index == subtasks.length - 1;
        // let borderStyle = { borderTopRightRadius: index == 0 ? 8 : 0, borderBottomRightRadius: isLast ? 8 : 0, };

        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[boardStyles.rowItem, { width: `100%`, minHeight: 35, backgroundColor: colors.black }]}
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
        <DraggableFlatList
            bounces={true}
            data={subtasks}
            nestedScrollEnabled={true}
            directionalLockEnabled={true}
            renderItem={renderDraggableItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            style={{ height: `auto`, minHeight: subtasks.length * 35}}
            onDragEnd={(onDragEndData) => setSubtasks(onDragEndData?.data)}
            onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
            onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
            contentContainerStyle={{
                gap: 1,
                width: `100%`,
                height: `auto`,
                marginHorizontal: `auto`,
                paddingBottom: subtasks.length * 8.5,
            }}
        />
    )
}