import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Switch } from 'react-native';
import { hapticFeedback } from '@/shared/variables';
import { borderRadius, colors, globalStyles, Text, View } from '@/components/theme/Themed';

export default function ColumnSettings({ onText = `On`, offText = `Off` }) {
    const [on, setOn] = useState(true);

    const toggleSwitch = () => {
        setOn(currentlyEnabled => !currentlyEnabled);
        hapticFeedback();
    };

    return (
        <View style={[styles.container, { gap: 15 }]}>
            <View style={{ backgroundColor: colors.active, height: `100%`, borderRadius, ...globalStyles.flexRow, paddingHorizontal: 13 }}>
                <FontAwesome name={`paint-brush`} size={18} color={colors.white} />
            </View>
            <View style={[styles.container, { gap: 15, flex: 1, paddingBottom: 10, justifyContent: `space-between`, borderBottomColor: colors.disabled, borderBottomWidth: 1 }]}>
                <Text style={styles.label}>
                    {on ? onText : offText}
                </Text>
                <Switch
                    value={on}
                    thumbColor={`#f4f3f4`}
                    style={{ marginRight: 0 }}
                    onValueChange={toggleSwitch}
                    ios_backgroundColor={colors.iosBG}
                    trackColor={{ false: `#767577`, true: colors.success }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      ...globalStyles.flexRow,
      gap: 5,
      width: `95%`,
      paddingBottom: 5,
      justifyContent: `space-between`,
      backgroundColor: colors.transparent,
    },
    label: {
      fontSize: 18,
    }
});