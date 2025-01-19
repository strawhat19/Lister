import Items from './items';
import { SharedContext } from '@/shared/shared';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { boardStyles, cardedBorderRight } from '../styles';
import React, { useContext, useEffect, useState } from 'react';
import CustomImage from '@/components/custom-image/custom-image';
import { ItemViewType, Views, ItemViews } from '@/shared/types/types';
import { updateItemFieldsInDatabase } from '@/shared/server/firebase';
import ForwardRefInput from '@/components/custom-input/forward-ref-input';
import { Animated, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { borderRadius, colors, getFontColor, globalStyles, Text, View } from '@/components/theme/Themed';
import { isValid, log, maxItemDescriptionLength, maxItemNameLength, maxItemSummaryLength, web } from '@/shared/variables';

export const maxItemDescriptionHeight = 251;

export default function ItemView({ backgroundColor }: ItemViewType) {
    let { selected, items, view, setView, editing, setEditing, setSelected, setActiveTopName } = useContext<any>(SharedContext);

    const [name, setName] = useState(selected?.name);
    const [image, setImage] = useState(selected?.image);
    const [validImage, setValidImage] = useState(false);
    const [summary, setSummary] = useState(selected?.summary);
    const [description, setDescription] = useState(selected?.description);
    const [validSelectedImage, setValidSelectedImage] = useState(isValid(selected?.image));

    const fontColor = getFontColor(selected?.backgroundColor);
    const itemFontStyles = { ...(selected?.fontColor && { color: selected?.fontColor }) };
    const scrollingDetailsEnabled = () => description && typeof description == `string` && (selected?.image && selected?.image != ``);

    useEffect(() => {
        let thisItem;
        if (selected?.type == Views.Item) {
            thisItem = items.find(itm => itm.id == selected?.id);
            if (thisItem) {
                setSelected(thisItem);
                setName(thisItem?.name);
                setImage(thisItem?.image);
                setSummary(thisItem?.summary);
                setDescription(thisItem?.description);
            }
        }
    }, [items, selected])

    const resetImage = () => {
        setValidImage(true);
        setImage(selected?.image);
    }

    const onTopTogglePress = (viewType: ItemViews | Views) => {
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
        if (selected?.type == Views.Item) await updateItemFieldsInDatabase(selected?.id, { name });
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

    const nameInput = () => {
        return <>
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
                placeholderTextColor={name == `` ? colors.black : fontColor}
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
        </>
    }

    return (
        <>
            {!editing ? <>
                {selected?.type == Views.Column && <>
                    <View style={[styles.nameInput, globalStyles.flexRow, { paddingLeft: 20 }]}>
                        <FontAwesome name={`pencil`} size={18} color={colors.white} style={{ position: `relative`, top: -5.7, right: -10 }} />
                        {nameInput()}
                    </View>
                </>}
                <View style={styles.topTabs}>
                    <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Details)} style={[boardStyles.rowItem, styles.topTabButtons, { backgroundColor: view == ItemViews.Details ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black }]}>
                        <FontAwesome name={`align-left`} size={18} color={colors.white} />
                        <Text style={{ fontWeight: `bold` }}>
                            {ItemViews.Details}
                        </Text>
                    </TouchableOpacity>
                    {selected?.type == Views.Column && <>
                        <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Items)} style={[boardStyles.rowItem, styles.topTabButtons, { backgroundColor: view == ItemViews.Items ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black }]}>
                            <FontAwesome name={`list`} size={18} color={colors.white} />
                            <Text style={{ fontWeight: `bold` }}>
                                {ItemViews.Items}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Settings)} style={[boardStyles.rowItem, styles.topTabButtons, { backgroundColor: view == ItemViews.Settings ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black }]}>
                            <FontAwesome name={`gears`} size={18} color={colors.white} />
                            <Text style={{ fontWeight: `bold` }}>
                                {ItemViews.Settings}
                            </Text>
                        </TouchableOpacity>
                    </>}
                    {selected?.type == Views.Item && <>
                        <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Tasks)} style={[boardStyles.rowItem, styles.topTabButtons, { backgroundColor: view == ItemViews.Tasks ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black }]}>
                            <FontAwesome name={`list`} size={18} color={colors.white} />
                            <Text style={{ fontWeight: `bold` }}>
                                {ItemViews.Tasks}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onTopTogglePress(ItemViews.Images)} style={[boardStyles.rowItem, styles.topTabButtons, { backgroundColor: view == ItemViews.Images ? (selected?.backgroundColor == colors.appleBlue ? colors.navy : colors.appleBlue) : colors.black }]}>
                            <FontAwesome name={`image`} size={18} color={colors.white} />
                            <Text style={{ fontWeight: `bold` }}>
                                {ItemViews.Images}
                            </Text>
                        </TouchableOpacity>
                    </>}
                </View>
            </> : <></>}
            <Animated.View 
                id={`sheetCard_${selected?.id}`} 
                style={{ 
                    ...boardStyles.card, 
                    gap: 0,
                    width: `100%`, 
                    alignItems: `center`,
                    paddingTop: selected?.type == Views.Item && isValid(selected?.image) ? 0 : 5,
                    backgroundColor: backgroundColor ? backgroundColor : selected.backgroundColor, 
                    height: (selected?.type == Views.Column || (editing && selected?.type == Views.Item)) ? 0 : (web() ? 500 : isValid(selected?.image) ? 280 : 135), 
                }}
            >
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
                    <View style={{ ...boardStyles.cardRight, height: `100%`, minHeight: `100%`, maxHeight: `100%`, gap: 0, paddingVertical: 0, alignItems: `center`, justifyContent: `center`, backgroundColor: colors.transparent, paddingTop: isValid(selected?.image) ? 60 : 0 }}>
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
                            placeholderTextColor={name == `` ? colors.black : fontColor}
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
                            placeholderTextColor={summary == `` ? colors.black : fontColor}
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

            {selected?.type == Views.Column && <>
                {view == ItemViews.Items && <>
                    <Items />
                </>}
            </>}

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
                            placeholderTextColor={description == `` ? colors.black : fontColor}
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
                    <Items />
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
                                placeholderTextColor={image == `` ? colors.black : fontColor}
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

            {view == ItemViews.Details && <>
                {selected?.type == Views.Column && <View style={{ flex: 1, backgroundColor: colors.transparent }} />}
                <View style={[globalStyles.flexRow, styles.detailsFooter, { gap: 10, paddingBottom: 10, justifyContent: `flex-start`, }]}>
                    <Text style={[styles.detailsFooterText, { color: fontColor }]}>
                        Status
                    </Text>
                    <Text style={[styles.detailsFooterText, { color: fontColor }]}>
                        {selected?.complete ? `Complete` : `Open`}
                    </Text>
                </View>
                <View style={[globalStyles.flexRow, styles.detailsFooter, { gap: 10, paddingBottom: 10, justifyContent: `flex-start`, }]}>
                    <Text style={[styles.detailsFooterText, { color: fontColor }]}>
                        Color
                    </Text>
                    <Text style={[styles.detailsFooterText, { color: fontColor }]}>
                        {selected?.color ?? selected?.backgroundColor}
                    </Text>
                    <Text style={[styles.detailsFooterText, { color: fontColor }]}>
                        {selected?.color ? selected?.backgroundColor : ``}
                    </Text>
                </View>
                {(isValid(selected?.created) || isValid(selected?.updated)) && <>
                    <View style={[globalStyles.flexRow, styles.detailsFooter, { gap: 5, justifyContent: `space-between`, }]}>
                        {isValid(selected?.created) && <Text style={[styles.detailsFooterText, { color: fontColor, fontSize: 10 }]}>
                            Created By Rakib on
                        </Text>}
                        {isValid(selected?.updated) && <Text style={[styles.detailsFooterText, { color: fontColor, fontSize: 10 }]}>
                            Updated By Rakib on
                        </Text>}
                    </View>
                </>}
                {(isValid(selected?.created) || isValid(selected?.updated)) && <>
                    <View style={[globalStyles.flexRow, styles.detailsFooter, { gap: 5, justifyContent: `space-between`, }]}>
                        {isValid(selected?.created) && <Text style={[styles.detailsFooterText, { color: fontColor, fontSize: 10 }]}>
                            {selected?.created}
                        </Text>}
                        {isValid(selected?.updated) && <Text style={[styles.detailsFooterText, { color: fontColor, fontSize: 10 }]}>
                            {selected?.updated}
                        </Text>}
                    </View>
                </>}
            </>}
        </>
    )
}

