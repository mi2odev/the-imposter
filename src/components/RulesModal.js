import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChunkyButton } from '../ui';
import { F, arText } from '../theme';

export default function RulesModal({ game, t }) {
  return (
    <Modal visible={game.state.showRules} transparent animationType="slide" onRequestClose={game.closeRules}>
      <Pressable style={styles.backdrop} onPress={game.closeRules}>
        <Pressable onPress={() => {}} style={{ width: '100%' }}>
          <LinearGradient colors={t.purpleGrad} style={[styles.sheet, { borderTopColor: t.line }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: t.text }]}>{game.L.howToPlay}</Text>
              <Pressable onPress={game.closeRules} style={[styles.close, { borderColor: t.line, backgroundColor: t.card2 }]}>
                <Text style={{ color: t.text, fontSize: 16 }}>✕</Text>
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              <View style={{ gap: 15 }}>
                {game.rules.map((r) => (
                  <View key={r.n} style={styles.ruleRow}>
                    <LinearGradient colors={[t.goldTop, t.goldBot]} style={styles.num}>
                      <Text style={{ fontFamily: F.fredoka7, fontSize: 16, color: t.goldInk }}>{r.n}</Text>
                    </LinearGradient>
                    <Text style={[styles.ruleText, { color: t.text }]}>{r.t}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            <ChunkyButton onPress={game.closeRules} shadowColor={t.goldSh} depth={6} radius={16} contentStyle={{ paddingVertical: 16 }} style={{ marginTop: 22 }}>
              <Text style={[{ fontFamily: F.lucky, fontSize: 18, letterSpacing: 0.5, color: t.goldInk }, arText(game.lang)]}>{game.L.gotIt}</Text>
            </ChunkyButton>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 2, paddingHorizontal: 26, paddingTop: 24, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  title: { fontFamily: F.fredoka7, fontSize: 26 },
  close: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  ruleRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  num: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  ruleText: { flex: 1, fontFamily: F.nun6, fontSize: 15, lineHeight: 22, paddingTop: 5 },
});
