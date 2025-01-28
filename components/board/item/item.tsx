import { boardStyles } from '../styles';
import React, { useContext } from 'react';
import { isValid } from '@/shared/variables';
import { SharedContext } from '@/shared/shared';
import { ItemType } from '@/shared/types/types';
import { FontAwesome } from '@expo/vector-icons';
import { Animated, TouchableOpacity } from 'react-native';
import CustomImage from '@/components/custom-image/custom-image';
import { RenderItemParams } from 'react-native-draggable-flatlist';
import { Text, View, borderRadius, colors, isLightColor, itemCardHeight, itemSimplifiedCardHeight } from '@/components/theme/Themed';

export default function Item({ 
    item, 
    index,
    isLast, 
    drag = undefined, 
    isActive = undefined, 
}: any | RenderItemParams<ItemType>) {
    let { selected, openBottomSheet, closeBottomSheet } = useContext<any>(SharedContext);

    const fontColor = (item?.complete || isLightColor(item?.backgroundColor)) ? colors.darkFont : colors.lightFont;

    return (
        <TouchableOpacity
            onLongPress={drag}
            disabled={isActive != undefined ? isActive : false}
            onPress={() => selected != null ? closeBottomSheet() : openBottomSheet(item)}
            style={[boardStyles.rowItem, { position: `relative`, padding: 0, marginBottom: isLast == true ? 1 : 0 }]}
        >
            <Animated.View
                id={`card-${item?.id}`}
                style={{ flex: 1, width: `100%`, backgroundColor: item?.backgroundColor, borderRadius, opacity: selected == null ? 1 : 0 }}
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
                        <View style={{ 
                            gap: 3,
                            width: `15%`, 
                            display: `flex`, 
                            height: `1000%`,
                            flexDirection: `row`,
                            position: `absolute`,
                            backgroundColor: colors.transparent,
                            ...((isValid(item?.summary) || isValid(item?.image)) ? {
                                right: isValid(item?.image) ? (isValid(item?.summary) ? 0 : 1) : -8,
                                top: (isValid(item?.summary) && isValid(item?.image)) ? 5 : isValid(item?.image) ? -20 : (isValid(item?.summary) ? -5 : -5),
                            } : {
                                borderRightWidth: 1, 
                                alignItems: `center`,
                                justifyContent: `center`, 
                                borderColor: fontColor,
                            }),
                        }}>
                            {item?.complete ? (
                                <FontAwesome name={`check`} color={colors.success} size={16} style={{ 
                                    ...((isValid(item?.summary) || isValid(item?.image)) ? {
                                        position: `absolute`, 
                                        left: -20, 
                                        top: 3,
                                    } : {}),
                                }} />
                            ) : <></>}
                            <Text style={{ ...boardStyles.cardTitle, color: fontColor, fontSize: 18, fontStyle: `italic` }}>
                                {index + 1}
                            </Text>
                        </View>
                        <Text 
                            numberOfLines={2} 
                            ellipsizeMode={`tail`} 
                            style={{ 
                                ...boardStyles.cardTitle, 
                                overflowY: `visible`,
                                color: fontColor, 
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
    )
}