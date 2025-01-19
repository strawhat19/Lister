import { boardStyles } from '../styles';
import React, { useContext } from 'react';
import { isValid } from '@/shared/variables';
import { SharedContext } from '@/shared/shared';
import { ItemType } from '@/shared/types/types';
import CustomImage from '@/components/custom-image/custom-image';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { Text, View, borderRadius, colors, isLightColor, itemCardHeight, itemSimplifiedCardHeight } from '@/components/theme/Themed';
import { FontAwesome } from '@expo/vector-icons';

export default function Item({ 
    item, 
    drag = undefined, 
    isActive = undefined, 
    getIndex = undefined, isLast 
}: any | RenderItemParams<ItemType>) {
    let { selected, fadeAnim, openBottomSheet, closeBottomSheet } = useContext<any>(SharedContext);

    const fontColor = (item?.complete || isLightColor(item?.backgroundColor)) ? colors.darkFont : colors.lightFont;

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
                        backgroundColor: item?.complete ? colors.white : item?.backgroundColor,
                        height: (isValid(item?.summary) || isValid(item?.image)) ? itemCardHeight : itemSimplifiedCardHeight, 
                        minHeight: (isValid(item?.summary) || isValid(item?.image)) ? itemCardHeight : itemSimplifiedCardHeight, 
                        maxHeight: (isValid(item?.summary) || isValid(item?.image)) ? itemCardHeight : itemSimplifiedCardHeight,
                    }}>
                        {isValid(item?.image) ? (
                            <View style={[boardStyles.cardImageContainer]}>
                                <CustomImage alt={item?.name} source={{ uri: item?.image }} style={boardStyles.cardImage} />
                            </View>
                        ) : <></>}
                        <View style={[boardStyles.cardRight, { 
                            gap: 10, 
                            position: `relative`, 
                            paddingVertical: (isValid(item?.summary) || isValid(item?.image)) ? 30 : 10, 
                            ...(isValid(item?.summary) ? {
                                flexDirection: `column`,
                                paddingLeft: isValid(item?.image) ? 0 : 65,
                            } : {
                                display: `flex`,
                                flexDirection: `row`,
                                alignItems: `center`,
                            }),
                        }]}>
                            <View style={[styles.indexBadge, { 
                                gap: 3,
                                display: `flex`, 
                                flexDirection: `row`,
                                backgroundColor: colors.transparent,
                                ...((isValid(item?.summary) || isValid(item?.image)) ? {
                                    right: isValid(item?.image) ? (isValid(item?.summary) ? 0 : 1) : -8,
                                    top: (isValid(item?.summary) && isValid(item?.image)) ? 25 : isValid(item?.image) ? -20 : (isValid(item?.summary) ? 15 : -5),
                                } : {
                                    borderRightWidth: 2, 
                                    alignItems: `center`,
                                    borderColor: fontColor,
                                    justifyContent: `center`, 
                                }),
                            }]}>
                                {!isValid(item?.summary) && !isValid(item?.image) && (
                                    item?.complete && <FontAwesome name={`check`} color={colors.success} size={16} />
                                )}
                                <Text style={{ ...boardStyles.cardTitle, color: fontColor, fontSize: 18, fontStyle: `italic` }}>
                                    {getIndex != undefined ? getIndex() + 1 : item?.index}
                                </Text>
                            </View>
                            <Text 
                                numberOfLines={2} 
                                ellipsizeMode={`tail`} 
                                style={{ 
                                    ...boardStyles.cardTitle, 
                                    color: fontColor, 
                                    overflowY: `visible`,
                                    textDecorationLine: item?.complete ? `line-through` : `none`,
                                    ...(isValid(item?.summary) ? {
                                        maxWidth: `90%`, 
                                        marginLeft: isValid(item?.image) ? -5 : -35, 
                                    } : { 
                                        marginLeft: isValid(item?.image) ? -5 : 70, 
                                        maxWidth: isValid(item?.image) ? `100%` : `70%`, 
                                    }), 
                                }}
                            >
                                {item?.name}
                            </Text>
                            {isValid(item?.summary) ? (
                                <Text 
                                    numberOfLines={3} 
                                    ellipsizeMode={`tail`} 
                                    style={{ 
                                        ...boardStyles.cardDescription, 
                                        maxWidth: `90%`,
                                        color: fontColor, 
                                        marginLeft: isValid(item?.image) ? -5 : -35, 
                                        textDecorationLine: item?.complete ? `line-through` : `none`,
                                    }}
                                >
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