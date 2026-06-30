import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { F } from '../theme';

// Equal-width segmented button. Fills its row via flex so 2 or 3 options always
// span the full width evenly, and shrinks its label to fit in any language.
function Seg({ label, active, onPress, t, arLS }) {
  const fit = { numberOfLines: 1, adjustsFontSizeToFit: true, minimumFontScale: 0.7 };
  return (
    <Pressable onPress={onPress} style={styles.segWrap}>
      {active ? (
        <LinearGradient colors={[t.goldTop, t.goldBot]} style={styles.seg}>
          <Text {...fit} style={[styles.segText, { color: t.goldInk }, arLS]}>{label}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.seg, { backgroundColor: t.card2, borderWidth: 1, borderColor: t.line }]}>
          <Text {...fit} style={[styles.segText, { color: t.text }, arLS]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function SettingsModal({ game, t }) {
  const { L } = game;
  const dark = game.state.theme !== 'light';
  const arLS = game.lang === 'ar' ? { letterSpacing: 0 } : null;
  return (
    <Modal visible={game.state.showSettings} transparent animationType="slide" onRequestClose={game.closeSettings}>
      <Pressable style={styles.backdrop} onPress={game.closeSettings}>
        <Pressable onPress={() => {}} style={{ width: '100%' }}>
          <LinearGradient colors={t.purpleGrad} style={[styles.sheet, { borderTopColor: t.line }]}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={[styles.title, { color: t.text }]}>{L.settings}</Text>
              <Pressable onPress={game.closeSettings} style={[styles.close, { borderColor: t.line, backgroundColor: t.card2 }]}>
                <Text style={{ color: t.text, fontSize: 16 }}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: t.muted }, arLS]}>{L.theme}</Text>
              <View style={styles.segRow}>
                <Seg label={L.dark} active={dark} onPress={game.setDark} t={t} arLS={arLS} />
                <Seg label={L.light} active={!dark} onPress={game.setLight} t={t} arLS={arLS} />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: t.muted }, arLS]}>{L.language}</Text>
              <View style={styles.segRow}>
                {game.langList.map((code) => (
                  <Seg
                    key={code}
                    label={game.langNames[code]}
                    active={game.lang === code}
                    onPress={() => game.setLang(code)}
                    t={t}
                    arLS={arLS}
                  />
                ))}
              </View>
            </View>

            <Pressable onPress={game.openRulesFromSettings} style={[styles.howto, { backgroundColor: t.card2, borderColor: t.line }]}>
              <Text style={{ fontFamily: F.fredoka7, fontSize: 16, color: t.text }}>{L.howToPlay}</Text>
            </Pressable>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 2, paddingHorizontal: 26, paddingTop: 14, paddingBottom: 32 },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', marginBottom: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  title: { fontFamily: F.fredoka7, fontSize: 26 },
  close: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  field: { marginBottom: 20 },
  label: { fontFamily: F.nun8, fontSize: 12, letterSpacing: 1.5, marginBottom: 10 },
  segRow: { flexDirection: 'row', gap: 8 },
  segWrap: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  seg: { paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  segText: { fontFamily: F.nun8, fontSize: 14 },
  howto: { paddingVertical: 15, borderRadius: 14, borderWidth: 1, alignItems: 'center', marginTop: 4 },
});
