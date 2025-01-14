import * as Haptics from 'expo-haptics';
import { boardStyles } from '../styles';
import { SharedContext } from '@/shared/shared';
import { ItemType } from '@/shared/types/types';
import { Layout } from 'react-native-reanimated';
import React, { useCallback, useContext, useState } from 'react';
import CustomImage from '@/components/custom-image/custom-image';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View, borderRadius, colors, itemCardHeight } from '@/components/theme/Themed';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

export default function Item({ item, drag, isActive, getIndex }: any | RenderItemParams<ItemType>) {
    let [subtasks, setSubtasks] = useState([{id: 1, name: `one`}, {id: 2, name: `two`}]);
    let { selected, fadeAnim, openBottomSheet, closeBottomSheet } = useContext<any>(SharedContext);

    const renderDraggableItem = useCallback(
        ({ item, drag, isActive, getIndex }: RenderItemParams<ItemType>) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[boardStyles.rowItem, { width: `100%`, minHeight: 35, backgroundColor: item?.backgroundColor }]}
                >
                    <View style={{width: `100%`, backgroundColor: item?.backgroundColor}}>
                        <Text style={{ textAlign: `center` }}>
                            {getIndex() + 1} - {item?.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            </ScaleDecorator>
        )
    }, [])

    return (
        <ScaleDecorator>
            <TouchableOpacity
                onLongPress={drag}
                disabled={isActive}
                style={[boardStyles.rowItem, { position: `relative` }]}
                onPress={() => selected != null ? closeBottomSheet() : openBottomSheet(item)}
            >
                <Animated.View
                    id={`card-${item?.id}`}
                    style={{ flex: 1, width: `100%`, backgroundColor: item?.backgroundColor, borderRadius, opacity: fadeAnim }}
                >
                    <View style={{ 
                        ...boardStyles.card, 
                        gap: 25,
                        height: itemCardHeight, 
                        minHeight: itemCardHeight, 
                        maxHeight: itemCardHeight,
                        backgroundColor: item?.backgroundColor,
                    }}>
                        {(item?.image && item?.image != ``) ? (
                            <View style={[boardStyles.cardImageContainer]}>
                                <CustomImage alt={item?.name} source={{ uri: item?.image }} style={boardStyles.cardImage} />
                            </View>
                        ) : <View style={{ width: 15 }}></View>}
                        <View style={[boardStyles.cardRight, { gap: 10, position: `relative` }]}>
                            <View style={[styles.indexBadge, { display: `flex`, justifyContent: `center`, alignItems: `center` }]}>
                                <Text style={{ ...boardStyles.cardTitle, color: colors.white, fontSize: 16 }}>
                                    {getIndex() + 1}
                                </Text>
                            </View>
                            <Text style={{ ...boardStyles.cardTitle, ...item?.fontColor && ({ color: item?.fontColor }) }}>
                                {item?.name}
                            </Text>
                            <Text numberOfLines={3} ellipsizeMode={`tail`} style={{ ...boardStyles.cardDescription, ...item?.fontColor && ({ color: item?.fontColor }), maxWidth: `90%` }}>
                                {item?.summary}
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
            {/* <DraggableFlatList
                bounces={true}
                data={subtasks}
                directionalLockEnabled={true}
                renderItem={renderDraggableItem}
                keyExtractor={(item) => item.id.toString()}
                style={{ height: `auto`, minHeight: subtasks.length * 35}}
                onDragEnd={(onDragEndData) => setSubtasks(onDragEndData?.data)}
                onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                contentContainerStyle={{
                    gap: 1,
                    width: `100%`,
                    height: `auto`,
                    paddingBottom: 2,
                    marginHorizontal: `auto`,
                }}
            /> */}
        </ScaleDecorator>
    )
}

const styles = StyleSheet.create({
    indexBadge: { backgroundColor: colors.background, position: `absolute`, top: 10, right: 10, borderRadius: `100%`, width: 25, height: 25 },
})