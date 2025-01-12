import ItemForm from './item-form';
import React, { useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { colors, View } from '@/components/theme/Themed';
import { ScrollView } from 'react-native-gesture-handler';
import { boardStyles, cardedBorderRight } from '../styles';
import CustomImage from '@/components/custom-image/custom-image';
import { ItemViewType, SheetComponents } from '@/shared/types/types';
import CustomTextInput from '@/components/custom-input/custom-input';
import { maxItemDescriptionLength, maxItemNameLength, maxItemSummaryLength, web } from '@/shared/variables';

export const maxItemDescriptionHeight = 251;

export default function ItemView({ 
    selected, 
    backgroundColor, 
}: ItemViewType) {
    const [name, setName] = useState(selected.name);
    const [summary, setSummary] = useState(selected.summary);
    const [description, setDescription] = useState(selected.description);
    const itemFontStyles = { ...(selected.fontColor && { color: selected.fontColor }) };

    const scrollingDetailsEnabled = () => {
        return description && typeof description == `string` && (selected?.image && selected?.image != ``);
    }

    return (
        <>
            <Animated.View 
                id={`sheetCard_${selected?.id}`} 
                style={{ 
                    ...boardStyles.card, 
                    gap: 0,
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
                                ...boardStyles.cardImageContainer, 
                                alignItems: `center`,
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
                    <View id={`itemTitle_${selected.id}`} style={{ ...boardStyles.cardRight, gap: 0, paddingVertical: 0 }}>
                        <CustomTextInput
                            value={name}
                            multiline={true}
                            showLabel={false}
                            placeholder={`Name`}
                            onChangeText={setName}
                            maxLength={maxItemNameLength}
                            style={{ ...itemFontStyles, ...styles.itemInput, fontSize: 22, minHeight: 30 }}
                        />

                        <CustomTextInput
                            value={summary}
                            multiline={true}
                            showLabel={false}
                            numberOfLines={5}
                            placeholder={`Summary`}
                            onChangeText={setSummary}
                            maxLength={maxItemSummaryLength}
                            style={{ ...itemFontStyles, ...styles.itemInput, fontSize: 18, minHeight: 215 }}
                        />
                    </View>
                </> : <></>}
            </Animated.View>

            {selected?.type == SheetComponents.Item ? (
                <ScrollView 
                    id={`itemDetails_${selected.id}`}
                    style={{ flex: 1, width: `100%`, backgroundColor: `transparent`, marginVertical: 15 }}
                    scrollEnabled={scrollingDetailsEnabled() ? description.length >= 500 : description.length >= 720} 
                >
                    <CustomTextInput
                        multiline={true}
                        showLabel={false}
                        numberOfLines={999}
                        value={description}
                        placeholder={`Description`}
                        onChangeText={setDescription}
                        maxLength={maxItemDescriptionLength}
                        style={{ 
                            ...itemFontStyles, 
                            ...styles.itemInput, 
                            fontSize: 16, 
                            minHeight: maxItemDescriptionHeight, 
                        }}
                    />
                </ScrollView>
            ) : <></>}
        </>
    )
}

const styles = StyleSheet.create({
    itemInput: { 
        ...boardStyles.cardTitle, 
        backgroundColor: colors.transparent, 
        borderColor: colors.transparent, 
        padding: 0,
    },
})