import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

// Native re-creation of the CSS `confFall` confetti — pieces fall + spin on loop.
const COLORS = ['#FFCE3A', '#39C75A', '#F2554F', '#ffffff', '#9B6BFF', '#36C5F0'];

function Piece({ left, color, size, delay, duration, height }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const run = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    run.start();
    return () => run.stop();
  }, []);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [-20, height + 40] });
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '560deg'] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left,
        width: size,
        height: size * 1.6,
        backgroundColor: color,
        borderRadius: 2,
        opacity: 0.92,
        transform: [{ translateY }, { rotate }],
      }}
    />
  );
}

export function Confetti({ width, height, count = 70 }) {
  const pieces = useRef(
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * width,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 7,
      delay: Math.random() * 1300,
      duration: 2300 + Math.random() * 2100,
    }))
  ).current;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map(({ id, ...p }) => (
        <Piece key={id} {...p} height={height} />
      ))}
    </View>
  );
}