const styles = StyleSheet.create({
    nameInput: { 
        gap: 10, 
        height: 50,
        width: `100%`,
        marginTop: -20,
        marginBottom: 10,
        overflow: `hidden`,
        justifyContent: `center`, 
        backgroundColor: colors.transparent, 
    },
    topTabs: { 
        gap: 0,
        height: 30,
        width: `100%`,
        marginTop: -15,
        borderRadius: 8,
        display: `flex`,
        marginBottom: 10,
        overflow: `hidden`,
        flexDirection: `row`,
        alignItems: `center`,
        justifyContent: `space-between`,
        backgroundColor: colors.transparent,
    },
    topTabButtons: { 
        gap: 10, 
        height: `100%`, 
        flexBasis: `32.5%`, 
        ...globalStyles.flexRow, 
    },
    borderedInput: { 
        borderWidth: 1, 
        borderColor: colors.listsBG, 
    },
    itemInput: { 
        ...boardStyles.cardTitle, 
        backgroundColor: colors.transparent, 
        borderColor: colors.transparent, 
        padding: 0,
    },
    detailsFooter: {
        top: -15,
        width: `90%`, 
        position: `relative`,
        backgroundColor: colors.transparent,
    },
    detailsFooterText: {
        fontSize: 12,
        fontWeight: `bold`, 
        fontStyle: `italic`, 
    },
})