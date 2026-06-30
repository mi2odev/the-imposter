import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChunkyButton, GradientText, Avatar } from '../ui';
import { F, arText } from '../theme';

function FloatyAvatar({ color, initial }) {
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(y, { toValue: -8, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View style={{ transform: [{ translateY: y }] }}>
      <Avatar color={color} initial={initial} size={96} fontSize={44} hardShadow />
    </Animated.View>
  );
}

function Buffer({ game, t }) {
  const { state, L } = game;
  const arLS = arText(game.lang);
  return (
    <View style={styles.buffer}>
      <FloatyAvatar color={game.pColor(state.voterIndex)} initial={game.dInit(state.voterIndex)} />
      <Text style={[styles.kicker, { color: t.muted }, arLS]}>
        {L.voterXofN(state.voterIndex + 1, state.playerCount)}
      </Text>
      <GradientText style={[styles.bigName, arLS]} colors={[t.goldTop, t.goldBot]}>
        {game.dName(state.voterIndex)}
      </GradientText>
      <Text style={[styles.sub, { color: t.muted }]}>{L.voteSub}</Text>
      <ChunkyButton onPress={game.readyVote} shadowColor={t.goldSh} depth={6} radius={16} contentStyle={{ paddingVertical: 18 }} style={{ alignSelf: 'stretch' }}>
        <Text style={[{ fontFamily: F.lucky, fontSize: 20, letterSpacing: 1, color: t.goldInk }, arLS]}>{L.castVote}</Text>
      </ChunkyButton>
    </View>
  );
}

function Cast({ game, t }) {
  const { state, L } = game;
  const candidates = game.range(state.playerCount).filter((j) => j !== state.voterIndex);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.castHeader}>
        <Text style={[styles.castTitle, { color: t.text }]}>
          {L.whoParts(game.dName(state.voterIndex)).map((p, idx) => (
            <Text key={idx} style={p.gold ? { color: t.gold } : null}>{p.t}</Text>
          ))}
        </Text>
        <Text style={[styles.castSub, { color: t.muted }]}>{L.tapSecret}</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {candidates.map((j) => (
          <ChunkyButton
            key={j}
            onPress={() => game.castVote(j)}
            bg={t.card}
            shadowColor="rgba(0,0,0,0.3)"
            depth={4}
            radius={16}
            contentStyle={[styles.candFace, { borderColor: t.line }]}
          >
            <Avatar color={game.pColor(j)} initial={game.dInit(j)} size={42} fontSize={18} />
            <Text style={{ fontFamily: F.nun8, fontSize: 18, color: t.text }}>{game.dName(j)}</Text>
          </ChunkyButton>
        ))}
      </ScrollView>
    </View>
  );
}

export default function VotingScreen({ game, t }) {
  return game.state.votePhase === 'buffer' ? <Buffer game={game} t={t} /> : <Cast game={game} t={t} />;
}

const styles = StyleSheet.create({
  buffer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28, paddingTop: 40, paddingBottom: 34 },
  kicker: { fontFamily: F.nun8, fontSize: 13, letterSpacing: 2, marginTop: 26 },
  bigName: { fontFamily: F.lucky, fontSize: 42, letterSpacing: 0.5, lineHeight: 46, marginTop: 4, textAlign: 'center' },
  sub: { fontFamily: F.nun6, fontSize: 15, maxWidth: 280, textAlign: 'center', marginTop: 10, marginBottom: 30 },

  castHeader: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 4 },
  castTitle: { fontFamily: F.fredoka7, fontSize: 25 },
  castSub: { fontFamily: F.nun6, fontSize: 14, marginTop: 6 },
  list: { paddingHorizontal: 24, paddingVertical: 14, gap: 10 },
  candFace: { flexDirection: 'row', alignItems: 'center', gap: 14, width: '100%', paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderRadius: 16, justifyContent: 'flex-start' },
});
