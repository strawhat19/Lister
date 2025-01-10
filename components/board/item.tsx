import { boardStyles } from './styles';
import { state } from '@/shared/state';
import React, { useContext } from 'react';
import { VertImageCard } from '@/common/types';
import { Animated, TouchableOpacity } from 'react-native';
import CustomImage from '@/components/custom-image/custom-image';
import { appleBlue, Text, View, borderRadius } from '@/components/Themed';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

export default function Item({ item, drag, isActive, fadeAnim, openItem, closeBottomSheet }: any | RenderItemParams<VertImageCard>) {
    let { selected } = useContext<any>(state);

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
                    style={{ flex: 1, width: `100%`, backgroundColor: appleBlue, borderRadius, opacity: fadeAnim }}
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