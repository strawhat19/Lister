import { SharedContext } from '@/shared/shared';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { forwardRef, useContext, useId } from 'react';
import { colors, globalStyles, isLightColor, Text, View } from '../theme/Themed';
import { Keyboard, TextInput, StyleSheet, InputAccessoryView, TouchableOpacity } from 'react-native';

declare global {
    interface ForwardRefInputProps {
        value: string;
        maxLength?: number;
        placeholder?: string;
        onChangeText?: (text: string) => void;
        onDone?: () => void;
        width?: string | number | any;
        onCancel?: () => void;
        endIconSize?: number;
        endIconName?: string | any;
        showLabel?: boolean;
        multiline?: boolean;
        numberOfLines?: number;
        doneText?: string;
        onBlur?: () => void;
        onSave?: () => void;
        onFocus?: () => void;
        endIconStyle?: object | null;
        cancelText?: string;
        style?: object | any;
        endIconPress?: () => void;
        endIconDisabled?: boolean;
        doneDisabled?: boolean;
        extraStyle?: object;
        doneColor?: string;
        cancelColor?: string;
        endIconColor?: string;
        placeholderTextColor?: string;
      }
}

const ForwardRefInput = forwardRef<TextInput, ForwardRefInputProps>(({
    value,
    maxLength,
    placeholder,
    onChangeText,
    onDone = null,
    width = `100%`,
    onCancel = null,
    endIconSize = 18,
    endIconName = ``,
    showLabel = true,
    multiline = false,
    numberOfLines = 1,
    doneText = `Done`,
    onBlur = () => {},
    onSave = () => {},
    onFocus = () => {},
    endIconStyle = null,
    doneDisabled = false,
    cancelText = `Cancel`,
    style = { opactiy: 1 },
    endIconPress = () => {},
    endIconDisabled = false,
    doneColor = colors.disabledFont,
    cancelColor = colors.disabledFont,
    endIconColor = colors.disabledFont,
    placeholderTextColor = colors.disabledFont,
    extraStyle = { backgroundColor: colors.transparent },
}, ref) => {
    let { selected, setEditing } = useContext<any>(SharedContext);

    const generatedID = useId();
    const accessoryViewID = `inputAccessoryView-${generatedID}`;
    const inputFontColor = { color: isLightColor(selected?.backgroundColor) ? colors.dark : colors.white };

    const dismissKeyboard = (saveProgress: boolean = false, onAction = undefined) => {
        if (onAction != undefined) onAction();
        if (saveProgress) onSave();
        Keyboard.dismiss();
        setEditing(false);
    }

    return (
        <View style={{ width, overflow: `hidden` }}>
            {showLabel && (
                <Text style={styles.label}>
                    {placeholder}
                </Text>
            )}
            <View style={{ width: `100%`, display: `flex`, flexDirection: `row`, gap: 5, borderColor: colors.transparent, borderWidth: 0 }}>
                <TextInput
                    ref={ref}
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
                    style={[multiline ? [styles.input, styles.textarea, style, inputFontColor, { width: endIconName == `` ? `100%` : `85%` }, extraStyle] : [styles.input, style, inputFontColor, { width: endIconName == `` ? `100%` : `85%` }, extraStyle], {
                        // borderWidth: 1,
                        // borderColor: colors.white,
                    }]}
                />
                {endIconName != `` ? (
                    <TouchableOpacity disabled={endIconDisabled} style={[styles.endButton, endIconStyle != null ? endIconStyle : {}]} onPress={() => endIconPress()}>
                        <FontAwesome name={endIconName} color={endIconColor} size={endIconSize} />
                    </TouchableOpacity>
                ) : <></>}
            </View>
            <InputAccessoryView nativeID={accessoryViewID}>
                <View style={styles.accessory}>
                    <TouchableOpacity style={{ paddingVertical: 7, paddingHorizontal: 20, flex: 1 }} onPress={() => dismissKeyboard(undefined, onCancel)}>
                        <Text style={{ fontSize: 16, color: cancelColor }}>
                            {cancelText}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={doneDisabled} style={{ paddingVertical: 7, paddingHorizontal: 20, flex: 1 }} onPress={() => onDone != null ? onDone() : dismissKeyboard(true)}>
                        <Text style={{ fontSize: 16, color: doneColor, textAlign: `right` }}>
                            {doneText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </InputAccessoryView>
        </View>
    )
})

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: `bold`,
    },
    textarea: {
        height: `100%`,
        textAlignVertical: `top`,
    },
    endButton: { 
        width: `100%`, 
        maxHeight: 30, 
        height: `100%`, 
        maxWidth: `15%`, 
        borderRadius: 5,
        paddingVertical: 5, 
        paddingHorizontal: 1, 
        ...globalStyles.flexRow, 
        justifyContent: `center`, 
        backgroundColor: colors.navy, 
    },
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
        gap: 5,
        borderTopWidth: 0,
        fontWeight: `bold`,
        flexDirection: `row`,
        backgroundColor: colors.listsBG,
        justifyContent: `space-between`,
    },
})

export default ForwardRefInput;