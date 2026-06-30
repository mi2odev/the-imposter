import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChunkyButton } from '../ui';
import { F, arText } from '../theme';

export default function HomeScreen({ game, t }) {
  return (
    <ImageBackground
      source={require('../../assets/home-bg.png')}
      resizeMode="cover"
      imageStyle={{ resizeMode: 'cover' }}
      style={styles.bg}
    >
      {/* bottom darkening gradient (matches the CSS overlay) */}
      <LinearGradient
        colors={['rgba(20,10,40,0)', 'rgba(9,5,20,0.86)']}
        locations={[0.5, 0.84]}
        style={StyleSheet.absoluteFill}
      />

      {/* invisible settings hit-target, top-right (matches prototype) */}
      <Pressable accessibilityLabel="Settings" onPress={game.openSettings} style={styles.settingsHit} />

      <View style={styles.actions}>
        <ChunkyButton
          onPress={game.goSetup}
          shadowColor={t.goldSh}
          depth={7}
          radius={18}
          contentStyle={{ paddingVertical: 20 }}
        >
          <Text style={[styles.play, arText(game.lang)]}>{game.L.play}</Text>
        </ChunkyButton>

        <ChunkyButton
          onPress={game.openRules}
          bg="rgba(34,23,71,0.85)"
          shadowColor="rgba(0,0,0,0.45)"
          depth={5}
          radius={16}
          contentStyle={{ paddingVertical: 16 }}
          style={{ borderRadius: 16 }}
        >
          <Text style={[styles.howto, arText(game.lang)]}>{game.L.howToPlay}</Text>
        </ChunkyButton>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 26, paddingBottom: 34, overflow: 'hidden' },
  settingsHit: { position: 'absolute', top: '2.4%', right: '4%', width: '15%', aspectRatio: 1 },
  actions: { gap: 14 },
  play: { fontFamily: F.lucky, fontSize: 28, letterSpacing: 1, color: '#2A1B00' },
  howto: {
    fontFamily: F.fredoka7,
    fontSize: 17,
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
});
