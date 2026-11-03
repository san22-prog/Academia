import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function BottomNav({ active, onNavigate, cartCount, styles }) {
  const tabs = [
    { key: 'home', icon: '⌂', label: 'Home' },
    { key: 'cart', icon: '♡', label: 'My bag' },
    { key: 'profile', icon: '☺', label: 'Profile' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <Pressable key={tab.key} onPress={() => onNavigate(tab.key)} style={styles.navItem}>
          <View style={[styles.navIconWrap, active === tab.key && styles.navIconWrapActive]}>
            <Text style={[styles.navIcon, active === tab.key && styles.navIconActive]}>{tab.icon}</Text>
            {tab.key === 'cart' && cartCount > 0 ? <View style={styles.navBadge}><Text style={styles.navBadgeText}>{cartCount}</Text></View> : null}
          </View>
          <Text style={[styles.navLabel, active === tab.key && styles.navLabelActive]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
