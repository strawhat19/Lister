
import React from 'react';
import { Animated } from 'react-native';
import { web } from '@/shared/variables';
import { ItemViewType } from '@/shared/types/types';
import { Text, View } from '@/components/theme/Themed';
import { ScrollView } from 'react-native-gesture-handler';
import { boardStyles, cardedBorderRight } from '../styles';
import CustomImage from '@/components/custom-image/custom-image';

export default function ItemView({ 
    isForm, 
    selected, 
    backgroundColor, 
}: ItemViewType) {
    const itemFontStyles = { ...selected.fontColor && ({color: selected.fontColor}) };
    return (
        <>
            <Animated.View 
                id={`sheetCard`} 
                style={{ 
                    ...boardStyles.card, 
                    width: `100%`, 
                    height: web() ? 500 : 280, 
                    backgroundColor: backgroundColor ? backgroundColor : selected.backgroundColor, 
                }}
            >
                <View 
                    id={`itemImage_${selected.id}`}
                    style={{ 
                        ...boardStyles.cardImageContainer, 
                        ...(web() ? {width: `50%`, alignItems: `center`} : {width: `50%`}) 
                    }}
                >
                    <CustomImage 
                        alt={selected.name} 
                        source={{ uri: selected.image }} 
                        style={{ 
                            ...cardedBorderRight,
                            ...boardStyles.cardImage, 
                            ...(web() && {width: `fit-content`}),
                        }} 
                    />
                </View>
                <View id={`itemTitle_${selected.id}`} style={{ ...boardStyles.cardRight }}>
                    <Text id={`itemName_${selected.id}`} style={{ ...boardStyles.cardTitle, ...itemFontStyles }}>
                        {selected.name}
                    </Text>
                    <Text id={`itemSummary_${selected.id}`} style={{ ...boardStyles.cardDescription, ...itemFontStyles }}>
                        {selected.summary}
                    </Text>
                </View>
            </Animated.View>
            <ScrollView id={`itemDetails_${selected.id}`} style={{ flex: 1, width: `100%`, backgroundColor: `transparent`, marginVertical: 15 }}>
                <Text id={`itemDescription_${selected.id}`} style={{ ...boardStyles.cardDescription, ...itemFontStyles }}>
                    {selected.description}
                </Text>
            </ScrollView>
        </>
    )
}