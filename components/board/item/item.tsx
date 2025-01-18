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

    const fontColor = isLightColor(item?.backgroundColor) ? colors.dark : colors.lightFont;

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
                        // backgroundColor: colors.white,
                        backgroundColor: item?.backgroundColor,
                        height: (isValid(item?.summary) || isValid(item?.image)) ? itemCardHeight : itemSimplifiedCardHeight, 
                        minHeight: (isValid(item?.summary) || isValid(item?.image)) ? itemCardHeight : itemSimplifiedCardHeight, 
                        maxHeight: (isValid(item?.summary) || isValid(item?.image)) ? itemCardHeight : itemSimplifiedCardHeight,
                    }}>
                        {(item?.image && item?.image != ``) ? (
                            <View style={[boardStyles.cardImageContainer]}>
                                <CustomImage alt={item?.name} source={{ uri: item?.image }} style={boardStyles.cardImage} />
                            </View>
                        ) : <></>}

                        <View style={[boardStyles.cardRight, { 
                            gap: 10, 
                            display: `flex`,
                            position: `relative`, 
                            flexDirection: `row`,
                            alignItems: `center`,
                            paddingVertical: (isValid(item?.summary) || isValid(item?.image)) ? 30 : 10, 
                        }]}>
                            <View style={[styles.indexBadge, { 
                                display: `flex`, 
                                borderRightWidth: 2,
                                alignItems: `center`, 
                                borderColor: fontColor,
                                justifyContent: `center`, 
                                backgroundColor: colors.transparent,
                            }]}>
                                <Text style={{ ...boardStyles.cardTitle, color: fontColor, fontSize: 18, fontStyle: `italic` }}>
                                    {getIndex != undefined ? getIndex() + 1 : item?.index}
                                </Text>
                            </View>
                            <Text numberOfLines={2} ellipsizeMode={`tail`} style={{ ...boardStyles.cardTitle, color: fontColor, overflowY: `visible`, marginLeft: 70, ...(!isValid(item?.summary) && { maxWidth: `70%` }) }}>
                                {item?.name}
                            </Text>
                            {isValid(item?.summary) ? (
                                <Text numberOfLines={3} ellipsizeMode={`tail`} style={{ ...boardStyles.cardDescription, color: fontColor, maxWidth: `90%` }}>
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
        width: `15%`, 
        height: `1000%`,
        position: `absolute`,
    },
})