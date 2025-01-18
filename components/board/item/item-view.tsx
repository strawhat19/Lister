import ItemForm from './item-form';
import Tasks from '../tasks/tasks';
import { SharedContext } from '@/shared/shared';
import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { boardStyles, cardedBorderRight } from '../styles';
import CustomImage from '@/components/custom-image/custom-image';
import CustomTextInput from '@/components/custom-input/custom-input';
import { ItemViewType, Views, ItemViews } from '@/shared/types/types';
import { updateItemFieldsInDatabase } from '@/shared/server/firebase';
import { colors, isLightColor, Text, View } from '@/components/theme/Themed';
import { Animated, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { isValid, maxItemDescriptionLength, maxItemNameLength, maxItemSummaryLength, web } from '@/shared/variables';

export const maxItemDescriptionHeight = 251;

export default function ItemView({ selected,  backgroundColor }: ItemViewType) {
    let { view, setView, editing, setEditing } = useContext<any>(SharedContext);

    const [name, setName] = useState(selected.name);
    const [summary, setSummary] = useState(selected.summary);
    const [description, setDescription] = useState(selected.description);

    const itemFontStyles = { ...(selected.fontColor && { color: selected.fontColor }) };
    const placeHolderColor = isLightColor(selected?.backgroundColor) ? colors.darkFont : colors.lightFont;

    const onDescriptionSave = async () => await updateItemFieldsInDatabase(selected?.id, { description }); 
    const onNameSave = async () => isValid(name) ? await updateItemFieldsInDatabase(selected?.id, { name }) : null; 
    const onSummarySave = async () => typeof summary == `string` ? await updateItemFieldsInDatabase(selected?.id, { summary }) : null; 

    const scrollingDetailsEnabled = () => {
        return description && typeof description == `string` && (selected?.image && selected?.image != ``);
    }

    const onTopTogglePress = (viewType: ItemViews) => {
        Vibration.vibrate(1);
        setView(viewType);
    }

    return (
        <>
            {(!editing && selected?.type == Views.Item) ? (
                <View style={{ gap: 0, display: `flex`, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between`, backgroundColor: colors.transparent, width: `100%`, height: 30, marginTop: -15, marginBottom: 10, borderRadius: 8, overflow: `hidden` }}>
                    <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Summary)} style={[boardStyles.rowItem, { height: `100%`, flexBasis: `32.5%`, backgroundColor: view == ItemViews.Summary ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black }]}>
                        <Text>
                            {ItemViews.Summary}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Tasks)} style={[boardStyles.rowItem, { height: `100%`, flexBasis: `32.5%`, backgroundColor: view == ItemViews.Tasks ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black }]}>
                        <Text>
                            {ItemViews.Tasks}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Comments)} style={[boardStyles.rowItem, { height: `100%`, flexBasis: `32.5%`, backgroundColor: view == ItemViews.Comments ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black }]}>
                        <Text>
                            {ItemViews.Comments}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : <></>}
            <Animated.View 
                id={`sheetCard_${selected?.id}`} 
                style={{ 
                    ...boardStyles.card, 
                    gap: 0,
                    width: `100%`, 
                    alignItems: `center`,
                    paddingTop: selected?.type == Views.Item && selected?.image ? 0 : 5,
                    backgroundColor: backgroundColor ? backgroundColor : selected.backgroundColor, 
                    height: (editing && selected?.type == Views.Item) ? 0 : ((web() || selected?.type == Views.ItemForm) ? 500 : selected?.image ? 280 : 120), 
                }}
            >
                {selected?.type == Views.ItemForm ? <>
                    <ItemForm />
                </> : <></>}
                {(!editing && selected?.type == Views.Item) ? <>
                    {(selected?.image && selected?.image != ``) ? (
                        <View  id={`itemImage_${selected.id}`} style={{ ...boardStyles.cardImageContainer, alignItems: `center`, minWidth: `50%`, }}>
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
                    <View id={`itemTitle_${selected.id}`} style={{ ...boardStyles.cardRight, height: `100%`, minHeight: `100%`, maxHeight: `100%`, gap: 0, paddingVertical: 0, alignItems: `center`, justifyContent: `center`, }}>
                        <CustomTextInput
                            value={name}
                            multiline={true}
                            showLabel={false}
                            placeholder={`Name`}
                            onChangeText={setName}
                            onDone={() => onNameSave()}
                            maxLength={maxItemNameLength}
                            placeholderTextColor={name == `` ? colors.black : placeHolderColor}
                            style={{ 
                                ...itemFontStyles, 
                                ...styles.itemInput, 
                                maxHeight: 30, 
                                minHeight: 30, 
                                fontSize: 21, 
                                fontStyle: name == `` ? `italic` : `normal`,
                            }}
                        />
                        <CustomTextInput
                            value={summary}
                            multiline={true}
                            showLabel={false}
                            numberOfLines={5}
                            placeholder={`Summary`}
                            onChangeText={setSummary}
                            onDone={() => onSummarySave()}
                            maxLength={maxItemSummaryLength}
                            placeholderTextColor={summary == `` ? colors.black : placeHolderColor}
                            style={{ 
                                ...itemFontStyles, 
                                ...styles.itemInput, 
                                fontSize: summary == `` ? 12 : 18, 
                                minHeight: selected?.image ? 215 : `auto`, 
                                fontStyle: summary == `` ? `italic` : `normal`,
                            }}
                        />
                    </View>
                </> : <></>}
            </Animated.View>

            {selected?.type == Views.Item ? <>
                {view == ItemViews.Summary && (
                    <ScrollView 
                        nestedScrollEnabled={true}
                        id={`itemDetails_${selected.id}`}
                        scrollEnabled={scrollingDetailsEnabled() ? description.length >= 420 : description.length >= 620} 
                        style={{ flex: 1, width: `100%`, backgroundColor: `transparent`, marginVertical: selected?.image ? 15 : 0 }}
                    >
                        <CustomTextInput
                            multiline={true}
                            showLabel={false}
                            numberOfLines={15}
                            value={description}
                            placeholder={`Description`}
                            onChangeText={setDescription}
                            onBlur={() => setEditing(false)}
                            onFocus={() => setEditing(true)}
                            onDone={() => onDescriptionSave()}
                            maxLength={maxItemDescriptionLength}
                            placeholderTextColor={description == `` ? colors.black : placeHolderColor}
                            style={{ 
                                ...itemFontStyles, 
                                ...styles.itemInput,
                                fontStyle: description == `` ? `italic` : `normal`,
                                minHeight: maxItemDescriptionHeight, 
                                fontSize: description == `` ? 12 : 16, 
                            }}
                        />
                    </ScrollView>
                )}

                {view == ItemViews.Tasks && <>
                    <Tasks selected={selected} />
                </>}
            </> : <></>}
        </>
    )
}

const styles = StyleSheet.create({
    borderedInput: { borderWidth: 1, borderColor: colors.listsBG, },
    itemInput: { 
        ...boardStyles.cardTitle, 
        backgroundColor: colors.transparent, 
        borderColor: colors.transparent, 
        padding: 0,
    },
})