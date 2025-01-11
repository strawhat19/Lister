import React, { useId } from 'react';
import { colors, Text } from '../theme/Themed';
import { View, Button, Keyboard, TextInput, StyleSheet, InputAccessoryView } from 'react-native';

export default function CustomTextInput({
    value,
    placeholder,
    onChangeText,
    onSave = () => {},
    multiline = false,
    numberOfLines = 1,
}: any) {
    const generatedID = useId();
    const accessoryViewID = `inputAccessoryView-${generatedID}`;

    const dismissKeyboard = (saveProgress: boolean = false) => {
        if (saveProgress) {
            onSave();
        }
        Keyboard.dismiss();
    }

    return (
        <>
            <Text style={styles.label}>
                {placeholder}
            </Text>
            <TextInput
                value={value}
                multiline={multiline}
                onChangeText={onChangeText}
                numberOfLines={numberOfLines}
                placeholder={`Enter ${placeholder}`}
                inputAccessoryViewID={accessoryViewID}
                style={multiline ? [styles.input, styles.textarea] : styles.input}
            />
            <InputAccessoryView nativeID={accessoryViewID}>
                <View style={styles.accessory}>
                    <Button title={`Cancel`} onPress={() => dismissKeyboard()} />
                    <Button title={`Done`} onPress={() => dismissKeyboard(true)} />
                </View>
            </InputAccessoryView>
        </>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: `bold`,
    },
    textarea: {
        height: 80,
        textAlignVertical: `top`,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        color: colors.white,
        paddingHorizontal: 10,
        borderColor: colors.mainBG,
        backgroundColor: colors.black,
    },
    accessory: {
        borderTopWidth: 0,
        fontWeight: `bold`,
        paddingVertical: 3,
        flexDirection: `row`,
        paddingHorizontal: 10,
        backgroundColor: colors.mainBG,
        justifyContent: `space-between`,
    },
})