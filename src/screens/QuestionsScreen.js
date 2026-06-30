import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChunkyButton, Avatar } from '../ui';
import { F, arText } from '../theme';

export default function QuestionsScreen({ game, t }) {
  const { state, L } = game;
  const pair = state.qPair || { asker: 0, askee: 1 };
  const askerName = game.dName(pair.asker);
  const askeeName = game.dName(pair.askee);
  const canStop = state.qCount >= 3;

  const hasTimer = state.timerLen > 0;
  const mm = String(Math.floor(state.timerRemaining / 60)).padStart(2, '0');
  const ss = String(state.timerRemaining % 60).padStart(2, '0');
  const timeUp = hasTimer && state.timerRemaining === 0;
  const paused = hasTimer && !state.timerRunning && state.timerRemaining > 0;
  const timerColor = timeUp ? t.impTop : paused ? t.muted : state.timerRemaining <= 10 ? t.impTop : t.gold;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.text }]}>{L.questionRound}</Text>
        {hasTimer && (
          <Pressable
            onPress={game.toggleTimer}
            disabled={timeUp}
            style={[styles.timerPill, { backgroundColor: t.card, borderColor: t.line }]}
          >
            <Text style={{ fontSize: 12, color: timerColor }}>{timeUp ? '⏰' : paused ? '▶' : '⏸'}</Text>
            <Text style={{ fontFamily: F.nun8, fontSize: 16, color: timerColor, fontVariant: ['tabular-nums'] }}>
              {timeUp ? L.timesUp : `${mm}:${ss}`}
            </Text>
          </Pressable>
        )}
      </View>

      <Text style={[styles.sub, { color: t.muted }]}>{L.questionSub(state.qCount)}</Text>

      <View style={styles.center}>
        <View style={[styles.card, { backgroundColor: t.card, borderColor: t.line }]}>
          <View style={styles.pairRow}>
            <View style={{ alignItems: 'center', gap: 6 }}>
              <Avatar color={game.pColor(pair.asker)} initial={game.dInit(pair.asker)} size={64} fontSize={28} hardShadow />
              <Text style={[styles.pairName, { color: t.text }]} numberOfLines={1}>{askerName}</Text>
            </View>
            <Text style={{ fontFamily: F.fredoka7, fontSize: 26, color: t.gold }}>→</Text>
            <View style={{ alignItems: 'center', gap: 6 }}>
              <Avatar color={game.pColor(pair.askee)} initial={game.dInit(pair.askee)} size={64} fontSize={28} hardShadow />
              <Text style={[styles.pairName, { color: t.text }]} numberOfLines={1}>{askeeName}</Text>
            </View>
          </View>
          <Text style={[styles.prompt, { color: t.text }]}>
            {L.askParts(askerName, askeeName).map((p, idx) => (
              <Text key={idx} style={p.gold ? { color: t.gold } : null}>{p.t}</Text>
            ))}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <ChunkyButton onPress={game.continueQuestion} shadowColor={t.goldSh} depth={6} radius={18} contentStyle={{ paddingVertical: 18 }}>
          <Text style={[{ fontFamily: F.lucky, fontSize: 21, letterSpacing: 0.5, color: t.goldInk }, arText(game.lang)]}>{L.continueQ}</Text>
        </ChunkyButton>
        <ChunkyButton
          onPress={canStop ? game.goVoting : () => {}}
          bg={canStop ? t.card2 : 'transparent'}
          shadowColor="transparent"
          depth={0}
          radius={16}
          disabled={!canStop}
          contentStyle={[styles.stopFace, { borderColor: t.line }]}
        >
          <Text style={{ fontFamily: F.fredoka7, fontSize: 16, color: canStop ? t.text : t.muted }}>
            {canStop ? L.stopVote : L.voteLocked}
          </Text>
        </ChunkyButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: F.fredoka7, fontSize: 26 },
  timerPill: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  sub: { fontFamily: F.nun6, fontSize: 14, marginHorizontal: 24, marginTop: 6 },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 10 },
  card: { borderWidth: 1, borderRadius: 26, paddingVertical: 30, paddingHorizontal: 22, alignItems: 'center', gap: 18 },
  pairRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  pairName: { fontFamily: F.nun8, fontSize: 13, maxWidth: 80, textAlign: 'center' },
  prompt: { fontFamily: F.fredoka7, fontSize: 19, lineHeight: 25, textAlign: 'center' },
  footer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24, gap: 10 },
  stopFace: { width: '100%', paddingVertical: 16, borderWidth: 1, borderRadius: 16 },
});
