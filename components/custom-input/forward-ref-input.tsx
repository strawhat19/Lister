import { SharedContext } from '@/shared/shared';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { forwardRef, useContext, useId } from 'react';
import { colors, getFontColor, globalStyles, Text, View } from '../theme/Themed';
import { Keyboard, TextInput, StyleSheet, InputAccessoryView, TouchableOpacity, Vibration } from 'react-native';

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
        onDoneDismiss?: boolean;
        onDoneVibrate?: boolean;
        scrollEnabled?: boolean;
        trim?: boolean;
      }
}

const ForwardRefInput = forwardRef<TextInput, ForwardRefInputProps>(({
    value,
    maxLength,
    placeholder,
    trim = false,
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
    onDoneDismiss = false,
    cancelText = `Cancel`,
    onDoneVibrate = false,
    scrollEnabled = true,
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
    const inputFontColor = { color: getFontColor(selected?.backgroundColor) };

    const trimInput = () => {
        value = value.trim().replace(/\s+/g, ` `);
        onFocus();
    }

    const onDoneVibration = () => {
        onDone();
        Vibration.vibrate(1);
    }

    const onDoneDismissKeyboard = (onDoneVibrate) => {
        if (onDoneVibrate) {
            onDoneVibration();
        } else {
            onDone();
        }
        dismissKeyboard();
    }

    const dismissKeyboard = (saveProgress: boolean = false, onAction = undefined) => {
        if (onAction != undefined) onAction();
        if (saveProgress) onSave();
        Keyboard.dismiss();
        setEditing(false);
    }

    return (
        <View style={{ width, overflow: `hidden`, backgroundColor: colors.transparent, }}>
            {showLabel && (
                <Text style={styles.label}>
                    {placeholder}
                </Text>
            )}
            <View style={{ width: `100%`, display: `flex`, flexDirection: `row`, gap: 5, borderColor: colors.transparent, borderWidth: 0, backgroundColor: colors.transparent, }}>
                <TextInput
                    ref={ref}
                    value={value}
                    onBlur={onBlur}
                    maxLength={maxLength}
                    multiline={multiline}
                    cursorColor={colors.black}
                    onChangeText={onChangeText}
                    scrollEnabled={scrollEnabled}
                    numberOfLines={numberOfLines}
                    placeholder={`Enter ${placeholder}`}
                    inputAccessoryViewID={accessoryViewID}
                    placeholderTextColor={placeholderTextColor}
                    onFocus={trim ? () => trimInput() : onFocus}
                    style={[multiline ? [styles.input, styles.textarea, style, inputFontColor, { width: endIconName == `` ? `100%` : `85%` }, extraStyle] : [styles.input, style, inputFontColor, { width: endIconName == `` ? `100%` : `85%` }, extraStyle], {
                        // borderWidth: 1,
                        // borderColor: colors.white,
                    }]}
                />
                {endIconName != `` ? (
                    <TouchableOpacity disabled={endIconDisabled} style={[styles.endButton, endIconStyle != null ? endIconStyle : {}]} onPress={() => endIconPress()}>
                        <FontAwesome name={endIconName} color={endIconColor} size={endIconSize} style={{ fontWeight: `bold` }} />
                    </TouchableOpacity>
                ) : <></>}
            </View>
            <InputAccessoryView nativeID={accessoryViewID}>
                <View style={styles.accessory}>
                    <TouchableOpacity style={[styles.accessoryButton, { backgroundColor: cancelColor }]} onPress={() => dismissKeyboard(undefined, onCancel)}>
                        <Text style={{ fontSize: 16, fontWeight: `bold`, color: colors.lightFont }}>
                            {cancelText}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={doneDisabled} style={[styles.accessoryButton, { backgroundColor: doneColor }]} onPress={() => onDone != null ? (onDoneDismiss == true ? onDoneDismissKeyboard(onDoneVibrate) : (onDoneVibrate ? onDoneVibration() : onDone())) : dismissKeyboard(true)}>
                        <Text style={{ fontSize: 16, fontWeight: `bold`, color: colors.lightFont, textAlign: `right` }}>
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
        backgroundColor: colors.inputBG,
        borderColor: colors.transparent,
    },
    accessory: {
        gap: 5,
        borderTopWidth: 0,
        fontWeight: `bold`,
        flexDirection: `row`,
        borderBottomWidth: 1,
        backgroundColor: colors.listsBG,
        justifyContent: `space-between`,
    },
    accessoryButton: {
        flex: 1,
        paddingVertical: 7, 
        paddingHorizontal: 20,
    }
})

export default ForwardRefInput;