import React, { useId } from 'react';
import { colors, Text } from '../theme/Themed';
import { View, Button, Keyboard, TextInput, StyleSheet, InputAccessoryView } from 'react-native';

export default function CustomTextInput({
    value,
    maxLength,
    placeholder,
    onChangeText,
    showLabel = true,
    multiline = false,
    onSave = () => {},
    numberOfLines = 1,
    style = { opactiy: 1 },
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
            {showLabel && (
                <Text style={styles.label}>
                    {placeholder}
                </Text>
            )}
            <TextInput
                value={value}
                maxLength={maxLength}
                multiline={multiline}
                cursorColor={colors.black}
                onChangeText={onChangeText}
                numberOfLines={numberOfLines}
                placeholder={`Enter ${placeholder}`}
                inputAccessoryViewID={accessoryViewID}
                style={multiline ? [styles.input, styles.textarea, style] : [styles.input, style]}
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
        height: `auto`,
        textAlignVertical: `top`,
    },
    input: {
        minHeight: 30,
        height: `auto`,
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