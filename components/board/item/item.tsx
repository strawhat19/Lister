import { boardStyles } from '../styles';
import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import { ItemType } from '@/shared/types/types';
import { Animated, TouchableOpacity } from 'react-native';
import CustomImage from '@/components/custom-image/custom-image';
import { Text, View, borderRadius } from '@/components/theme/Themed';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

export default function Item({ item, drag, isActive, fadeAnim, openItem, closeBottomSheet }: any | RenderItemParams<ItemType>) {
    let { selected } = useContext<any>(SharedContext);

    return (
        <ScaleDecorator>
            <TouchableOpacity
                onLongPress={drag}
                disabled={isActive}
                style={boardStyles.rowItem}
                onPress={() => selected != null ? closeBottomSheet() : openItem(item)}
            >
                <Animated.View
                    id={`card-${item?.id}`}
                    style={{ flex: 1, width: `100%`, backgroundColor: item?.backgroundColor, borderRadius, opacity: fadeAnim }}
                >
                    <View style={{ ...boardStyles.card, backgroundColor: item?.backgroundColor }}>
                        <View style={boardStyles.cardImageContainer}>
                            <CustomImage alt={item?.name} source={{ uri: item?.image }} style={boardStyles.cardImage} />
                        </View>
                        <View style={boardStyles.cardRight}>
                            <Text style={{ ...boardStyles.cardTitle, ...item?.fontColor && ({ color: item?.fontColor }) }}>
                                {item?.name}
                            </Text>
                            <Text style={{ ...boardStyles.cardDescription, ...item?.fontColor && ({ color: item?.fontColor }) }}>
                                {item?.summary}
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </ScaleDecorator>
    )
}