import { colors } from '../theme/Themed';
import React, { useRef, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { View, Animated, StyleSheet, Easing, ActivityIndicator } from 'react-native';

export default function LoadingSpinner({ spinning = true, color = colors.active, size = 16, activity = false, style = { opacity: 1 } }: any) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation;
    if (spinning) {
      animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      );
      animation.start();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [spinning]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, style]}>
      {activity ? <ActivityIndicator color={colors.white} size={`large`} style={{ height: 55 }} /> : (
        spinning ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <FontAwesome name={`circle-o-notch`} color={color} size={size} />
          </Animated.View>
        ) : null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: `center`,
    justifyContent: `center`,
  },
});