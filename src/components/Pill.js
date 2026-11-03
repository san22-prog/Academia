import React from 'react';
import { Pressable, Text } from 'react-native';

export default function Pill({ title, active, onPress, styles }) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{title}</Text>
    </Pressable>
  );
}
