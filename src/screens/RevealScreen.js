import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChunkyButton, GradientText } from '../ui';
import { F, arText } from '../theme';

const CARD_W = 312;
const CARD_H = 430;

function Buffer({ game, t }) {
  const { state, L } = game;
  const arLS = arText(game.lang);
  const name = game.dName(state.revealIndex);
  return (
    <ImageBackground source={require('../../assets/pass-bg.png')} resizeMode="cover" style={styles.bufferBg}>
      <LinearGradient
        colors={['rgba(20,12,44,0)', 'rgba(11,7,22,0.82)']}
        locations={[0.42, 0.76]}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ alignItems: 'center' }}>
        <Text style={[styles.passCount, arLS]}>{L.playerXofN(state.revealIndex + 1, state.playerCount)}</Text>
        <Text style={[styles.passKicker, arLS]}>{L.passTo}</Text>
        <GradientText style={[styles.bigName, arLS]} colors={[t.goldTop, t.goldBot]}>
          {name}
        </GradientText>
        <Text style={styles.passSub}>{L.passSub}</Text>
        <ChunkyButton onPress={game.readyReveal} shadowColor={t.goldSh} depth={6} radius={16} contentStyle={{ paddingVertical: 18 }} style={{ alignSelf: 'stretch' }}>
          <Text style={[{ fontFamily: F.lucky, fontSize: 20, letterSpacing: 1, color: t.goldInk }, arLS]}>{L.tapWhenReady}</Text>
        </ChunkyButton>
      </View>
    </ImageBackground>
  );
}

function RoleFace({ game, t }) {
  const { state, L } = game;
  const cat = game.catName(state.category).toUpperCase();
  // Arabic letters must stay joined — letterSpacing on a display font breaks the
  // word apart, so zero out tracking for Arabic on every label on the card.
  const arLS = arText(game.lang);
  const isImposter = state.imposterIds.includes(state.revealIndex);
  const colors = isImposter ? [t.impTop, t.impBot] : [t.crewTop, t.crewBot];
  return (
    <LinearGradient colors={colors} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.face}>
      {/* corner fold */}
      <View style={styles.foldLight} />
      {isImposter ? (
        <View style={{ alignItems: 'center', gap: 14 }}>
          <Text style={[styles.faceKicker, arLS]}>{L.categoryColon(cat)}</Text>
          <View style={styles.faceIcon}>
            <Text style={{ fontSize: 50 }}>🕵</Text>
          </View>
          <Text style={[styles.luckyWhite, { fontSize: 20, opacity: 0.95 }, arLS]}>{L.youAreThe}</Text>
          <Text style={[styles.luckyWhite, { fontSize: 50, lineHeight: 48 }, arLS]}>{L.imposterWord}</Text>
          <Text style={styles.faceBody}>{L.imposterBody}</Text>
        </View>
      ) : (
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Text style={[styles.faceKicker, arLS]}>{cat}</Text>
          <Text style={[styles.luckyWhite, { fontSize: 46, lineHeight: 48, textAlign: 'center' }, arLS]}>{state.secretWord}</Text>
          <View style={styles.crewPill}>
            <Text style={{ fontFamily: F.nun8, fontSize: 14, color: '#fff' }}>{L.crewPill}</Text>
          </View>
          <Text style={styles.faceBody}>{L.crewBody}</Text>
        </View>
      )}
    </LinearGradient>
  );
}

function FrontFace({ game, t }) {
  const { L } = game;
  return (
    <View style={[styles.face, { backgroundColor: t.card2, borderWidth: 2, borderColor: t.line, gap: 18 }]}>
      <View style={foldGold(t)} />
      <View style={[styles.qCircle, { backgroundColor: t.card, borderColor: t.line }]}>
        <Text style={{ fontFamily: F.fredoka7, fontSize: 50, color: t.muted }}>?</Text>
      </View>
      <Text style={{ fontFamily: F.fredoka7, fontSize: 24, color: t.text }}>{L.tapToReveal}</Text>
      <Text style={{ fontFamily: F.nun6, fontSize: 14, color: t.muted, textAlign: 'center' }}>{L.onlyYou}</Text>
    </View>
  );
}

