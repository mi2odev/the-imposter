import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChunkyButton, Avatar } from '../ui';
import { F, shade } from '../theme';
import { DEFAULT_CAT_COLOR, RANDOM_CATEGORY } from '../wordBank';

function Stepper({ game, t }) {
  const { state } = game;
  const arLS = game.lang === 'ar' ? { letterSpacing: 0 } : null;
  const atMin = state.playerCount <= 3;
  const atMax = state.playerCount >= 10;
  return (
    <View style={[styles.stepper, { backgroundColor: t.card, borderColor: t.line }]}>
      <ChunkyButton
        onPress={game.decPlayers}
        bg={t.card2}
        shadowColor="rgba(0,0,0,0.4)"
        depth={4}
        radius={14}
        disabled={atMin}
        contentStyle={{ width: 50, height: 50 }}
      >
        <Text style={{ fontFamily: F.fredoka7, fontSize: 26, color: t.text, marginTop: -2 }}>–</Text>
      </ChunkyButton>

      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontFamily: F.fredoka7, fontSize: 42, color: t.text }}>{state.playerCount}</Text>
        <Text style={[styles.kicker, { color: t.muted }, arLS]}>{game.L.players}</Text>
      </View>

      <ChunkyButton
        onPress={game.incPlayers}
        shadowColor={t.goldSh}
        depth={4}
        radius={14}
        disabled={atMax}
        contentStyle={{ width: 50, height: 50 }}
      >
        <Text style={{ fontFamily: F.fredoka7, fontSize: 26, color: t.goldInk, marginTop: -2 }}>+</Text>
      </ChunkyButton>
    </View>
  );
}

