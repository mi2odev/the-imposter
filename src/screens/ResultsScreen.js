import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChunkyButton, GradientText, Avatar } from '../ui';
import { Confetti } from '../components/Confetti';
import { F, arText } from '../theme';

function Spinner({ t, label, arLS }) {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }));
    const b = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 550, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 550, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    a.start();
    b.start();
    return () => { a.stop(); b.stop(); };
  }, []);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.13] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  return (
    <LinearGradient colors={t.purpleGrad} style={[StyleSheet.absoluteFill, styles.spinnerWrap]}>
      <Animated.View
        style={[styles.ring, { borderColor: t.line, borderTopColor: t.gold, transform: [{ rotate }] }]}
      />
      <Animated.Text style={[styles.counting, { color: t.text, opacity, transform: [{ scale }] }, arLS]}>
        {label}
      </Animated.Text>
    </LinearGradient>
  );
}

// Spring "pop in" wrapper (replaces CSS popIn).
function PopIn({ delay = 0, children, style }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(v, { toValue: 1, delay, friction: 6, tension: 90, useNativeDriver: true }).start();
  }, []);
  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.74, 1] });
  return <Animated.View style={[{ opacity: v, transform: [{ scale }] }, style]}>{children}</Animated.View>;
}

export default function ResultsScreen({ game, t }) {
  const { state, L } = game;
  const arLS = arText(game.lang);
  const { width, height } = useWindowDimensions();

  const caught = state.accusedId != null && state.imposterIds.includes(state.accusedId);
  const showGuess = state.accusedId != null && !state.resultResolved;
  const showOutcome = state.resultResolved;
  const guesserName = state.imposterIds.length ? game.dName(state.imposterIds[0]) : '';
  const accusedName = state.accusedId != null ? game.dName(state.accusedId) : '';

  let outcomeTitle = '';
  let outcomeSub = '';
  let oColors = [t.crewTop, t.crewBot];
  let oShadow = t.crewSh;
  if (showOutcome) {
    if (state.imposterGuessCorrect) {
      outcomeTitle = L.imposterWins;
      outcomeSub = caught ? L.impWinCaught : L.impWinDodged;
      oColors = [t.impTop, t.impBot];
      oShadow = t.impSh;
    } else {
      outcomeTitle = L.crewWins;
      outcomeSub = caught ? L.crewWinCaught : L.crewWinDodged;
    }
  }

  const showConfetti = showOutcome;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.kicker, { color: t.muted }, arLS]}>{L.mostVotes}</Text>
          <Text style={[styles.accused, { color: t.text }]}>{accusedName}</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.kicker, { color: t.muted }, arLS]}>
            {state.imposterIds.length > 1 ? L.impostersWere : L.imposterWas}
          </Text>
          <View style={styles.impRow}>
            {state.imposterIds.map((i) => (
              <PopIn key={i} style={{ alignItems: 'center', gap: 8 }}>
                <Avatar color={game.pColor(i)} initial={game.dInit(i)} size={72} fontSize={32} hardShadow />
                <Text style={{ fontFamily: F.nun8, fontSize: 15, color: t.text }}>{game.dName(i)}</Text>
              </PopIn>
            ))}
          </View>
        </View>

        <PopIn delay={100} style={[styles.wordCard, { backgroundColor: t.card, borderColor: t.line }]}>
          <Text style={[styles.wordKicker, { color: t.muted }, arLS]}>{L.secretWordCat(game.catName(state.category).toUpperCase())}</Text>
          {showOutcome ? (
            <GradientText style={[styles.word, game.lang === 'ar' && { letterSpacing: 0 }]} colors={[t.goldTop, t.goldBot]}>{state.secretWord}</GradientText>
          ) : (
            <Text style={[styles.word, { color: t.muted }]}>? ? ?</Text>
          )}
        </PopIn>

        {showGuess && (
          <PopIn delay={150} style={{ width: '100%' }}>
            <LinearGradient colors={[t.impTop, t.impBot]} style={styles.guessBox}>
              <Text style={[styles.guessTitle, arLS]}>{L.nameTheWord}</Text>
              <Text style={styles.guessSub}>{L.pickWordSub(guesserName)}</Text>
              <View style={styles.guessGrid}>
                {state.guessChoices.map((w, idx) => (
                  <ChunkyButton
                    key={idx}
                    onPress={() => game.imposterGuess(w)}
                    bg="rgba(255,255,255,0.95)"
                    shadowColor="rgba(0,0,0,0.22)"
                    depth={4}
                    radius={13}
                    style={{ width: '48%' }}
                    contentStyle={{ paddingVertical: 14, paddingHorizontal: 8 }}
                  >
                    <Text style={{ fontFamily: F.fredoka7, fontSize: 16, color: '#1a1424' }}>{w}</Text>
                  </ChunkyButton>
                ))}
              </View>
            </LinearGradient>
          </PopIn>
        )}

        {showOutcome && (
          <PopIn style={{ width: '100%', alignItems: 'center', gap: 16 }}>
            <LinearGradient colors={oColors} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={[styles.outcomeBox, hardShadow(oShadow)]}>
              <Text style={[styles.outcomeKicker, arLS]}>{L.result}</Text>
              <Text style={[styles.outcomeTitle, arLS]}>{outcomeTitle}</Text>
              <Text style={styles.outcomeSub}>{outcomeSub}</Text>
            </LinearGradient>
            <ChunkyButton onPress={game.goScoreboard} shadowColor={t.goldSh} depth={6} radius={18} contentStyle={{ paddingVertical: 18 }} style={{ alignSelf: 'stretch' }}>
              <Text style={[{ fontFamily: F.lucky, fontSize: 22, letterSpacing: 0.5, color: t.goldInk }, arLS]}>{L.viewStandings}</Text>
            </ChunkyButton>
          </PopIn>
        )}
      </ScrollView>

      {showConfetti && <Confetti width={width} height={height} />}
      {state.resultsRevealing && <Spinner t={t} label={L.counting} arLS={arLS} />}
    </View>
  );
}