function Card({ game, t }) {
  const { state, L } = game;
  const flip = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(flip, {
      toValue: state.cardFlipped ? 1 : 0,
      duration: 600,
      easing: Easing.bezier(0.2, 0.8, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }, [state.cardFlipped]);

  const frontRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  const passLabel = state.revealIndex >= state.playerCount - 1 ? L.startQuestions : L.hideAndPass;

  return (
    <View style={styles.cardScreen}>
      <Text style={[styles.roleKicker, { color: t.muted }, arText(game.lang)]}>{L.roleOf(game.dName(state.revealIndex).toUpperCase())}</Text>

      <Pressable onPress={state.cardFlipped ? undefined : game.flipCard} style={{ width: CARD_W, height: CARD_H }}>
        <Animated.View
          style={[styles.cardSide, { transform: [{ perspective: 1300 }, { rotateY: frontRotate }] }]}
        >
          <FrontFace game={game} t={t} />
        </Animated.View>
        <Animated.View
          style={[styles.cardSide, { transform: [{ perspective: 1300 }, { rotateY: backRotate }] }]}
        >
          <RoleFace game={game} t={t} />
        </Animated.View>
      </Pressable>

      {state.cardFlipped ? (
        <ChunkyButton onPress={game.hideAndPass} shadowColor={t.goldSh} depth={6} radius={16} contentStyle={{ paddingVertical: 17 }} style={{ alignSelf: 'stretch' }}>
          <Text style={[{ fontFamily: F.lucky, fontSize: 19, letterSpacing: 0.5, color: t.goldInk }, arText(game.lang)]}>{passLabel}</Text>
        </ChunkyButton>
      ) : (
        <Text style={{ fontFamily: F.nun6, fontSize: 14, color: t.muted }}>{L.tapCard}</Text>
      )}
    </View>
  );
}

export default function RevealScreen({ game, t }) {
  return game.state.revealPhase === 'buffer' ? <Buffer game={game} t={t} /> : <Card game={game} t={t} />;
}

const foldGold = (t) => ({
  position: 'absolute', top: 0, right: 0, width: 0, height: 0,
  borderStyle: 'solid', borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 46, borderLeftWidth: 46,
  borderBottomColor: t.gold, borderLeftColor: 'transparent', transform: [{ scaleX: -1 }],
});

const styles = StyleSheet.create({
  bufferBg: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 28, paddingBottom: 34, overflow: 'hidden' },
  passCount: { fontFamily: F.nun8, fontSize: 12, letterSpacing: 2, color: '#9C86D6', marginBottom: 6 },
  passKicker: { fontFamily: F.nun8, fontSize: 13, letterSpacing: 2, color: '#CBBBF2' },
  bigName: { fontFamily: F.lucky, fontSize: 44, letterSpacing: 0.5, lineHeight: 50, marginTop: 2, textAlign: 'center' },
  passSub: { fontFamily: F.nun6, fontSize: 15, color: '#CBBBF2', maxWidth: 280, textAlign: 'center', marginTop: 10, marginBottom: 22 },

  cardScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28, paddingVertical: 26, gap: 22 },
  roleKicker: { fontFamily: F.nun8, fontSize: 13, letterSpacing: 2 },
  cardSide: { position: 'absolute', width: CARD_W, height: CARD_H, backfaceVisibility: 'hidden' },
  face: { flex: 1, borderRadius: 26, alignItems: 'center', justifyContent: 'center', padding: 26, overflow: 'hidden' },

  qCircle: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  faceKicker: { fontFamily: F.nun8, fontSize: 12, letterSpacing: 3, color: '#fff', opacity: 0.9, textAlign: 'center' },
  faceIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(0,0,0,0.22)', alignItems: 'center', justifyContent: 'center' },
  luckyWhite: { fontFamily: F.lucky, letterSpacing: 1, color: '#fff', textAlign: 'center' },
  faceBody: { fontFamily: F.nun6, fontSize: 14, color: '#fff', opacity: 0.92, maxWidth: 230, textAlign: 'center', marginTop: 4 },
  crewPill: { marginTop: 8, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.22)' },

  foldLight: {
    position: 'absolute', top: 0, right: 0, width: 0, height: 0,
    borderStyle: 'solid', borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 46, borderLeftWidth: 46,
    borderBottomColor: 'rgba(255,255,255,0.35)', borderLeftColor: 'transparent', transform: [{ scaleX: -1 }],
  },
});
