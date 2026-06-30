import React from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ChunkyButton, GradientText, Avatar } from '../ui';
import { Confetti } from '../components/Confetti';
import { F, arText } from '../theme';

const MEDALS = ['#FFCE3A', '#C8CDD6', '#D98E4A'];

export default function ScoreboardScreen({ game, t }) {
  const { state, L } = game;
  const arLS = arText(game.lang);
  const { width, height } = useWindowDimensions();
  const matchOver = state.matchOver && state.winnerIds.length > 0;
  const championId = matchOver ? state.winnerIds[0] : null;
  const standings = game
    .range(state.playerCount)
    .map((i) => ({
      i,
      name: game.dName(i),
      color: game.pColor(i),
      initial: game.dInit(i),
      score: state.scores[i] || 0,
      delta: (state.lastDelta && state.lastDelta[i]) || 0,
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        {matchOver ? (
          <>
            <Text style={[styles.kicker, { color: t.muted }, arLS]}>{L.matchWinner(state.round)}</Text>
            <GradientText style={[styles.title, arLS]} colors={[t.goldTop, t.goldBot]} numberOfLines={1}>
              {game.dName(championId)}
            </GradientText>
          </>
        ) : (
          <>
            <Text style={[styles.kicker, { color: t.muted }, arLS]}>{L.afterRound(state.round)}</Text>
            <GradientText style={[styles.title, arLS]} colors={[t.goldTop, t.goldBot]}>{L.standings}</GradientText>
            {state.targetScore > 0 && (
              <Text style={[styles.target, { color: t.muted }, arLS]}>{L.firstToWins(state.targetScore)}</Text>
            )}
          </>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {standings.map((s, idx) => (
          <View
            key={s.i}
            style={[
              styles.row,
              { backgroundColor: t.card, borderColor: idx === 0 ? t.gold : t.line, borderWidth: idx === 0 ? 2 : 1 },
              idx === 0 && { borderBottomWidth: 5, borderBottomColor: t.goldSh },
            ]}
          >
            <Text style={[styles.rank, { color: idx < 3 ? MEDALS[idx] : t.muted }]}>{idx + 1}</Text>
            <Avatar color={s.color} initial={s.initial} size={42} fontSize={18} />
            <Text style={[styles.name, { color: t.text }]} numberOfLines={1}>{s.name}</Text>
            {s.delta > 0 && <Text style={[styles.delta, { color: t.crewTop }]}>+{s.delta}</Text>}
            <Text style={[styles.score, { color: t.text }]}>{s.score}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: t.line }]}>
        {matchOver ? (
          <ChunkyButton onPress={game.newGame} shadowColor={t.goldSh} depth={6} radius={18} contentStyle={{ paddingVertical: 18 }}>
            <Text style={[{ fontFamily: F.lucky, fontSize: 22, letterSpacing: 0.5, color: t.goldInk }, arLS]}>{L.playAgain}</Text>
          </ChunkyButton>
        ) : (
          <>
            <ChunkyButton onPress={game.nextRound} shadowColor={t.goldSh} depth={6} radius={18} contentStyle={{ paddingVertical: 18 }}>
              <Text style={[{ fontFamily: F.lucky, fontSize: 22, letterSpacing: 0.5, color: t.goldInk }, arLS]}>{L.nextRound}</Text>
            </ChunkyButton>
            <ChunkyButton onPress={game.newGame} bg={t.card2} shadowColor="transparent" depth={0} radius={16} contentStyle={[styles.newGameFace, { borderColor: t.line }]}>
              <Text style={{ fontFamily: F.fredoka7, fontSize: 16, color: t.text }}>{L.newGameReset}</Text>
            </ChunkyButton>
          </>
        )}
      </View>

      {matchOver && <Confetti width={width} height={height} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 26, paddingBottom: 4, alignItems: 'center' },
  kicker: { fontFamily: F.nun8, fontSize: 12, letterSpacing: 2 },
  title: { fontFamily: F.lucky, fontSize: 36, letterSpacing: 1, marginTop: 4 },
  target: { fontFamily: F.nun7, fontSize: 12, letterSpacing: 0.5, marginTop: 4 },
  list: { paddingHorizontal: 24, paddingVertical: 16, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 16 },
  rank: { width: 30, textAlign: 'center', fontFamily: F.fredoka7, fontSize: 18 },
  name: { fontFamily: F.nun8, fontSize: 18, flex: 1 },
  delta: { fontFamily: F.nun8, fontSize: 13 },
  score: { fontFamily: F.fredoka7, fontSize: 24, minWidth: 38, textAlign: 'right' },
  footer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24, gap: 10, borderTopWidth: 1 },
  newGameFace: { width: '100%', paddingVertical: 14, borderWidth: 1, borderRadius: 16 },
});
