import ItemForm from './item-form';
import Tasks from '../tasks/tasks';
import { SharedContext } from '@/shared/shared';
import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { boardStyles, cardedBorderRight } from '../styles';
import CustomImage from '@/components/custom-image/custom-image';
import { ItemViewType, Views, ItemViews } from '@/shared/types/types';
import { updateItemFieldsInDatabase } from '@/shared/server/firebase';
import ForwardRefInput from '@/components/custom-input/forward-ref-input';
import { colors, isLightColor, Text, View } from '@/components/theme/Themed';
import { Animated, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { isValid, log, logMsgLine, maxItemDescriptionLength, maxItemNameLength, maxItemSummaryLength, web } from '@/shared/variables';

export const maxItemDescriptionHeight = 251;

export default function ItemView({ selected, backgroundColor }: ItemViewType) {
    let { view, setView, editing, setEditing, setSelected, setActiveTopName } = useContext<any>(SharedContext);

    const [name, setName] = useState(selected.name);
    const [summary, setSummary] = useState(selected.summary);
    const [description, setDescription] = useState(selected.description);

    const itemFontStyles = { ...(selected.fontColor && { color: selected.fontColor }) };
    const placeHolderColor = isLightColor(selected?.backgroundColor) ? colors.darkFont : colors.lightFont;

    const scrollingDetailsEnabled = () => {
        return description && typeof description == `string` && (selected?.image && selected?.image != ``);
    }

    const onTopTogglePress = (viewType: ItemViews) => {
        Vibration.vibrate(1);
        setView(viewType);
    }

    const onSummarySave = async () => {
        await updateItemFieldsInDatabase(selected?.id, { summary });
        await setSelected({ ...selected, summary });
    }; 

    const onDescriptionSave = async () => {
        await updateItemFieldsInDatabase(selected?.id, { description });
        await setSelected({ ...selected, description });
    }; 

    const onNameSave = async () => {
        await updateItemFieldsInDatabase(selected?.id, { name });
        await setSelected({ ...selected, name });
        await setActiveTopName(name);
    }; 

    return (
        <>
            {(!editing && selected?.type == Views.Item) ? (
                <View style={{ gap: 0, display: `flex`, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between`, backgroundColor: colors.transparent, width: `100%`, height: 30, marginTop: -15, marginBottom: 10, borderRadius: 8, overflow: `hidden` }}>
                    <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Summary)} style={[boardStyles.rowItem, { height: `100%`, flexBasis: `32.5%`, backgroundColor: view == ItemViews.Summary ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black }]}>
                        <Text style={{ fontWeight: `bold` }}>
                            {ItemViews.Summary}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Tasks)} style={[boardStyles.rowItem, { height: `100%`, flexBasis: `32.5%`, backgroundColor: view == ItemViews.Tasks ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black }]}>
                        <Text style={{ fontWeight: `bold` }}>
                            {ItemViews.Tasks}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Comments)} style={[boardStyles.rowItem, { height: `100%`, flexBasis: `32.5%`, backgroundColor: view == ItemViews.Comments ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black }]}>
                        <Text style={{ fontWeight: `bold` }}>
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
                    <View id={`itemTitle_${selected.id}`} style={{ ...boardStyles.cardRight, height: `100%`, minHeight: `100%`, maxHeight: `100%`, gap: 0, paddingVertical: 0, alignItems: `center`, justifyContent: `center`, backgroundColor: colors.transparent, }}>
                        <ForwardRefInput
                            value={name}
                            multiline={true}
                            showLabel={false}
                            placeholder={`Name`}
                            onDoneDismiss={true}
                            onChangeText={setName}
                            maxLength={maxItemNameLength}
                            extraStyle={{ backgroundColor: colors.transparent, }}
                            placeholderTextColor={name == `` ? colors.black : placeHolderColor}
                            onDone={(isValid(name) && name != selected?.name) ? () => onNameSave() : null}
                            style={{ 
                                ...itemFontStyles, 
                                ...styles.itemInput, 
                                fontSize: 21, 
                                maxHeight: 30, 
                                minHeight: 30, 
                                backgroundColor: colors.transparent,
                                fontStyle: name == `` ? `italic` : `normal`,
                            }}
                        />
                        <ForwardRefInput
                            value={summary}
                            multiline={true}
                            showLabel={false}
                            numberOfLines={5}
                            onDoneDismiss={true}
                            placeholder={`Summary`}
                            onChangeText={setSummary}
                            maxLength={maxItemSummaryLength}
                            extraStyle={{ backgroundColor: colors.transparent, }}
                            placeholderTextColor={summary == `` ? colors.black : placeHolderColor}
                            onDone={(typeof summary == `string` && summary != selected?.summary) ? () => onSummarySave() : null}
                            style={{ 
                                ...itemFontStyles, 
                                ...styles.itemInput, 
                                fontSize: summary == `` ? 12 : 17, 
                                backgroundColor: colors.transparent,
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
                        enabled={!editing}
                        nestedScrollEnabled={!editing}
                        keyboardShouldPersistTaps={`handled`}
                        style={{ flex: 1, width: `100%`, backgroundColor: `transparent`, marginVertical: selected?.image ? 15 : 0 }}
                        scrollEnabled={!editing && (scrollingDetailsEnabled() ? description.length >= 420 : description.length >= 620)} 
                    >
                        <ForwardRefInput
                            multiline={true}
                            showLabel={false}
                            numberOfLines={15}
                            value={description}
                            onDoneVibrate={true}
                            onDoneDismiss={true}
                            placeholder={`Description`}
                            onChangeText={setDescription}
                            onBlur={() => setEditing(false)}
                            onFocus={() => setEditing(true)}
                            maxLength={maxItemDescriptionLength}
                            placeholderTextColor={description == `` ? colors.black : placeHolderColor}
                            onDone={(typeof description == `string` && description != selected?.description) ? () => onDescriptionSave() : null}
                            style={{ 
                                ...itemFontStyles, 
                                ...styles.itemInput,
                                fontStyle: description == `` ? `italic` : `normal`,
                                fontSize: description == `` ? 12 : 16, 
                                minHeight: maxItemDescriptionHeight, 
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