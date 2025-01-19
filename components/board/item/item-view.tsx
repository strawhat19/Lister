import ItemForm from './item-form';
import Tasks from '../tasks/tasks';
import { SharedContext } from '@/shared/shared';
import { FontAwesome } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { boardStyles, cardedBorderRight } from '../styles';
import CustomImage from '@/components/custom-image/custom-image';
import { ItemViewType, Views, ItemViews } from '@/shared/types/types';
import { updateItemFieldsInDatabase } from '@/shared/server/firebase';
import ForwardRefInput from '@/components/custom-input/forward-ref-input';
import { Animated, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { borderRadius, colors, globalStyles, isLightColor, Text, View } from '@/components/theme/Themed';
import { isValid, log, maxItemDescriptionLength, maxItemNameLength, maxItemSummaryLength, web } from '@/shared/variables';

export const maxItemDescriptionHeight = 251;

export default function ItemView({ selected, backgroundColor }: ItemViewType) {
    let { view, setView, editing, setEditing, setSelected, setActiveTopName } = useContext<any>(SharedContext);

    const [name, setName] = useState(selected?.name);
    const [image, setImage] = useState(selected?.image);
    const [validImage, setValidImage] = useState(false);
    const [summary, setSummary] = useState(selected?.summary);
    const [description, setDescription] = useState(selected?.description);
    const [validSelectedImage, setValidSelectedImage] = useState(isValid(selected?.image));

    const itemFontStyles = { ...(selected?.fontColor && { color: selected?.fontColor }) };
    const placeHolderColor = isLightColor(selected?.backgroundColor) ? colors.darkFont : colors.lightFont;
    const scrollingDetailsEnabled = () => description && typeof description == `string` && (selected?.image && selected?.image != ``);

    const resetImage = () => {
        setValidImage(true);
        setImage(selected?.image);
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

    const onImageSave = async () => {
        await updateItemFieldsInDatabase(selected?.id, { image });
        await setSelected({ ...selected, image });
    }; 

    const notValidImage = () => {
        setValidImage(false);
        log(`Not Valid Image`);
    }

    return (
        <>
            {(!editing && selected?.type == Views.Item) ? (
                <View style={{ gap: 0, display: `flex`, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between`, backgroundColor: colors.transparent, width: `100%`, height: 30, marginTop: -15, marginBottom: 10, borderRadius: 8, overflow: `hidden` }}>
                    <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Details)} style={[boardStyles.rowItem, { height: `100%`, flexBasis: `32.5%`, backgroundColor: view == ItemViews.Details ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black, ...globalStyles.flexRow, gap: 10 }]}>
                        <FontAwesome name={`align-left`} size={18} color={colors.white} />
                        <Text style={{ fontWeight: `bold` }}>
                            {ItemViews.Details}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Tasks)} style={[boardStyles.rowItem, { height: `100%`, flexBasis: `32.5%`, backgroundColor: view == ItemViews.Tasks ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black, ...globalStyles.flexRow, gap: 10 }]}>
                        <FontAwesome name={`list`} size={18} color={colors.white} />
                        <Text style={{ fontWeight: `bold` }}>
                            {ItemViews.Tasks}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Images)} style={[boardStyles.rowItem, { height: `100%`, flexBasis: `32.5%`, backgroundColor: view == ItemViews.Images ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black, ...globalStyles.flexRow, gap: 10 }]}>
                        <FontAwesome name={`image`} size={18} color={colors.white} />
                        <Text style={{ fontWeight: `bold` }}>
                            {ItemViews.Images}
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
                    paddingTop: selected?.type == Views.Item && isValid(selected?.image) ? 0 : 5,
                    backgroundColor: backgroundColor ? backgroundColor : selected.backgroundColor, 
                    height: (editing && selected?.type == Views.Item) ? 0 : ((web() || selected?.type == Views.ItemForm) ? 500 : isValid(selected?.image) ? 280 : 135), 
                }}
            >
                {selected?.type == Views.ItemForm ? <>
                    <ItemForm />
                </> : <></>}
                {(!editing && selected?.type == Views.Item) ? <>
                    {isValid(selected?.image) ? (
                        <View style={{ ...boardStyles.cardImageContainer, alignItems: `center`, minWidth: validSelectedImage ? `50%` : 0, marginLeft: validSelectedImage ? 0 : -115 }}>
                            <CustomImage 
                                alt={selected.name} 
                                source={{ uri: selected.image }} 
                                onLoad={() => setValidSelectedImage(true)}
                                onError={() => setValidSelectedImage(false)} 
                                style={{ 
                                    ...cardedBorderRight,
                                    ...boardStyles.cardImage, 
                                    ...(web() && { width: `fit-content` }),
                                    minWidth: `100%`,
                                    borderRadius,
                                }} 
                            />
                        </View>
                    ) : <></>}
                    <View id={`itemTitle_${selected.id}`} style={{ ...boardStyles.cardRight, height: `100%`, minHeight: `100%`, maxHeight: `100%`, gap: 0, paddingVertical: 0, alignItems: `center`, justifyContent: `center`, backgroundColor: colors.transparent, paddingTop: isValid(selected?.image) ? 60 : 0 }}>
                        <ForwardRefInput
                            value={name}
                            multiline={true}
                            showLabel={false}
                            numberOfLines={2}
                            placeholder={`Name`}
                            onDoneDismiss={true}
                            scrollEnabled={false}
                            onChangeText={setName}
                            maxLength={maxItemNameLength}
                            onCancel={() => setName(selected?.name)}
                            extraStyle={{ backgroundColor: colors.transparent }}
                            placeholderTextColor={name == `` ? colors.black : placeHolderColor}
                            doneText={(isValid(name) && name != selected?.name) ? `Save` : `Done`}
                            cancelText={(isValid(name) && name != selected?.name) ? `Cancel` : `Close`}
                            cancelColor={(isValid(name) && name != selected?.name) ? colors.error : colors.disabledFont}
                            doneColor={(isValid(name) && name != selected?.name) ? colors.activeColor : colors.disabledFont}
                            onDone={(isValid(name) && name != selected?.name) ? () => onNameSave() : () => setName(selected?.name)}
                            style={{ 
                                ...itemFontStyles, 
                                ...styles.itemInput, 
                                fontSize: 21, 
                                maxHeight: `auto`, 
                                minHeight: `auto`, 
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
                            onCancel={() => setSummary(selected?.summary)}
                            extraStyle={{ backgroundColor: colors.transparent }}
                            placeholderTextColor={summary == `` ? colors.black : placeHolderColor}
                            doneText={(summary != selected?.summary && (isValid(summary) || summary == ``)) ? `Save` : `Done`}
                            cancelText={(summary != selected?.summary && (isValid(summary) || summary == ``)) ? `Cancel` : `Close`}
                            cancelColor={(summary != selected?.summary && (isValid(summary) || summary == ``)) ? colors.error : colors.disabledFont}
                            doneColor={(summary != selected?.summary && (isValid(summary) || summary == ``)) ? colors.activeColor : colors.disabledFont}
                            onDone={(typeof summary == `string` && summary != selected?.summary) ? () => onSummarySave() : () => setSummary(selected?.summary)}
                            style={{ 
                                ...itemFontStyles, 
                                ...styles.itemInput, 
                                fontSize: summary == `` ? 12 : 17, 
                                backgroundColor: colors.transparent,
                                fontStyle: summary == `` ? `italic` : `normal`,
                                minHeight: isValid(selected?.image) ? 215 : 50, 
                            }}
                        />
                    </View>
                </> : <></>}
            </Animated.View>

            {selected?.type == Views.Item ? <>
                {view == ItemViews.Details && (
                    <ScrollView 
                        enabled={!editing}
                        nestedScrollEnabled={!editing}
                        keyboardShouldPersistTaps={`handled`}
                        style={{ flex: 1, width: `100%`, backgroundColor: `transparent`, marginVertical: selected?.image ? 10 : 0 }}
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
                            onCancel={() => setDescription(selected?.description)}
                            placeholderTextColor={description == `` ? colors.black : placeHolderColor}
                            doneText={(description != selected?.description && (isValid(description) || description == ``)) ? `Save` : `Done`}
                            cancelText={(description != selected?.description && (isValid(description) || description == ``)) ? `Cancel` : `Close`}
                            cancelColor={(description != selected?.description && (isValid(description) || description == ``)) ? colors.error : colors.disabledFont}
                            doneColor={(description != selected?.description && (isValid(description) || description == ``)) ? colors.activeColor : colors.disabledFont}
                            onDone={(typeof description == `string` && description != selected?.description) ? () => onDescriptionSave() : () => setDescription(selected?.description)}
                            style={{ 
                                ...itemFontStyles, 
                                ...styles.itemInput,
                                minHeight: maxItemDescriptionHeight, 
                                fontSize: description == `` ? 12 : 16, 
                                fontStyle: description == `` ? `italic` : `normal`,
                            }}
                        />
                    </ScrollView>
                )}

                {view == ItemViews.Tasks && <>
                    <Tasks selected={selected} />
                </>}

                {view == ItemViews.Images && (
                    <View style={[globalStyles.flexRow, { width: `100%`, backgroundColor: colors.transparent }]}>
                        {editing && isValid(image) ? (
                            <View style={{ ...boardStyles.cardImageContainer, alignItems: `center`, minWidth: validImage ? `50%` : 0, marginLeft: validImage ? 0 : -115 }}>
                                <CustomImage 
                                    alt={selected.name} 
                                    source={{ uri: image }}
                                    onLoad={() => setValidImage(true)}
                                    onError={() => notValidImage()} 
                                    style={{ 
                                        ...cardedBorderRight,
                                        ...boardStyles.cardImage, 
                                        ...(web() && { width: `fit-content` }),
                                        minWidth: `100%`,
                                        borderRadius,
                                    }} 
                                />
                            </View>
                        ) : <></>}
                        <ScrollView 
                            enabled={!editing}
                            nestedScrollEnabled={!editing}
                            keyboardShouldPersistTaps={`handled`}
                            scrollEnabled={!editing && (scrollingDetailsEnabled() ? image.length >= 420 : image.length >= 620)} 
                            style={{ flex: 1, width: `100%`, backgroundColor: `transparent`, marginVertical: selected?.image ? 10 : 0 }}
                        >
                            <ForwardRefInput
                                value={image}
                                multiline={true}
                                showLabel={false}
                                numberOfLines={15}
                                onDoneVibrate={true}
                                onDoneDismiss={true}
                                onChangeText={setImage}
                                placeholder={`Image URL`}
                                onCancel={() => resetImage()}
                                onBlur={() => setEditing(false)}
                                onFocus={() => setEditing(true)}
                                placeholderTextColor={image == `` ? colors.black : placeHolderColor}
                                doneText={((isValid(image) && validImage) || (image == `` && image != selected?.image)) ? `Save` : `Done`}
                                cancelText={((isValid(image) && validImage) || (image == `` && image != selected?.image)) ? `Cancel` : `Close`}
                                onDone={((isValid(image) && image != selected?.image && validImage) || image == ``) ? () => onImageSave() : () => resetImage()}
                                cancelColor={((isValid(image) && validImage) || (image == `` && image != selected?.image)) ? colors.error : colors.disabledFont}
                                doneColor={((isValid(image) && validImage) || (image == `` && image != selected?.image)) ? colors.activeColor : colors.disabledFont}
                                style={{ 
                                    ...itemFontStyles, 
                                    ...styles.itemInput,
                                    fontSize: image == `` ? 12 : 16, 
                                    minHeight: maxItemDescriptionHeight, 
                                    fontStyle: image == `` ? `italic` : `normal`,
                                }}
                            />
                        </ScrollView>
                    </View>
                )}
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