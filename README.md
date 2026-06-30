# Imposter — Expo (React Native)

A faithful, 100% offline port of the web prototype. No server, no accounts, no
network calls at runtime — the word bank is bundled in `src/wordBank.js`.

---

## 1. Install & run

```bash
# create an empty Expo app if you don't already have one, OR drop these files
# into a fresh project, then install the runtime deps with expo (so versions
# match your installed SDK automatically):

npx expo install expo-linear-gradient expo-haptics expo-font \
  @react-native-async-storage/async-storage \
  @react-native-masked-view/masked-view \
  @expo-google-fonts/fredoka @expo-google-fonts/nunito @expo-google-fonts/luckiest-guy

# then start:
npx expo start
```

Press `i` (iOS simulator), `a` (Android emulator), or scan the QR with Expo Go.

> The included `package.json` is pinned to **Expo SDK 51**. If your environment
> uses a different SDK, run the `npx expo install …` line above and it will
> rewrite the versions to match — don't hand-edit them.

### Packages used
| Package | Why |
|---|---|
| `expo-linear-gradient` | gold buttons, purple background, gradient text fill, outcome cards |
| `expo-haptics` | tactile feedback on reveal / vote / win |
| `expo-font` + `@expo-google-fonts/*` | Fredoka, Nunito, Luckiest Guy (bundled, offline) |
| `@react-native-async-storage/async-storage` | persists settings (replaces `localStorage`) |
| `@react-native-masked-view/masked-view` | gradient-clipped text (replaces `-webkit-background-clip:text`) |

---

## 2. Project structure

```
App.js                      root: fonts, theme, screen router, phone frame, modals
src/
  wordBank.js               bundled word bank + categories + rules (offline data)
  theme.js                  CSS variables → JS theme object; fonts; shade()
  useGame.js                ALL game state + logic (port of the prototype class)
  ui.js                     ChunkyButton, GradientText, Avatar
  components/
    Confetti.js             native confetti (Animated)
    RulesModal.js           "How to Play" bottom sheet
    SettingsModal.js        theme + rules bottom sheet
  screens/
    HomeScreen.js  SetupScreen.js  RevealScreen.js  QuestionsScreen.js
    VotingScreen.js  ResultsScreen.js  ScoreboardScreen.js
assets/
  home-bg.png  pass-bg.png
```

All game state lives in the `useGame()` hook (one object + a class-style
`setState`), exactly mirroring the prototype's single component. Screens are
pure presentational functions that receive `{ game, t }`.

---

## 3. What couldn't translate 1:1 (and what I changed)

- **Hard "3D" button shadows (`box-shadow: 0 7px 0 …`)** — RN has no offset-only
  hard shadow and no `:active` pseudo-class. Recreated with `ChunkyButton`
  (`src/ui.js`): a shadow layer stacked under a face layer that slides down on
  press via the Animated API. Visually identical, including the press-in dip.

- **Gradient-clipped text** (`-webkit-background-clip:text` on names, STANDINGS,
  the secret word) — not supported in RN. Recreated with `GradientText` using
  `MaskedView` + `LinearGradient`.

- **CSS keyframe animations** — rebuilt with the Animated API:
  `confFall`→`Confetti`, the card flip (`rotateY` + `backface-visibility`),
  `ringspin`/`suspense` (results spinner), `floaty` (vote buffer avatar),
  `popIn` (results reveal). `slideUp` is handled by RN `Modal`'s slide
  animation. `glowPulse` was decorative and dropped.

- **`localStorage`** → `@react-native-async-storage/async-storage` (async).
  Same key (`imposter.v2`) and same persisted fields (player count, imposters,
  category, timer, theme, names).

- **CSS gradient strings** (`--purpleGrad`) → arrays of color stops fed to
  `LinearGradient`. CSS variables in general → the `theme.js` object, since RN
  has no `var(--x)`.

- **`flex-direction` default** — RN defaults to `column`; every row in the
  prototype was given an explicit `flexDirection: 'row'`.

- **HTML structure** — `<form>` removed; all interactions are `onPress`. `div`→
  `View`, text→`Text` (every string is inside a `Text`), `button`→`Pressable`,
  `img`→`Image`/`ImageBackground`, `input`→`TextInput`. Inline CSS → `StyleSheet`
  objects (dynamic theme colors are merged inline, which is idiomatic RN).

- **Haptics added** (fits naturally, web prototype had none): light taps on
  steppers / continue, medium on card flip & vote, heavy on the imposter's
  final guess, success notification when scores apply. Silently no-ops on web /
  unsupported devices.

- **Corner "fold" triangles** on the role card are approximated with a single
  triangular border — a tiny cosmetic difference from the CSS double-triangle.

- **`object-position` fine-tuning** on the background images isn't expressible in
  RN; both use `resizeMode="cover"`, which matches closely.

---

## 4. Game integrity preserved

- **Pass-and-play privacy is intact.** Role reveal still has its per-player
  *buffer* screen ("Pass the phone to …") before the card, and the card must be
  manually flipped then hidden — one player never sees another's role. The same
  buffer pattern guards secret voting.
- **The Imposter always gets a guess** at the word (even if they dodged the
  vote), and scoring is byte-for-byte the same as the prototype.
- **No dead ends** — every screen has a clear way forward.
