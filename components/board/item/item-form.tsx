import { SharedContext } from '@/shared/shared';
import React, { useContext, useState } from 'react';
import { ColumnType, ItemType } from '@/shared/types/types';
import { combineArraysByKey, devEnv, log } from '@/shared/variables';
import CustomTextInput from '@/components/custom-input/custom-input';
import { borderRadius, colors, randomCardColor, Text } from '@/components/theme/Themed';
import { View, StyleSheet, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';

export default function ItemForm({ }: any) {
    let { selected, closeBottomSheet, carouselData, setCarouselData } = useContext<any>(SharedContext);

    const [formError, setFormError] = useState(true);
    const [form, setForm] = useState({
        name: ``,
        image: ``,
        summary: ``,
        description: ``,
    })

    const handleInputChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
        let formError = !form.name || !form.summary;
        setFormError(formError);
        devEnv && console.log(`Form`, form);
    }

    const handleSubmit = () => {
        if (formError) {
            log('Error', 'All fields are required!');
            return;
        }

        const allItems = combineArraysByKey(carouselData, `items`);

        const newItem = new ItemType({
            name: form?.name,
            image: form?.image,
            summary: form?.summary,
            id: allItems?.length + 1,
            key: allItems?.length + 1,
            description: form?.description,
            backgroundColor: randomCardColor(),
        })

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

        closeBottomSheet();
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                {/* <ScrollView contentContainerStyle={styles.container}> */}
                    <View style={styles.container}>
                        <View id={`ItemFormFields`}>
                            <CustomTextInput
                                value={form.name}
                                placeholder={`Name`}
                                onChangeText={(text) => handleInputChange('name', text)}
                            />
                            <CustomTextInput
                                value={form.summary}
                                placeholder={`Summary`}
                                onChangeText={(text) => handleInputChange('summary', text)}
                            />
                            <CustomTextInput
                                value={form.image}
                                placeholder={`Image URL`}
                                onChangeText={(text) => handleInputChange('image', text)}
                            />
                            <CustomTextInput
                                multiline
                                numberOfLines={4}
                                value={form.description}
                                placeholder={`Description`}
                                onChangeText={(text) => handleInputChange('description', text)}
                            />
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={formError}>
                            <Text style={[styles.buttonText, { opacity: formError ? 0.5 : 1 }]}>
                                Save
                            </Text>
                        </TouchableOpacity>
                    </View>
                {/* </ScrollView> */}
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        display: `flex`,
        backgroundColor: colors.black,
        justifyContent: `space-between`,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: `bold`,
    },
    buttonText: { fontSize: 16, textAlign: `center`, fontWeight: `bold` },
    button: { width: `100%`, backgroundColor: colors.appleBlue, paddingVertical: 3, borderRadius: borderRadius - 5, },
})