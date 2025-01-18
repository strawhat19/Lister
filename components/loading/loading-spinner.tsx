import { colors } from '../theme/Themed';
import React, { useRef, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { View, Animated, StyleSheet, Easing } from 'react-native';

export default function LoadingSpinner({ spinning = true, color = colors.activeColor, size = 18 }) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation;
    if (spinning) {
      animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000, // Adjust duration for smoothness
          useNativeDriver: true,
          easing: Easing.linear, // Ensure smooth, linear animation
        })
      );
      animation.start();
    } else {
      spinValue.stopAnimation(); // Stop animation if not loading
      spinValue.setValue(0); // Reset animation
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [spinning]);

  // Interpolate the spinValue to create a rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {spinning ? (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <FontAwesome name={`circle-o-notch`} color={color} size={size} />
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});