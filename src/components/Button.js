import React from 'react';
import { Pressable, Text } from 'react-native';

export default function Button({ title, onPress, variant = 'primary', style, textStyle, disabled = false, styles }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[`button_${variant}`],
        style,
        pressed && !disabled ? { opacity: 0.84, transform: [{ scale: 0.985 }] } : null,
        disabled ? { opacity: 0.45 } : null,
      ]}
    >
      <Text style={[styles.buttonText, styles[`buttonText_${variant}`], textStyle]}>{title}</Text>
    </Pressable>
  );
}
