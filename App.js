import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import { LuckiestGuy_400Regular } from '@expo-google-fonts/luckiest-guy';

import { useGame } from './src/useGame';
import { getTheme } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import SetupScreen from './src/screens/SetupScreen';
import RevealScreen from './src/screens/RevealScreen';
import QuestionsScreen from './src/screens/QuestionsScreen';
import VotingScreen from './src/screens/VotingScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import ScoreboardScreen from './src/screens/ScoreboardScreen';
import RulesModal from './src/components/RulesModal';
import SettingsModal from './src/components/SettingsModal';

function Screen({ game, t }) {
  const { screen, revealPhase } = game.state;
  switch (screen) {
    case 'home':
      return <HomeScreen game={game} t={t} />;
    case 'setup':
      return <SetupScreen game={game} t={t} />;
    case 'reveal':
      return <RevealScreen game={game} t={t} />;
    case 'questions':
      return <QuestionsScreen game={game} t={t} />;
    case 'voting':
      return <VotingScreen game={game} t={t} />;
    case 'results':
      return <ResultsScreen game={game} t={t} />;
    case 'scoreboard':
      return <ScoreboardScreen game={game} t={t} />;
    default:
      return <HomeScreen game={game} t={t} />;
  }
}

export default function App() {
  const game = useGame();
  const t = getTheme(game.state.theme !== 'light');

  const [fontsLoaded] = useFonts({
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    LuckiestGuy_400Regular,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#160E32' }} />;
  }

  // The home + pass screens own their full-bleed image backgrounds; every other
  // screen sits on the purple gradient (the prototype's --purpleGrad body).
  const onImageScreen = game.state.screen === 'home' || game.state.screen === 'reveal';
  const fullBleed = onImageScreen && (game.state.screen === 'home' || game.state.revealPhase === 'buffer');

  return (
    <View style={[styles.root, { backgroundColor: t.bg2 }]}>
      <StatusBar barStyle={t.dark ? 'light-content' : 'dark-content'} />
      <View style={styles.frame}>
        {fullBleed ? (
          <SafeAreaView style={{ flex: 1 }}>
            <Screen game={game} t={t} />
          </SafeAreaView>
        ) : (
          <LinearGradient colors={t.purpleGrad} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
              <Screen game={game} t={t} />
            </SafeAreaView>
          </LinearGradient>
        )}
        <RulesModal game={game} t={t} />
        <SettingsModal game={game} t={t} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center' },
  // max-width:440px phone column from the prototype (centered on tablets / web).
  frame: { flex: 1, width: '100%', maxWidth: 440, overflow: 'hidden' },
});
