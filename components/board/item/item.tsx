import { boardStyles } from '../styles';
import React, { useContext } from 'react';
import { isValid } from '@/shared/variables';
import { SharedContext } from '@/shared/shared';
import { ItemType } from '@/shared/types/types';
import CustomImage from '@/components/custom-image/custom-image';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { Text, View, borderRadius, colors, isLightColor, itemCardHeight, itemSimplifiedCardHeight } from '@/components/theme/Themed';

export default function Item({ 
    item, 
    drag = undefined, 
    isActive = undefined, 
    getIndex = undefined, isLast 
}: any | RenderItemParams<ItemType>) {
    let { selected, fadeAnim, openBottomSheet, closeBottomSheet } = useContext<any>(SharedContext);

    return (
        <ScaleDecorator activeScale={1.01}>
            <TouchableOpacity
                onLongPress={drag}
                disabled={isActive != undefined ? isActive : false}
                onPress={() => selected != null ? closeBottomSheet() : openBottomSheet(item)}
                style={[boardStyles.rowItem, { position: `relative`, padding: 0, marginBottom: isLast == true ? 1 : 0 }]}
            >
                <Animated.View
                    id={`card-${item?.id}`}
                    style={{ flex: 1, width: `100%`, backgroundColor: item?.backgroundColor, borderRadius, opacity: fadeAnim }}
                >
                    <View style={{ 
                        ...boardStyles.card, 
                        gap: 25,
                        backgroundColor: item?.backgroundColor,
                        height: (isValid(item?.summary) || isValid(item?.image)) ? itemCardHeight : itemSimplifiedCardHeight, 
                        minHeight: (isValid(item?.summary) || isValid(item?.image)) ? itemCardHeight : itemSimplifiedCardHeight, 
                        maxHeight: (isValid(item?.summary) || isValid(item?.image)) ? itemCardHeight : itemSimplifiedCardHeight,
                    }}>
                        {(item?.image && item?.image != ``) ? (
                            <View style={[boardStyles.cardImageContainer]}>
                                <CustomImage alt={item?.name} source={{ uri: item?.image }} style={boardStyles.cardImage} />
                            </View>
                        ) : <View style={{ width: 15 }}></View>}
                        <View style={[boardStyles.cardRight, { gap: 10, position: `relative`, paddingVertical: (isValid(item?.summary) || isValid(item?.image)) ? 30 : 10 }]}>
                            <View style={[styles.indexBadge, { display: `flex`, justifyContent: `center`, alignItems: `center` }]}>
                                <Text style={{ ...boardStyles.cardTitle, color: isLightColor(item?.backgroundColor) ? colors.dark : colors.white, fontSize: 16 }}>
                                    {getIndex != undefined ? getIndex() + 1 : item?.index}
                                </Text>
                            </View>
                            <Text style={{ ...boardStyles.cardTitle, color: isLightColor(item?.backgroundColor) ? colors.dark : colors.white, overflowY: `visible` }}>
                                {item?.name}
                            </Text>
                            {isValid(item?.summary) ? (
                                <Text numberOfLines={3} ellipsizeMode={`tail`} style={{ ...boardStyles.cardDescription, color: isLightColor(item?.backgroundColor) ? colors.dark : colors.white, maxWidth: `90%` }}>
                                    {item?.summary}
                                </Text>
                            ) : <></>}
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