const hardShadow = (c) => ({ shadowColor: c, shadowOffset: { width: 0, height: 9 }, shadowOpacity: 1, shadowRadius: 0, elevation: 8 });

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 24, paddingVertical: 26, alignItems: 'center', gap: 16 },
  kicker: { fontFamily: F.nun8, fontSize: 13, letterSpacing: 2, textAlign: 'center' },
  accused: { fontFamily: F.fredoka7, fontSize: 26, marginTop: 4 },
  impRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' },

  wordCard: { width: '100%', borderWidth: 1, borderRadius: 20, padding: 18, alignItems: 'center' },
  wordKicker: { fontFamily: F.nun8, fontSize: 11, letterSpacing: 2, textAlign: 'center' },
  word: { fontFamily: F.lucky, fontSize: 36, letterSpacing: 0.5, marginTop: 4, textAlign: 'center' },

  guessBox: { width: '100%', borderRadius: 22, padding: 20 },
  guessTitle: { fontFamily: F.lucky, fontSize: 22, letterSpacing: 0.5, textAlign: 'center', color: '#fff' },
  guessSub: { fontFamily: F.nun7, fontSize: 14, textAlign: 'center', color: '#fff', opacity: 0.95, marginTop: 6, marginBottom: 14 },
  guessGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 9 },

  outcomeBox: { width: '100%', borderRadius: 24, paddingVertical: 28, paddingHorizontal: 22, alignItems: 'center' },
  outcomeKicker: { fontFamily: F.nun8, fontSize: 12, letterSpacing: 3, color: '#fff', opacity: 0.9 },
  outcomeTitle: { fontFamily: F.lucky, fontSize: 44, lineHeight: 44, letterSpacing: 1, color: '#fff', marginTop: 6, textAlign: 'center' },
  outcomeSub: { fontFamily: F.nun7, fontSize: 14, color: '#fff', opacity: 0.96, marginTop: 10, textAlign: 'center' },

  spinnerWrap: { alignItems: 'center', justifyContent: 'center', gap: 24, zIndex: 20 },
  ring: { width: 84, height: 84, borderRadius: 42, borderWidth: 6 },
  counting: { fontFamily: F.lucky, fontSize: 30, letterSpacing: 1 },
});
