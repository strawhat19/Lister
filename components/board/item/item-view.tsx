import ItemForm from './item-form';
import React, { useState } from 'react';
import { web } from '@/shared/variables';
import { Text, View } from '@/components/theme/Themed';
import { ScrollView } from 'react-native-gesture-handler';
import { boardStyles, cardedBorderRight } from '../styles';
import CustomImage from '@/components/custom-image/custom-image';
import { ItemViewType, SheetComponents } from '@/shared/types/types';
import { Animated, TextInput, TouchableWithoutFeedback } from 'react-native';

export default function ItemView({ 
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
                id={`sheetCard_${selected?.id}`} 
                style={{ 
                    ...boardStyles.card, 
                    width: `100%`, 
                    backgroundColor: backgroundColor ? backgroundColor : selected.backgroundColor, 
                    height: (web() || selected?.type == SheetComponents.ItemForm) ? 500 : selected?.image ? 280 : `auto`, 
                }}
            >
                {selected?.type == SheetComponents.ItemForm ? <>
                    <ItemForm />
                </> : <></>}
                {selected?.type == SheetComponents.Item ? <>
                    {(selected?.image && selected?.image != ``) ? (
                        <View 
                            id={`itemImage_${selected.id}`}
                            style={{ 
                                alignItems: `center`,
                                ...boardStyles.cardImageContainer, 
                                minWidth: `50%`,
                            }}
                        >
                            <CustomImage 
                                alt={selected.name} 
                                source={{ uri: selected.image }} 
                                style={{ 
                                    ...cardedBorderRight,
                                    ...boardStyles.cardImage, 
                                    ...(web() && { width: `fit-content` }),
                                    minWidth: `100%`,
                                }} 
                            />
                        </View>
                    ) : <></>}
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
                </> : <></>}
            </Animated.View>

            {selected?.type == SheetComponents.Item ? (
                <ScrollView 
                    id={`itemDetails_${selected.id}`}
                    style={{ flex: 1, width: `100%`, backgroundColor: `transparent`, marginVertical: 15 }}
                    scrollEnabled={description && typeof description == `string` && (selected?.image ? description.length >= 500 : description.length >= 720)} 
                >
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
            ) : <></>}
        </>
    )
}