import ItemForm from './item-form';
import { SharedContext } from '@/shared/shared';
import React, { useContext, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { colors, View } from '@/components/theme/Themed';
import { ScrollView } from 'react-native-gesture-handler';
import { boardStyles, cardedBorderRight } from '../styles';
import CustomImage from '@/components/custom-image/custom-image';
import { ItemViewType, SheetComponents } from '@/shared/types/types';
import CustomTextInput from '@/components/custom-input/custom-input';
import { maxItemDescriptionLength, maxItemNameLength, maxItemSummaryLength, web } from '@/shared/variables';

export const maxItemDescriptionHeight = 251;

export default function ItemView({ selected,  backgroundColor }: ItemViewType) {
    let { editing, setEditing } = useContext<any>(SharedContext);

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
                    paddingTop: selected?.type == SheetComponents.Item && selected?.image ? 0 : 5,
                    height: (editing && selected?.type == SheetComponents.Item) ? 0 : ((web() || selected?.type == SheetComponents.ItemForm) ? 500 : selected?.image ? 280 : `auto`), 
                }}
            >
                {selected?.type == SheetComponents.ItemForm ? <>
                    <ItemForm />
                </> : <></>}
                {(!editing && selected?.type == SheetComponents.Item) ? <>
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
                            // onSave={() => onSave()}
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
                            style={{ ...itemFontStyles, ...styles.itemInput, fontSize: 18, minHeight: selected?.image ? 215 : `auto` }}
                        />
                    </View>
                </> : <></>}
            </Animated.View>

            {selected?.type == SheetComponents.Item ? (
                <ScrollView 
                    id={`itemDetails_${selected.id}`}
                    scrollEnabled={scrollingDetailsEnabled() ? description.length >= 500 : description.length >= 720} 
                    style={{ flex: 1, width: `100%`, backgroundColor: `transparent`, marginVertical: selected?.image ? 15 : 0 }}
                >
                    <CustomTextInput
                        multiline={true}
                        showLabel={false}
                        numberOfLines={999}
                        value={description}
                        placeholder={`Description`}
                        onChangeText={setDescription}
                        onBlur={() => setEditing(false)}
                        onFocus={() => setEditing(true)}
                        maxLength={maxItemDescriptionLength}
                        style={{ 
                            ...itemFontStyles, 
                            ...styles.itemInput, 
                            minHeight: maxItemDescriptionHeight, 
                            fontSize: 16, 
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