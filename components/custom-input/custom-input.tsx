import { SharedContext } from '@/shared/shared';
import { openCamera } from '@/shared/variables';
import React, { useContext, useId } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors, globalStyles, lightColors, Text } from '../theme/Themed';
import { View, Button, Keyboard, TextInput, StyleSheet, InputAccessoryView, TouchableOpacity } from 'react-native';

export default function CustomTextInput({
    value,
    maxLength,
    placeholder,
    onChangeText,
    endIconName = ``,
    showLabel = true,
    multiline = false,
    numberOfLines = 1,
    onBlur = () => {},
    onSave = () => {},
    onFocus = () => {},
    style = { opactiy: 1 },
    placeholderTextColor = undefined,
}: any) {
    let { selected, setEditing } = useContext<any>(SharedContext);

    const generatedID = useId();
    const accessoryViewID = `inputAccessoryView-${generatedID}`;
    const inputFontColor = { color: Object.values(lightColors).includes(selected?.backgroundColor) ? colors.dark : colors.white };

    const dismissKeyboard = (saveProgress: boolean = false) => {
        if (saveProgress) onSave();
        Keyboard.dismiss();
        setEditing(false);
    }

    return (
        <>
            {showLabel && (
                <Text style={styles.label}>
                    {placeholder}
                </Text>
            )}
            <View style={{ width: `100%`, display: `flex`, flexDirection: `row`, gap: 5, borderColor: colors.transparent, borderWidth: 1, maxHeight: 55 }}>
                <TextInput
                    value={value}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    maxLength={maxLength}
                    multiline={multiline}
                    cursorColor={colors.black}
                    onChangeText={onChangeText}
                    numberOfLines={numberOfLines}
                    placeholder={`Enter ${placeholder}`}
                    inputAccessoryViewID={accessoryViewID}
                    placeholderTextColor={placeholderTextColor}
                    style={multiline ? [styles.input, styles.textarea, style, inputFontColor, { width: endIconName == `` ? `100%` : `90%` }] : [styles.input, style, inputFontColor, { width: endIconName == `` ? `100%` : `90%` }]}
                />
                {endIconName != `` ? (
                    <TouchableOpacity style={styles.cameraButton} onPress={() => openCamera()}>
                        <FontAwesome name={endIconName} color={colors.white} />
                    </TouchableOpacity>
                ) : <></>}
            </View>
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
    cameraButton: { backgroundColor: colors.navy, height: `100%`, width: `100%`, padding: 5, maxWidth: 30, maxHeight: 30, borderRadius: 5, ...globalStyles.flexRow, justifyContent: `center` },
    input: {
        minHeight: 30,
        width: `100%`,
        height: `auto`,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        color: colors.white,
        paddingHorizontal: 10,
        backgroundColor: colors.black,
        borderColor: colors.transparent,
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