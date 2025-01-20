import React, { useState, useEffect, useRef } from "react";
import WheelColorPicker from "react-native-wheel-color-picker";
import { View, Modal, TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { colors } from "../theme/Themed";

export default function ColorPicker() {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#ff0000"); // Default color
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade animation

  const togglePicker = () => {
    if (isPickerVisible) {
      // Fade out when closing
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setPickerVisible(false));
    } else {
      setPickerVisible(true);
      // Fade in when opening
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      {/* Selected Color Preview */}
      <TouchableOpacity
        style={[styles.colorPreview, { backgroundColor: selectedColor }]}
        onPress={togglePicker}
      >
        <Text style={styles.colorText}>Pick a Color</Text>
      </TouchableOpacity>
      {/* Color Picker Modal */}
      <Modal
        transparent={true}
        visible={isPickerVisible}
        onRequestClose={togglePicker}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            { opacity: fadeAnim }, // Fade animation
          ]}
        >
          {/* Blur Background */}
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={5}
          />
          {/* Modal Content */}
          <View style={styles.colorPickerContainer}>
            <Text style={styles.modalTitle}>Select a Color</Text>

            <WheelColorPicker
              onColorChange={setSelectedColor} // Realtime color change
              onColorChangeComplete={(color) => setSelectedColor(color)} // Final color after selection
              thumbSize={20}
              sliderSize={20}
              noSnap={true}
              row={false}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={togglePicker}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  colorPreview: {
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  colorText: {
    color: "#000",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: extra dimming
  },
  colorPickerContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});