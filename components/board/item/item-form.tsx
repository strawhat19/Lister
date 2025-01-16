import { SharedContext } from '@/shared/shared';
import React, { useContext, useState } from 'react';
import { ColumnType, ItemType, Views } from '@/shared/types/types';
import CustomTextInput from '@/components/custom-input/custom-input';
import { borderRadius, colors, globalStyles, lightColors, randomCardColor, Text, View } from '@/components/theme/Themed';
import { Vibration, StyleSheet, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { combineArraysByKey, genID, log, maxItemDescriptionLength, maxItemNameLength, maxItemSummaryLength, openCamera } from '@/shared/variables';

export const defaultItemForm = { name: ``, image: ``, summary: ``, description: `` };

export default function ItemForm({ }: any) {
    let { selected, editing, setEditing, closeBottomSheet, board, setBoard } = useContext<any>(SharedContext);

    const [formError, setFormError] = useState(true);
    const [form, setForm] = useState(defaultItemForm);

    const handleInputChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
        let validFormValue = (fieldValue) => typeof fieldValue == `string` && fieldValue != `` && fieldValue.length > 0;
        let validName = validFormValue(form.name);
        let validSummary = validFormValue(form.summary);
        let validItemForm = validName && validSummary;
        setFormError(!validItemForm);
    }

    const addItem = () => {
        if (formError) {
            log(`Error`, `All fields are required!`, true);
            return;
        }

        let lastColor = ``;
        let newColor = randomCardColor();
        if (selected?.items && selected?.items?.length > 0) {
            let lastItemColor = selected?.items[selected?.items.length - 1]?.backgroundColor;
            if (lastItemColor) {
                lastColor = lastItemColor;
                if (lastColor) {
                    if (lastColor == newColor) {
                        newColor = randomCardColor(undefined, lastColor);
                    }
                }
            }
        }

        const isLightColor = Object.values(lightColors).includes(newColor);
        const allItems = combineArraysByKey(board, `items`);
        const newIndex = allItems?.length + 1;

        const { id } = genID(Views.Item, newIndex);

        const newItem = new ItemType({
            id,
            tasks: [],
            key: newIndex,
            index: newIndex,
            type: Views.Item,
            name: form?.name,
            image: form?.image,
            summary: form?.summary,
            backgroundColor: newColor,
            description: form?.description,
            listID: selected?.listID || selected?.id,
            ...(isLightColor && {
                fontColor: colors.dark,
            }),
        } as ItemType)

        const updatedBoardData = board.map((list: ColumnType) => {
            if (list.id === selected?.listID) {
                return { 
                    ...list, 
                    items: [
                        ...list.items, 
                        newItem,
                    ]
                };
            }
            return list;
        });

        setBoard(updatedBoardData);
        Vibration.vibrate(1);

        closeBottomSheet();
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === `ios` ? `padding` : `height`}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View id={`ItemFormFields`} style={styles.formFields}>
                        {!editing || (editing && form?.description?.length < 43) ? (
                            <>
                                <CustomTextInput
                                    value={form.name}
                                    placeholder={`Name`}
                                    maxLength={maxItemNameLength}
                                    style={{ ...styles.borderedInput }}
                                    onCancel={() => setForm(defaultItemForm)}
                                    doneText={formError == true ? undefined : `Add`}
                                    onDone={formError == true ? undefined : () => addItem()}
                                    cancelColor={formError == true ? undefined : colors.red}
                                    doneColor={formError == true ? undefined : colors.white}
                                    onChangeText={(text) => handleInputChange(`name`, text)}
                                />
                                <CustomTextInput
                                    value={form.summary}
                                    placeholder={`Summary`}
                                    maxLength={maxItemSummaryLength}
                                    style={{ ...styles.borderedInput }}
                                    onCancel={() => setForm(defaultItemForm)}
                                    doneText={formError == true ? undefined : `Add`}
                                    onDone={formError == true ? undefined : () => addItem()}
                                    cancelColor={formError == true ? undefined : colors.red}
                                    doneColor={formError == true ? undefined : colors.white}
                                    onChangeText={(text) => handleInputChange(`summary`, text)}
                                />
                                <CustomTextInput
                                    value={form.image}
                                    endIconName={`camera`}
                                    placeholder={`Image URL`}
                                    endIconStyle={{ maxWidth: 42 }}
                                    endIconPress={() => openCamera()}
                                    style={{ ...styles.borderedInput }}
                                    onCancel={() => setForm(defaultItemForm)}
                                    doneText={formError == true ? undefined : `Add`}
                                    onDone={formError == true ? undefined : () => addItem()}
                                    cancelColor={formError == true ? undefined : colors.red}
                                    doneColor={formError == true ? undefined : colors.white}
                                    onChangeText={(text) => handleInputChange(`image`, text)}
                                />
                            </>
                        ) : <></>}
                        <CustomTextInput
                            multiline
                            numberOfLines={15}
                            value={form.description}
                            placeholder={`Description`}
                            onFocus={() => setEditing(true)}
                            onBlur={() => setEditing(false)}
                            maxLength={maxItemDescriptionLength}
                            onCancel={() => setForm(defaultItemForm)}
                            doneText={formError == true ? undefined : `Add`}
                            style={{ ...styles.borderedInput, minHeight: 50 }}
                            onDone={formError == true ? undefined : () => addItem()}
                            cancelColor={formError == true ? undefined : colors.red}
                            doneColor={formError == true ? undefined : colors.white}
                            onChangeText={(text) => handleInputChange(`description`, text)}
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={addItem} disabled={formError}>
                        <Text style={[styles.buttonText, { opacity: formError == true ? 0.5 : 1 }]}>
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        display: `flex`,
        maxHeight: `auto`,
        borderRadius: 12,
        overflow: `visible`,
        // borderColor: colors.white,
        backgroundColor: colors.black,
        justifyContent: `space-between`,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        maxHeight: `auto`,
        fontWeight: `bold`,
    },
    formFields: {
        flex: 1,
        borderWidth: 5,
        height: `100%`,
        maxHeight: `auto`,
        overflow: `visible`,
        // borderColor: colors.white,
        backgroundColor: colors.transparent,
    },
    borderedInput: { borderWidth: 1, borderColor: colors.black, },
    buttonText: { fontSize: 16, textAlign: `center`, fontWeight: `bold` },
    button: { width: `100%`, backgroundColor: colors.navy, paddingVertical: 3, borderRadius: borderRadius - 5, },
})