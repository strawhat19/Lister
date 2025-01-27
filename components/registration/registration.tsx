import Logo from '../theme/logo/logo';
import * as Haptics from 'expo-haptics';
import { useContext, useEffect, useState } from 'react';
import { SharedContext } from '@/shared/shared';
import { FontAwesome } from '@expo/vector-icons';
import { titleRowStyles } from '../board/column/column';
import { appName, genID, itemHeight, log } from '@/shared/variables';
import ForwardRefInput from '../custom-input/forward-ref-input';
import { colors, globalStyles, Text, View } from '../theme/Themed';
import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { User } from '@/shared/models/User';
import { Views } from '@/shared/types/types';

export enum AuthStates {
    SignIn = `Sign In`,
    SignUp = `Sign Up`,
    NoUsers = `No Users`,
    SignedIn = `Signed In`,
    ResetPassword = `Reset Password`,
    ForgotPassword = `Forgot Password`,
}

export default function Registration({ }) {
    const { user, setUser } = useContext<any>(SharedContext);

    let [email, setEmail] = useState(``);
    let [typing, setTyping] = useState(false);
    let [password, setPassword] = useState(``);
    let [showPassword, setShowPassword] = useState(false);

    const onFocus = () => {
        setTyping(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    const onCancel = () => {
        setTyping(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    const onSign = (authState: AuthStates) => {
        let newUsrID = genID(Views.User, 1);
        let usr = new User({ id: newUsrID.id, email, password, name: email, title: newUsrID.title, uuid: newUsrID.uuid, uid: newUsrID.uuid });
        log(`On ${authState}`, usr);
        setUser(usr);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.active }}
            keyboardVerticalOffset={Platform.OS === `ios` ? 0 : 0}
            behavior={Platform.OS === `ios` ? `padding` : `height`}
        >
            <View style={[{ flex: 1, backgroundColor: colors.transparent, justifyContent: `center`, alignItems: `center` }]}>
                <View style={{ gap: typing ? 5 : 55, backgroundColor: colors.transparent, justifyContent: `center`, alignItems: `center` }}>
                    <View style={{ backgroundColor: colors.transparent, justifyContent: `center`, alignItems: `center` }}>
                        <Logo size={150} />
                        <Text style={{ fontSize: 55, fontStyle: `italic`, fontWeight: `bold` }}>
                            {appName}
                        </Text>
                    </View>
                    {user == null && (
                        <View style={{ backgroundColor: colors.transparent, justifyContent: `center`, alignItems: `center` }}>
                            <View style={[globalStyles.singleLineInput, titleRowStyles.addItemButton, { marginTop: 5, justifyContent: `center`, marginHorizontal: `auto` }]}>
                                <ForwardRefInput
                                    gap={0}
                                    value={email}
                                    width={`100%`}
                                    showLabel={true}
                                    onDoneDismiss={true}
                                    onDoneVibrate={true}
                                    autoComplete={`email`}
                                    endIconDisabled={true}
                                    autoCapitalize={`none`}
                                    onChangeText={setEmail}
                                    endIconPress={() => {}}
                                    endIconName={`envelope`}
                                    doneColor={colors.active}
                                    onFocus={() => onFocus()}
                                    onBlur={() => onCancel()}
                                    cancelColor={colors.active}
                                    onCancel={() => onCancel()}
                                    placeholder={`Email Address`}
                                    keyboardType={`email-address`}
                                    textContentType={`emailAddress`}
                                    doneText={email == `` ? `Done` : `Enter`}
                                    onDone={email == `` ? () => {} : () => {}}
                                    cancelText={email == `` ? `Close` : `Cancel`}
                                    endIconColor={email == `` ? colors.disabledFont : colors.inputColor}
                                    extraStyle={{ 
                                        width: `85%`, 
                                        fontWeight: `bold`,
                                        color: colors.inputColor, 
                                        backgroundColor: colors.navy, 
                                        fontStyle: email == `` ? `italic` : `normal`,
                                    }}
                                    style={{ 
                                        marginBottom: 0, 
                                        minHeight: itemHeight, 
                                        ...globalStyles.flexRow, 
                                    }}
                                    endIconStyle={{ 
                                        minHeight: itemHeight, 
                                        maxHeight: itemHeight, 
                                        backgroundColor: colors.navy, 
                                    }}
                                />
                            </View>
                            <View style={[globalStyles.singleLineInput, titleRowStyles.addItemButton, { marginTop: 5, justifyContent: `center`, marginHorizontal: `auto` }]}>
                                <ForwardRefInput
                                    gap={0}
                                    width={`100%`}
                                    endIconSize={23}
                                    value={password}
                                    showLabel={true}
                                    onDoneVibrate={true}
                                    onDoneDismiss={true}
                                    autoCapitalize={`none`}
                                    endIconDisabled={false}
                                    placeholder={`Password`}
                                    autoComplete={`password`}
                                    onFocus={() => onFocus()}
                                    onBlur={() => onCancel()}
                                    doneColor={colors.active}
                                    onChangeText={setPassword}
                                    onCancel={() => onCancel()}
                                    cancelColor={colors.active}
                                    secureTextEntry={!showPassword}
                                    doneText={password == `` ? `Done` : `Enter`}
                                    onDone={password == `` ? () => {} : () => {}}
                                    endIconName={showPassword ? `eye-slash` : `eye`}
                                    cancelText={password == `` ? `Close` : `Cancel`}
                                    endIconPress={() => setShowPassword(!showPassword)}
                                    endIconColor={password == `` ? colors.disabledFont : colors.inputColor}
                                    extraStyle={{ 
                                        width: `85%`, 
                                        fontWeight: `bold`,
                                        color: colors.inputColor, 
                                        backgroundColor: colors.navy, 
                                        fontStyle: password == `` ? `italic` : `normal`,
                                    }}
                                    style={{ 
                                        marginBottom: 0, 
                                        minHeight: itemHeight, 
                                        ...globalStyles.flexRow, 
                                    }}
                                    endIconStyle={{ 
                                        minHeight: itemHeight, 
                                        maxHeight: itemHeight, 
                                        backgroundColor: colors.navy, 
                                    }}
                                />
                            </View>
                            {!typing && (
                                <View style={[globalStyles.flexRow, { paddingHorizontal: 15, backgroundColor: colors.transparent, gap: 15 }]}>
                                    <TouchableOpacity onPress={() => onSign(AuthStates.SignUp)} disabled={email == `` || password == ``} style={[globalStyles.flexRow, { backgroundColor: colors.navy, width: `47.5%`, paddingHorizontal: 10, borderRadius: 5, minHeight: itemHeight - 5, marginTop: 15, justifyContent: `center`, gap: 5 }]}>
                                        <FontAwesome name={`user-plus`} color={(email == `` || password == ``) ? colors.disabled : colors.white} />
                                        <Text style={{ fontSize: 14, fontStyle: `italic`, fontWeight: `bold`, width: `auto`, textAlign: `center`, color: (email == `` || password == ``) ? colors.disabled : colors.white }}>
                                            {AuthStates.SignUp}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onSign(AuthStates.SignIn)} disabled={email == `` || password == ``} style={[globalStyles.flexRow, { backgroundColor: colors.navy, width: `47.5%`, paddingHorizontal: 10, borderRadius: 5, minHeight: itemHeight - 5, marginTop: 15, justifyContent: `center`, gap: 5 }]}>
                                        <FontAwesome name={`user`} color={(email == `` || password == ``) ? colors.disabled : colors.white} />
                                        <Text style={{ fontSize: 14, fontStyle: `italic`, fontWeight: `bold`, width: `auto`, textAlign: `center`, color: (email == `` || password == ``) ? colors.disabled : colors.white }}>
                                            {AuthStates.SignIn}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}