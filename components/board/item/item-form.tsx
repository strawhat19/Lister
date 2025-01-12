import { SharedContext } from '@/shared/shared';
import React, { useContext, useState } from 'react';
import { combineArraysByKey, devEnv, log } from '@/shared/variables';
import CustomTextInput from '@/components/custom-input/custom-input';
import { ColumnType, ItemType, SheetComponents } from '@/shared/types/types';
import { borderRadius, colors, lightColors, randomCardColor, Text } from '@/components/theme/Themed';
import { View, Vibration, StyleSheet, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';

export default function ItemForm({ }: any) {
    let { selected, editing, setEditing, closeBottomSheet, carouselData, setCarouselData } = useContext<any>(SharedContext);

    const [formError, setFormError] = useState(true);
    const [form, setForm] = useState({ name: ``, image: ``, summary: ``, description: ``});

    const handleInputChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
        let formError = !form.name || !form.summary;
        setFormError(formError);
        devEnv && console.log(`Form`, { ...form, desc: form?.description?.length, editing });
    }

    const handleSubmit = () => {
        if (formError) {
            log(`Error`, `All fields are required!`);
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
        const allItems = combineArraysByKey(carouselData, `items`);
        const newIndex = allItems?.length + 1;

        const newItem = new ItemType({
            id: newIndex,
            key: newIndex,
            name: form?.name,
            image: form?.image,
            summary: form?.summary,
            backgroundColor: newColor,
            type: SheetComponents.Item,
            description: form?.description,
            listID: selected?.listID || selected?.id,
            ...(isLightColor && {
                fontColor: colors.darkTabBorder,
            }),
        } as ItemType)

        const updatedCarouselData = carouselData.map((list: ColumnType) => {
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

        setCarouselData(updatedCarouselData);
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
                    <View id={`ItemFormFields`}>
                        {!editing || (editing && form?.description?.length < 43) ? <>
                            <CustomTextInput
                                value={form.name}
                                placeholder={`Name`}
                                onChangeText={(text) => handleInputChange(`name`, text)}
                            />
                            <CustomTextInput
                                value={form.summary}
                                placeholder={`Summary`}
                                onChangeText={(text) => handleInputChange(`summary`, text)}
                            />
                            <CustomTextInput
                                value={form.image}
                                placeholder={`Image URL`}
                                onChangeText={(text) => handleInputChange(`image`, text)}
                            />
                        </> : <></>}
                        <CustomTextInput
                            multiline
                            numberOfLines={4}
                            value={form.description}
                            style={{ minHeight: 80 }}
                            placeholder={`Description`}
                            onFocus={() => setEditing(true)}
                            onBlur={() => setEditing(false)}
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
        borderRadius: 12,
        backgroundColor: colors.black,
        justifyContent: `space-between`,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: `bold`,
    },
    buttonText: { fontSize: 16, textAlign: `center`, fontWeight: `bold` },
    button: { width: `100%`, backgroundColor: colors.navy, paddingVertical: 3, borderRadius: borderRadius - 5, },
})