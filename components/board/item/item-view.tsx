import React, { useState } from 'react';
import { web } from '@/shared/variables';
import { ItemViewType } from '@/shared/types/types';
import { Text, View } from '@/components/theme/Themed';
import { ScrollView } from 'react-native-gesture-handler';
import { boardStyles, cardedBorderRight } from '../styles';
import CustomImage from '@/components/custom-image/custom-image';
import { Animated, TextInput, TouchableWithoutFeedback } from 'react-native';

export default function ItemView({ 
    isForm, 
    selected, 
    backgroundColor, 
}: ItemViewType) {
    const [name, setName] = useState(selected.name);
    const [summary, setSummary] = useState(selected.summary);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingSummary, setIsEditingSummary] = useState(false);
    const [description, setDescription] = useState(selected.description);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const itemFontStyles = { ...(selected.fontColor && { color: selected.fontColor }) };

    const handleToggleEdit = (field: string) => {
        if (field === `name`) setIsEditingName(!isEditingName);
        if (field === `summary`) setIsEditingSummary(!isEditingSummary);
        if (field === `description`) setIsEditingDescription(!isEditingDescription);
    }

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
                        ...(web() ? { width: `50%`, alignItems: `center` } : { width: `50%` }) 
                    }}
                >
                    <CustomImage 
                        alt={selected.name} 
                        source={{ uri: selected.image }} 
                        style={{ 
                            ...cardedBorderRight,
                            ...boardStyles.cardImage, 
                            ...(web() && { width: `fit-content` }),
                        }} 
                    />
                </View>
                <View id={`itemTitle_${selected.id}`} style={{ ...boardStyles.cardRight }}>
                    <TouchableWithoutFeedback onPress={() => handleToggleEdit("name")}>
                        {isEditingName ? (
                            <TextInput
                                autoFocus
                                value={name}
                                onChangeText={setName}
                                id={`itemName_${selected.id}`}
                                onBlur={() => setIsEditingName(false)}
                                style={{ ...boardStyles.cardTitle, ...itemFontStyles, fontSize: 22 }}
                            />
                        ) : (
                            <Text id={`itemName_${selected.id}`} style={{ ...boardStyles.cardTitle, ...itemFontStyles, fontSize: 22 }}>
                                {name}
                            </Text>
                        )}
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => handleToggleEdit("summary")}>
                        {isEditingSummary ? (
                            <TextInput
                                autoFocus
                                value={summary}
                                onChangeText={setSummary}
                                id={`itemSummary_${selected.id}`}
                                onBlur={() => setIsEditingSummary(false)}
                                style={{ ...boardStyles.cardDescription, ...itemFontStyles, fontSize: 18, fontWeight: `bold` }}
                            />
                        ) : (
                            <Text id={`itemSummary_${selected.id}`} style={{ ...boardStyles.cardDescription, ...itemFontStyles, fontSize: 18, fontWeight: `bold` }}>
                                {summary}
                            </Text>
                        )}
                    </TouchableWithoutFeedback>
                </View>
            </Animated.View>

            <ScrollView id={`itemDetails_${selected.id}`} scrollEnabled={description && typeof description == `string` && description.length >= 500} style={{ flex: 1, width: `100%`, backgroundColor: `transparent`, marginVertical: 15 }}>
                <TouchableWithoutFeedback onPress={() => handleToggleEdit("description")}>
                    {isEditingDescription ? (
                        <TextInput
                            autoFocus
                            multiline
                            value={description}
                            onChangeText={setDescription}
                            id={`itemDescription_${selected.id}`}
                            onBlur={() => setIsEditingDescription(false)}
                            style={{ ...boardStyles.cardDescription, ...itemFontStyles, fontSize: 16, fontWeight: `bold` }}
                        />
                    ) : (
                        <Text id={`itemDescription_${selected.id}`} style={{ ...boardStyles.cardDescription, ...itemFontStyles, fontSize: 16, fontWeight: `bold` }}>
                            {description}
                        </Text>
                    )}
                </TouchableWithoutFeedback>
            </ScrollView>
        </>
    )
}