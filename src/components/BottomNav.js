import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, Pressable, Text, View } from 'react-native';

function NavItem({ tab, isActive, onNavigate, cartCount, styles }) {
  const selection = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    const animation = Animated.timing(selection, {
      toValue: isActive ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });
    animation.start();
    return () => animation.stop();
  }, [isActive, selection]);

  const iconScale = selection.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });
  const surfaceScale = selection.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] });

  return (
    <Pressable
      onPress={() => onNavigate(tab.key)}
      style={styles.navItem}
      accessibilityRole="button"
      accessibilityLabel={tab.key === 'cart' && cartCount > 0 ? `${tab.label}, ${cartCount} items` : tab.label}
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.navActiveSurface, { opacity: selection, transform: [{ scale: surfaceScale }] }]}
      />
      <Animated.View style={[styles.navIconWrap, { transform: [{ scale: iconScale }] }]}>
        <Animated.View
          pointerEvents="none"
          style={[styles.navIconActiveSurface, { opacity: selection, transform: [{ scale: iconScale }] }]}
        />
        <Text style={[styles.navIcon, isActive && styles.navIconActive]}>{tab.icon}</Text>
        {tab.key === 'cart' && cartCount > 0 ? <View style={styles.navBadge}><Text style={styles.navBadgeText}>{cartCount > 99 ? '99+' : cartCount}</Text></View> : null}
      </Animated.View>
      <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{tab.label}</Text>
    </Pressable>
  );
}

export default function BottomNav({ active, onNavigate, cartCount, styles }) {
  const tabs = [
    { key: 'home', icon: '⌂', label: 'Home' },
    { key: 'cart', icon: '♡', label: 'My bag' },
    { key: 'profile', icon: '☺', label: 'Profile' },
  ];
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(entrance, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });
    animation.start();
    return () => animation.stop();
  }, [entrance]);

  const entranceOffset = entrance.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <Animated.View style={[styles.bottomNav, { opacity: entrance, transform: [{ translateY: entranceOffset }] }]}>
      {tabs.map((tab) => (
        <NavItem
          key={tab.key}
          tab={tab}
          isActive={active === tab.key}
          onNavigate={onNavigate}
          cartCount={cartCount}
          styles={styles}
        />
      ))}
    </Animated.View>
  );
}
