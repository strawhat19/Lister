import { boardStyles } from '../styles';
import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import { ItemType } from '@/shared/types/types';
import CustomImage from '@/components/custom-image/custom-image';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { Text, View, borderRadius, colors, itemCardHeight } from '@/components/theme/Themed';

export default function Item({ item, drag, isActive, getIndex }: any | RenderItemParams<ItemType>) {
    let { selected, fadeAnim, openBottomSheet, closeBottomSheet } = useContext<any>(SharedContext);

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
                                <Text style={{ ...boardStyles.cardTitle, color: item?.fontColor ? item?.fontColor : colors.white, fontSize: 16 }}>
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
        </ScaleDecorator>
    )
}

const styles = StyleSheet.create({
    indexBadge: { 
        top: 10, 
        right: 10, 
        width: 25, 
        height: 25 ,
        borderRadius: `100%`, 
        position: `absolute`, 
        backgroundColor: colors.transparent, 
    },
})