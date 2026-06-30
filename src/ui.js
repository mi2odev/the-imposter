import React, { useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { F, GOLD } from './theme';

/**
 * ChunkyButton — replaces the prototype's `box-shadow: 0 Npx 0 color` "hard drop
 * shadow" buttons that press down on tap. RN has no inset/hard box-shadow, so we
 * stack a shadow layer under a face layer and slide the face down on press.
 *
 * Props:
 *  - onPress
 *  - colors: gradient stops for the face (default gold). Pass solid via `bg`.
 *  - bg: solid face color (overrides colors)
 *  - shadowColor: the hard shadow underneath
 *  - depth: shadow thickness in px
 *  - radius, disabled, style (outer), contentStyle (face padding)
 */
export function ChunkyButton({
  onPress,
  colors = GOLD,
  bg,
  shadowColor,
  depth = 6,
  radius = 16,
  disabled = false,
  style,
  contentStyle,
  children,
}) {
  const press = useRef(new Animated.Value(0)).current;
  const animate = (to) =>
    Animated.timing(press, {
      toValue: to,
      duration: 80,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

  const translateY = press.interpolate({ inputRange: [0, 1], outputRange: [0, Math.max(0, depth - 2)] });

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={() => !disabled && animate(1)}
      onPressOut={() => !disabled && animate(0)}
      style={[{ opacity: disabled ? 0.55 : 1 }, style]}
    >
      <View style={{ paddingBottom: depth }}>
        {/* shadow layer, offset down by `depth` */}
        <View
          style={[
            StyleSheet.absoluteFill,
            { top: depth, borderRadius: radius, backgroundColor: shadowColor || 'rgba(0,0,0,0.4)' },
          ]}
        />
        {/* face */}
        <Animated.View style={{ transform: [{ translateY }], borderRadius: radius, overflow: 'hidden' }}>
          {bg ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: bg }]} />
          ) : (
            <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
          )}
          <View style={[{ alignItems: 'center', justifyContent: 'center' }, contentStyle]}>{children}</View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

/** GradientText — emulates `-webkit-background-clip:text` gold text via MaskedView. */
export function GradientText({ children, style, colors = GOLD, numberOfLines }) {
  return (
    <MaskedView
      maskElement={
        <Text numberOfLines={numberOfLines} style={[style, { backgroundColor: 'transparent' }]}>{children}</Text>
      }
    >
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <Text numberOfLines={numberOfLines} style={[style, { opacity: 0 }]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

/** Colored circular avatar with an initial. */
export function Avatar({ color, initial, size = 42, fontSize = 18, hardShadow = false, style }) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        },
        hardShadow && styles.avatarShadow,
        style,
      ]}
    >
      <Text style={{ fontFamily: F.fredoka7, fontSize, color: '#fff' }}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4,
  },
});
