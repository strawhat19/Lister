import { BlurView } from 'expo-blur';
import { SharedContext } from '@/shared/shared';
import React, { useRef, useContext } from 'react';
import WheelColorPicker from 'react-native-wheel-color-picker';
import { updateItemFieldsInDatabase } from '@/shared/server/firebase';
import { colors, findColorCodeToKey, getFontColorForBackground, hexToRgba } from '../theme/Themed';
import { View, Modal, TouchableOpacity, Text, StyleSheet, Animated, Vibration } from 'react-native';

export default function ColorPicker() {
  let { selected, selectedColor, setSelectedColor, colorPickerOpen, setColorPickerOpen } = useContext<any>(SharedContext);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const onCancelColorChange = () => {
    setSelectedColor(selected?.backgroundColor);
    togglePicker();
  }

  const onSaveColor = async () => {
    await updateItemFieldsInDatabase(selected?.id, { 
      backgroundColor: selectedColor, 
      color: findColorCodeToKey(selectedColor, colors), 
      // fontColor: getFontColorForBackground(selectedColor),
    });
    Vibration.vibrate(1);
    togglePicker();
  }

  const togglePicker = () => {
    if (colorPickerOpen) {
      // Fade out when closing
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setColorPickerOpen(false));
    } else {
      setColorPickerOpen(true);
      // Fade in when opening
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSelectedColor(selected?.backgroundColor));
    }
  };

  return (
    <View style={[{ backgroundColor: colors.transparent, flex: 1 }]}>
      {/* Selected Color Preview */}
      <TouchableOpacity
        onPress={togglePicker}
        style={[styles.colorPreview, { minHeight: 25, backgroundColor: selectedColor, borderColor: getFontColorForBackground(selectedColor) }]}
      >
        <Text style={[styles.colorText, { color: getFontColorForBackground(selectedColor) }]}>
          {selectedColor}
        </Text>
      </TouchableOpacity>
      {/* Color Picker Modal */}
      <Modal
        transparent={true}
        visible={colorPickerOpen}
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
            intensity={0}
          />
          {/* Modal Content */}
          <View style={[styles.colorPickerContainer, { backgroundColor: colors.transparent }]}>
            {/* <Text style={styles.modalTitle}>
              Select a Color
            </Text> */}

            <View style={{ flex: 1, position: `relative`, top: 25 }}>
              <WheelColorPicker
                row={false}
                noSnap={true}
                thumbSize={35}
                sliderSize={25}
                onColorChange={(hexColor) => setSelectedColor(hexToRgba(hexColor))}
                onColorChangeComplete={(hexColor) => setSelectedColor(hexToRgba(hexColor))}
              />
            </View>

            <TouchableOpacity
              onPress={() => onSaveColor()}
              style={[styles.closeButton, { position: `relative`, bottom: -15, left: 115, backgroundColor: colors.success }]}
            >
              <Text style={[styles.closeButtonText, { fontWeight: `bold` }]}>
                ✓
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onCancelColorChange()}
              style={[styles.closeButton, { position: `relative`, bottom: -115, left: 115, backgroundColor: colors.error }]}
            >
              <Text style={[styles.closeButtonText, { fontWeight: `bold` }]}>
                X
              </Text>
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
    width: `100%`,
    height: `auto`,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
  },
  colorText: {
    fontSize: 12,
    fontWeight: `bold`,
    paddingVertical: 0,
    fontStyle: `italic`,
    paddingHorizontal: 5,
  },
  modalOverlay: {
    flex: 1,
    paddingTop: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.transparent, // Optional: extra dimming
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