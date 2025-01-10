
import React from 'react';
import { web } from '@/shared/shared';
import { Animated } from 'react-native';
import { Text, View } from '@/components/Themed';
import { cardedBorderRight, styles } from './board';
import { ScrollView } from 'react-native-gesture-handler';
import CustomImage from '@/components/custom-image/custom-image';

export default function ItemDetailView({ selected }: any) {
    return (
        <>
            <Animated.View 
                id={`sheetCard`} 
                style={{ ...styles.card, height: web() ? 500 : 280, width: `100%`, backgroundColor: selected.backgroundColor }}
            >
                <View 
                    style={{ 
                        ...styles.cardImageContainer, 
                        ...(web() ? {width: `50%`, alignItems: `center`} : {width: `50%`}) 
                    }}
                >
                    <CustomImage 
                        alt={selected.name} 
                        source={{ uri: selected.image }} 
                        style={{ 
                            ...cardedBorderRight,
                            ...styles.cardImage, 
                            ...(web() && {width: `fit-content`}),
                        }} 
                    />
                </View>
                <View style={{ ...styles.cardRight }}>
                    <Text style={{ ...styles.cardTitle, ...selected.fontColor && ({color: selected.fontColor}) }}>
                        {selected.name}
                    </Text>
                    <Text style={{ ...styles.cardDescription, ...selected.fontColor && ({color: selected.fontColor}) }}>
                        {selected.summary}
                    </Text>
                </View>
            </Animated.View>
            <ScrollView style={{ flex: 1, width: `100%`, backgroundColor: `transparent`, marginVertical: 15 }}>
                <Text style={{ ...styles.cardDescription, ...selected.fontColor && ({color: selected.fontColor}) }}>
                    {selected.description}
                </Text>
            </ScrollView>
        </>
    )
}