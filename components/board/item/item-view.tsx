import ItemForm from './item-form';
import Subtasks from '../subtasks/subtasks';
import { SharedContext } from '@/shared/shared';
import { defaultTasks } from '@/shared/database';
import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { boardStyles, cardedBorderRight } from '../styles';
import CustomImage from '@/components/custom-image/custom-image';
import CustomTextInput from '@/components/custom-input/custom-input';
import { ItemViewType, SheetComponents, Views } from '@/shared/types/types';
import { colors, globalStyles, Text, View } from '@/components/theme/Themed';
import { Animated, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { maxItemDescriptionLength, maxItemNameLength, maxItemSummaryLength, web } from '@/shared/variables';

export const maxItemDescriptionHeight = 251;

export default function ItemView({ selected,  backgroundColor }: ItemViewType) {
    let { view, setView, editing, setEditing } = useContext<any>(SharedContext);

    const [name, setName] = useState(selected.name);
    const [subtaskName, setSubtaskName] = useState(``);
    const [subtasks, setSubtasks] = useState(defaultTasks);
    const [summary, setSummary] = useState(selected.summary);
    const [description, setDescription] = useState(selected.description);
    const itemFontStyles = { ...(selected.fontColor && { color: selected.fontColor }) };

    const scrollingDetailsEnabled = () => {
        return description && typeof description == `string` && (selected?.image && selected?.image != ``);
    }

    const onTopTogglePress = (viewType: Views) => {
        Vibration.vibrate(1);
        setView(viewType);
    }

    const addTask = () => {
        Vibration.vibrate(1);
        setSubtasks(prevTasks => [...prevTasks, { id: prevTasks.length + 1, name: subtaskName }]);
        setSubtaskName(``);
    }

    return (
        <>
            {selected?.type == SheetComponents.Item ? (
                <View style={{ gap: 0, display: `flex`, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between`, backgroundColor: colors.transparent, width: `100%`, height: 30, marginTop: -15, marginBottom: 10, borderRadius: 8, overflow: `hidden` }}>
                    <TouchableOpacity onPress={() => onTopTogglePress(Views.Details)} style={[boardStyles.rowItem, { height: `100%`, flexBasis: `32.5%`, backgroundColor: view == Views.Details ? colors.appleBlue : colors.black }]}>
                        <Text>
                            {Views.Details}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onTopTogglePress(Views.Subtasks)} style={[boardStyles.rowItem, { height: `100%`, flexBasis: `32.5%`, backgroundColor: view == Views.Subtasks ? colors.appleBlue : colors.black }]}>
                        <Text>
                            {Views.Subtasks}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onTopTogglePress(Views.Comments)} style={[boardStyles.rowItem, { height: `100%`, flexBasis: `32.5%`, backgroundColor: view == Views.Comments ? colors.appleBlue : colors.black }]}>
                        <Text>
                            {Views.Comments}
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

            {selected?.type == SheetComponents.Item ? <>
                {view == Views.Details && (
                    <ScrollView 
                        nestedScrollEnabled={true}
                        id={`itemDetails_${selected.id}`}
                        scrollEnabled={scrollingDetailsEnabled() ? description.length >= 420 : description.length >= 620} 
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
                )}

                {view == Views.Subtasks && <>
                    <View style={{ flex: 1, width: `100%`, maxHeight: 185, borderRadius: 8, overflow: `hidden`, backgroundColor: colors.transparent, marginTop: 12, position: `relative`, }}>
                        {/* <View style={{ width: `100%`, minHeight: 35, backgroundColor: colors.background, ...globalStyles.flexRow, marginBottom: 1 }}>
                            <Text style={{ width: `100%`, color: colors.white, textAlign: `center` }}>
                                Subtasks
                            </Text>
                        </View> */}
                        <Subtasks tasks={[{id: 0, name: `Zero`}, ...subtasks]} />
                    </View>
                    <View style={{ width: `100%`, borderRadius: 8, maxHeight: 35, overflow: `hidden`, backgroundColor: colors.transparent, marginTop: 12, position: `relative`, ...globalStyles.flexRow, gap: 5 }}>
                        <CustomTextInput
                            showLabel={false}
                            value={subtaskName}
                            placeholder={`Name`}
                            onSave={() => addTask()}
                            onChangeText={setSubtaskName}
                            onBlur={() => setEditing(false)}
                            onFocus={() => setEditing(true)}
                            placeholderTextColor={colors.white}
                            style={{ width: `80%`, minHeight: 35, ...globalStyles.flexRow, marginBottom: 0, }}
                        />
                        <TouchableOpacity onPress={() => addTask()} style={{ width: `20%`, minHeight: 35, backgroundColor: colors.black, ...globalStyles.flexRow, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>
                            <Text style={{ width: `100%`, color: colors.white, textAlign: `center` }}>
                                Save
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>}
            </> : <></>}
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