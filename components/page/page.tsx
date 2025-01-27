import { useEffect, useRef } from 'react';
import { appName } from '@/shared/variables';
import Logo from '@/components/theme/logo/logo';
import { colors, View } from '@/components/theme/Themed';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Animated, Easing, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

export const defaultChildren = {
    space: <View style={{ flex: 1, backgroundColor: colors.transparent }} />,
    loading: <ActivityIndicator color={colors.white} size={`large`} style={{ height: 55 }} />,
}

export class PageProps {
    gap?: number = 5;
    logoSize?: number = 150;
    title?: string = appName;
    topMargin?: number = -100;
    titleFontSize?: number = 55;
    titleColor?: string = colors.white;
    children?: any = defaultChildren.space;
    backgroundColor?: string = colors.active;
}

export default function Page({ 
    gap = 5, 
    logoSize = 150,
    title = appName, 
    topMargin = -100,
    titleFontSize = 55,
    titleColor = colors.white,
    backgroundColor = colors.active, 
    children = defaultChildren.space,
}: PageProps) {
  const insets = useSafeAreaInsets();

  const animatedLogoSize = useRef(new Animated.Value(logoSize)).current;
  const animatedTitleFontSize = useRef(new Animated.Value(titleFontSize)).current;

  useEffect(() => {
    Animated.parallel([
        Animated.timing(animatedLogoSize, {
            duration: 0,
            toValue: logoSize,
            easing: Easing.ease,
            useNativeDriver: false,
        }),
        Animated.timing(animatedTitleFontSize, {
            duration: 150,
            easing: Easing.ease,
            toValue: titleFontSize,
            useNativeDriver: false,
        }),
    ]).start();
  }, [logoSize]);

  return (
    <SafeAreaProvider style={{ ...styles.full, ...styles.centered, backgroundColor }}>
        <SafeAreaView style={{ ...styles.full, ...styles.centered, paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }}>
            <KeyboardAvoidingView behavior={Platform.OS === `ios` ? `padding` : `height`} keyboardVerticalOffset={Platform.OS === `ios` ? 0 : 0}>
                <View style={[{ marginTop: topMargin, backgroundColor: colors.transparent, ...styles.centered }]}>
                    <View style={{ gap, backgroundColor: colors.transparent, ...styles.centered }}>
                        <View style={{ backgroundColor: colors.transparent, ...styles.centered }}>
                            <Animated.View style={{ width: animatedLogoSize, height: animatedLogoSize }}>
                                <Logo size={logoSize} />
                            </Animated.View>
                            <Animated.Text style={{ color: titleColor, fontSize: animatedTitleFontSize, fontStyle: `italic`, fontWeight: `bold` }}>
                                {title}
                            </Animated.Text>
                            {children}
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
    full: {
        flex: 1, 
        width: `100%`, 
        height: `100%`,
    },
    centered: {
        alignItems: `center`,
        justifyContent: `center`, 
    }
})