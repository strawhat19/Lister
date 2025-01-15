import { SharedContext } from '@/shared/shared';
import React, { useContext, useState } from 'react';
import { ColumnType, ItemType, Views } from '@/shared/types/types';
import CustomTextInput from '@/components/custom-input/custom-input';
import { borderRadius, colors, globalStyles, lightColors, randomCardColor, Text, View } from '@/components/theme/Themed';
import { Vibration, StyleSheet, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { combineArraysByKey, genID, log, maxItemDescriptionLength, maxItemNameLength, maxItemSummaryLength, openCamera } from '@/shared/variables';

export default function ItemForm({ }: any) {
    let { selected, editing, setEditing, closeBottomSheet, board, setBoard } = useContext<any>(SharedContext);

    const [formError, setFormError] = useState(true);
    const [form, setForm] = useState({ name: ``, image: ``, summary: ``, description: `` });

    const handleInputChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
        let formError = !form.name || !form.summary;
        setFormError(formError);
    }

    const handleSubmit = () => {
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
                                    onChangeText={(text) => handleInputChange(`name`, text)}
                                />
                                <CustomTextInput
                                    value={form.summary}
                                    placeholder={`Summary`}
                                    maxLength={maxItemSummaryLength}
                                    style={{ ...styles.borderedInput }}
                                    onChangeText={(text) => handleInputChange(`summary`, text)}
                                />
                                <CustomTextInput
                                    value={form.image}
                                    endIconName={`camera`}
                                    placeholder={`Image URL`}
                                    endIconStyle={{ maxWidth: 42 }}
                                    endIconPress={() => openCamera()}
                                    style={{ ...styles.borderedInput }}
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
                            style={{ ...styles.borderedInput, minHeight: 50 }}
                            onChangeText={(text) => handleInputChange(`description`, text)}
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={formError}>
                        <Text style={[styles.buttonText, { opacity: formError ? 0.5 : 1 }]}>
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