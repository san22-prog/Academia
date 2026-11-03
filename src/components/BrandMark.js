import React from 'react';
import { View, Text } from 'react-native';

export default function BrandMark({ small = false, styles }) {
  return (
    <View style={[styles.brandMark, small && styles.brandMarkSmall]}>
      <Text style={[styles.brandMarkText, small && styles.brandMarkTextSmall]}>a.</Text>
    </View>
  );
}