export default function SetupScreen({ game, t }) {
  const { state, L } = game;
  const imp2Locked = state.playerCount < 6;
  // Arabic is cursive — letterSpacing on the all-caps section labels breaks the
  // joins, so zero it out. Latin labels keep their tracking.
  const arLS = game.lang === 'ar' ? { letterSpacing: 0 } : null;
  // Shrink-to-fit guard so long labels (e.g. FR "Désactivé") never overflow the
  // fixed-width chips, in any language.
  const fit = { numberOfLines: 1, adjustsFontSizeToFit: true, minimumFontScale: 0.75 };

  const impStyle = (selected, locked) => {
    if (selected)
      return { wrap: { backgroundColor: t.goldTop }, grad: true, color: t.goldInk, shadow: t.goldSh, opacity: 1, disabled: false };
    return {
      wrap: { backgroundColor: t.card, borderWidth: 1, borderColor: t.line },
      grad: false,
      color: locked ? t.muted : t.text,
      shadow: 'transparent',
      opacity: locked ? 0.5 : 1,
      disabled: locked,
    };
  };
  const imp1 = impStyle(state.imposterCount === 1, false);
  const imp2 = impStyle(state.imposterCount === 2, imp2Locked);

  const timers = [
    { m: 0, label: L.off },
    { m: 1, label: L.minN(1) },
    { m: 2, label: L.minN(2) },
    { m: 3, label: L.minN(3) },
  ];

  const targets = [
    { p: 5, label: L.ptsN(5) },
    { p: 10, label: L.ptsN(10) },
    { p: 15, label: L.ptsN(15) },
    { p: 0, label: L.endless },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Pressable onPress={game.goHome} style={[styles.back, { borderColor: t.line, backgroundColor: t.card2 }]}>
          <Text style={{ color: t.text, fontSize: 22, lineHeight: 24 }}>‹</Text>
        </Pressable>
        <Text style={[styles.title, { color: t.text }]}>{L.gameSetup}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Players */}
        <View>
          <Text style={[styles.label, { color: t.muted }, arLS]}>{L.players}</Text>
          <Stepper game={game} t={t} />
        </View>

        {/* Player names */}
        <View>
          <Text style={[styles.label, { color: t.muted }, arLS]}>{L.playerNames}</Text>
          <View style={{ gap: 9 }}>
            {game.range(state.playerCount).map((i) => (
              <View key={i} style={[styles.nameRow, { backgroundColor: t.card, borderColor: t.line }]}>
                <Avatar color={game.pColor(i)} initial={String(i + 1)} size={36} fontSize={16} />
                <TextInput
                  value={state.names[i]}
                  onChangeText={(v) => game.setName(i, v)}
                  placeholder={L.playerN(i + 1)}
                  placeholderTextColor={t.muted}
                  maxLength={14}
                  style={[styles.input, { color: t.text }]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Imposters */}
        <View>
          <Text style={[styles.label, { color: t.muted }, arLS]}>{L.imposters}</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <ChunkyButton
              onPress={game.setImp1}
              colors={imp1.grad ? [t.goldTop, t.goldBot] : undefined}
              bg={imp1.grad ? undefined : imp1.wrap.backgroundColor}
              shadowColor={imp1.shadow}
              depth={5}
              radius={14}
              style={{ flex: 1, opacity: imp1.opacity }}
              contentStyle={[styles.impFace, !imp1.grad && { borderWidth: 1, borderColor: t.line, borderRadius: 14 }]}
            >
              <Text {...fit} style={{ fontFamily: F.fredoka7, fontSize: 15, color: imp1.color }}>{L.oneImposter}</Text>
            </ChunkyButton>
            <ChunkyButton
              onPress={imp2.disabled ? () => {} : game.setImp2}
              colors={imp2.grad ? [t.goldTop, t.goldBot] : undefined}
              bg={imp2.grad ? undefined : imp2.wrap.backgroundColor}
              shadowColor={imp2.shadow}
              depth={5}
              radius={14}
              style={{ flex: 1, opacity: imp2.opacity }}
              contentStyle={[styles.impFace, !imp2.grad && { borderWidth: 1, borderColor: t.line, borderRadius: 14 }]}
            >
              <Text {...fit} style={{ fontFamily: F.fredoka7, fontSize: 15, color: imp2.color }}>{L.twoImposters}</Text>
            </ChunkyButton>
          </View>
          {imp2Locked && <Text style={[styles.hint, { color: t.muted }]}>{L.imp2Hint}</Text>}
        </View>

        {/* Category */}
        <View>
          <Text style={[styles.label, { color: t.muted }, arLS]}>
            {L.category} <Text style={{ opacity: 0.7 }}>{L.pickOne}</Text>
          </Text>
          <View style={styles.chipWrap}>
            {[RANDOM_CATEGORY, ...game.catList].map((c) => {
              const sel = state.categoryPref === c;
              const col = game.catColors[c] || DEFAULT_CAT_COLOR;
              const label = c === RANDOM_CATEGORY ? '🎲 ' + game.catName(c) : game.catName(c);
              return (
                <Pressable
                  key={c}
                  onPress={() => game.setCategory(c)}
                  style={[
                    styles.chip,
                    sel
                      ? { backgroundColor: col, borderWidth: 2, borderColor: col }
                      : { backgroundColor: t.card, borderWidth: 1, borderColor: t.line },
                    sel && { borderBottomWidth: 4, borderBottomColor: shade(col, -0.34) },
                  ]}
                >
                  <Text style={{ fontFamily: F.nun8, fontSize: 14, color: sel ? '#fff' : t.text }}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Timer */}
        <View>
          <Text style={[styles.label, { color: t.muted }, arLS]}>{L.timer}</Text>
          <View style={{ flexDirection: 'row', gap: 9 }}>
            {timers.map((o) => {
              const sel = o.m === state.timerLen;
              return (
                <Pressable
                  key={o.m}
                  onPress={() => game.setTimer(o.m)}
                  style={[
                    styles.timerChip,
                    sel
                      ? { backgroundColor: t.goldTop, borderBottomWidth: 4, borderBottomColor: t.goldSh }
                      : { backgroundColor: t.card, borderWidth: 1, borderColor: t.line },
                  ]}
                >
                  <Text {...fit} style={{ fontFamily: F.nun8, fontSize: 14, color: sel ? t.goldInk : t.text }}>{o.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Win target */}
        <View>
          <Text style={[styles.label, { color: t.muted }, arLS]}>{L.winAt}</Text>
          <View style={{ flexDirection: 'row', gap: 9 }}>
            {targets.map((o) => {
              const sel = o.p === state.targetScore;
              return (
                <Pressable
                  key={o.p}
                  onPress={() => game.setTarget(o.p)}
                  style={[
                    styles.timerChip,
                    sel
                      ? { backgroundColor: t.goldTop, borderBottomWidth: 4, borderBottomColor: t.goldSh }
                      : { backgroundColor: t.card, borderWidth: 1, borderColor: t.line },
                  ]}
                >
                  <Text {...fit} style={{ fontFamily: F.nun8, fontSize: 14, color: sel ? t.goldInk : t.text }}>{o.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[styles.hint, { color: t.muted }]}>
            {state.targetScore > 0 ? L.winHint(state.targetScore) : L.endlessHint}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: t.line }]}>
        <ChunkyButton onPress={game.startGame} shadowColor={t.goldSh} depth={6} radius={18} contentStyle={{ paddingVertical: 18 }}>
          <Text style={[{ fontFamily: F.lucky, fontSize: 24, letterSpacing: 0.5, color: t.goldInk }, arLS]}>{L.startGame}</Text>
        </ChunkyButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 22, paddingTop: 22, paddingBottom: 6 },
  back: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: F.fredoka7, fontSize: 26 },
  scroll: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 14, gap: 24 },
  label: { fontFamily: F.nun8, fontSize: 12, letterSpacing: 1.5, marginBottom: 10 },
  kicker: { fontFamily: F.nun7, fontSize: 11, letterSpacing: 1 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 },
  input: { flex: 1, fontFamily: F.nun7, fontSize: 17, padding: 0 },
  impFace: { width: '100%', paddingVertical: 16, paddingHorizontal: 8 },
  hint: { fontFamily: F.nun6, fontSize: 12, marginTop: 8, marginHorizontal: 2 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  timerChip: { flex: 1, paddingVertical: 11, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 24, borderTopWidth: 1 },
});
