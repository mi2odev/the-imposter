import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { bank, catList, catColors, catNames, playerColors, RANDOM_CATEGORY } from './wordBank';
import { getStrings, langList, langNames } from './i18n';

const STORE_KEY = 'imposter.v2';

const initialState = {
  screen: 'home',
  theme: 'dark',
  lang: 'en',
  showRules: false,
  showSettings: false,
  playerCount: 4,
  imposterCount: 1,
  categoryPref: 'animals', // category KEY the player picked in setup (may be RANDOM_CATEGORY)
  category: 'animals', // the real category KEY in play this round (resolved each round)
  timerLen: 0,
  targetScore: 10, // points needed to win the match (0 = endless)
  names: Array(10).fill(''),
  scores: Array(10).fill(0),
  round: 1,
  secretWord: '',
  imposterIds: [],
  qPairs: [],
  qIndex: 0,
  revealIndex: 0,
  revealPhase: 'buffer',
  cardFlipped: false,
  qPair: { asker: 0, askee: 1 },
  qCount: 1,
  voterIndex: 0,
  votes: [],
  votePhase: 'buffer',
  accusedId: null,
  resultsRevealing: false,
  guessChoices: [],
  imposterGuessCorrect: null,
  resultResolved: false,
  scored: false,
  lastDelta: [],
  timerRemaining: 0,
  timerRunning: false,
  matchOver: false,
  winnerIds: [],
};

// small helpers (ported from the class)
const range = (n) => [...Array(n).keys()];
const rand = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
};

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

// Round scoring. The vote and the guess are scored independently so good
// detective work AND a clever bluff are always rewarded — no winner-takes-all.
//
//   Vote phase                          Guess phase
//   ----------                          -----------
//   caught  → correct voters +2         guessed right → each Imposter +3
//   evaded  → each Imposter   +2        guessed wrong → each Crew     +1
//
// Per-round maximums: a sharp Crew member can earn 3 (right vote + survive),
// an Imposter who dodges the vote and names the word earns 5.
const POINTS = {
  correctVote: 2, // Crew member who personally voted for an Imposter (when caught)
  evade: 2, // each Imposter when the vote fails to catch any of them
  guess: 3, // each Imposter when they name the secret word
  survive: 1, // each Crew member when the Imposter fails to guess the word
};

// Persisted settings come from disk and may be stale (an old build, a removed
// category, a hand-edited store). Coerce every field back into a valid range so
// a round can never be started from corrupt input (e.g. an unknown category
// would make bank[category] undefined and crash newRound).
function sanitizeSettings(s) {
  const out = {};
  if (typeof s !== 'object' || s === null) return out;

  if ('theme' in s) out.theme = s.theme === 'light' ? 'light' : 'dark';

  if ('lang' in s) out.lang = langList.includes(s.lang) ? s.lang : 'en';

  const pc = clamp(Math.round(Number(s.playerCount)) || 4, 3, 10);
  if ('playerCount' in s) out.playerCount = pc;

  if ('imposterCount' in s) {
    // 2 imposters are only valid for 6+ players.
    out.imposterCount = pc >= 6 && Number(s.imposterCount) === 2 ? 2 : 1;
  }

  // Accept the new `categoryPref` field, falling back to the legacy `category`
  // key from older saves. RANDOM_CATEGORY is a valid choice; anything unknown
  // resets to the first real category.
  const prefRaw = 'categoryPref' in s ? s.categoryPref : s.category;
  if (prefRaw !== undefined) {
    out.categoryPref = catList.includes(prefRaw) || prefRaw === RANDOM_CATEGORY ? prefRaw : catList[0];
  }

  if ('timerLen' in s) out.timerLen = clamp(Math.round(Number(s.timerLen)) || 0, 0, 3);

  if ('targetScore' in s) {
    const ts = Math.round(Number(s.targetScore));
    out.targetScore = [0, 5, 10, 15].includes(ts) ? ts : 10;
  }

  if (Array.isArray(s.names)) {
    const names = Array(10).fill('');
    for (let i = 0; i < 10; i++) names[i] = typeof s.names[i] === 'string' ? s.names[i] : '';
    out.names = names;
  }
  return out;
}

function tap(style = Haptics.ImpactFeedbackStyle.Light) {
  // Haptics is a no-op / silently rejects on web + unsupported devices.
  Haptics.impactAsync(style).catch(() => {});
}
function notify(type = Haptics.NotificationFeedbackType.Success) {
  Haptics.notificationAsync(type).catch(() => {});
}

export function useGame() {
  const [state, setRaw] = useState(initialState);
  const ref = useRef(state);
  ref.current = state;
  const timer = useRef(null);
  const rev = useRef(null);
  // Per-category memory of recently used secret words, so the same word doesn't
  // come up two (or a few) rounds in a row. Lives outside React state on purpose
  // — it's transient and never needs to trigger a re-render or be persisted.
  const recent = useRef({});

  // class-like setState: supports object or updater fn + optional callback that
  // reads the freshly-committed state (via ref).
  const setState = useCallback((patch, cb) => {
    setRaw((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) };
      ref.current = next;
      return next;
    });
    if (cb) setTimeout(cb, 0);
  }, []);

  // -------- persistence (localStorage -> AsyncStorage) --------
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORE_KEY);
        if (raw) {
          const s = JSON.parse(raw);
          if (s) setState(sanitizeSettings(s));
        }
      } catch (e) {}
    })();
    return () => {
      clearInterval(timer.current);
      clearTimeout(rev.current);
    };
  }, [setState]);

  const saveSettings = useCallback(() => {
    const { playerCount, imposterCount, categoryPref, timerLen, targetScore, theme, lang, names } = ref.current;
    AsyncStorage.setItem(
      STORE_KEY,
      JSON.stringify({ playerCount, imposterCount, categoryPref, timerLen, targetScore, theme, lang, names })
    ).catch(() => {});
  }, []);

  // -------- display helpers --------
  const dName = useCallback((i) => {
    const v = (ref.current.names[i] || '').trim();
    return v || getStrings(ref.current.lang).playerN(i + 1);
  }, []);
  const dInit = useCallback((i) => {
    const v = (ref.current.names[i] || '').trim();
    return v ? v.charAt(0).toUpperCase() : String(i + 1);
  }, []);
  const pColor = useCallback((i) => playerColors[i % 10], []);
  // Localized display name for a category key (falls back to English / the key).
  const catName = useCallback((key) => {
    const n = catNames[key];
    return (n && (n[ref.current.lang] || n.en)) || key;
  }, []);

  // -------- settings / overlays --------
  const setDark = () => setState({ theme: 'dark' }, saveSettings);
  const setLight = () => setState({ theme: 'light' }, saveSettings);
  const setLang = (l) => setState({ lang: l }, saveSettings);
  const openRules = () => setState({ showRules: true });
  const closeRules = () => setState({ showRules: false });
  const openSettings = () => setState({ showSettings: true });
  const closeSettings = () => setState({ showSettings: false });
  const openRulesFromSettings = () => setState({ showSettings: false, showRules: true });
  const goHome = () => setState({ screen: 'home' });
  const goSetup = () => setState({ screen: 'setup' });

  // -------- setup --------
  const incPlayers = () => {
    tap();
    setState((s) => ({ playerCount: Math.min(10, s.playerCount + 1) }));
  };
  const decPlayers = () => {
    tap();
    setState((s) => {
      const pc = Math.max(3, s.playerCount - 1);
      return { playerCount: pc, imposterCount: pc < 6 ? 1 : s.imposterCount };
    });
  };
  const setImp1 = () => setState({ imposterCount: 1 });
  const setImp2 = () => setState((s) => (s.playerCount >= 6 ? { imposterCount: 2 } : {}));
  const setCategory = (c) => setState({ categoryPref: c });
  const setTimer = (m) => setState({ timerLen: m });
  const setTarget = (p) => setState({ targetScore: p });
  const setName = (i, v) =>
    setState((s) => {
      const names = s.names.slice();
      names[i] = v;
      return { names };
    });

  // -------- round lifecycle --------
  // Pick a secret word, avoiding ones used in the last few rounds of this
  // category so the game doesn't feel repetitive. Falls back to the full list
  // once everything recent has been exhausted (small categories).
  const pickWord = (cat) => {
    const lang = ref.current.lang;
    const list = (bank[lang] && bank[lang][cat]) || bank.en[cat] || bank.en[catList[0]];
    const memKey = lang + ':' + cat; // recent words are language-specific
    const used = recent.current[memKey] || [];
    const fresh = list.filter((w) => !used.includes(w));
    const pool = fresh.length ? fresh : list;
    const word = rand(pool);
    // Remember up to half the category (capped at 12) to space out repeats.
    const memory = Math.min(12, Math.floor(list.length / 2));
    recent.current[memKey] = [word, ...used.filter((w) => w !== word)].slice(0, memory);
    return word;
  };

  const newRound = () => {
    const s = ref.current;
    // "Surprise Me" rolls a real category fresh each round; otherwise use the pick.
    const cat = s.categoryPref === RANDOM_CATEGORY ? rand(catList) : s.categoryPref;
    const word = pickWord(cat);
    const ids = shuffle(range(s.playerCount)).slice(0, s.imposterCount);
    const ring = shuffle(range(s.playerCount));
    const qPairs = ring.map((a, k) => ({ asker: a, askee: ring[(k + 1) % s.playerCount] }));
    return { category: cat, secretWord: word, imposterIds: ids, qPairs, qIndex: 0 };
  };

  const resetRoundState = {
    revealIndex: 0,
    revealPhase: 'buffer',
    cardFlipped: false,
    accusedId: null,
    votes: [],
    voterIndex: 0,
    votePhase: 'buffer',
    resultResolved: false,
    imposterGuessCorrect: null,
    guessChoices: [],
    scored: false,
    lastDelta: [],
    matchOver: false,
    winnerIds: [],
  };

  const startGame = () => {
    saveSettings();
    clearInterval(timer.current);
    const r = newRound();
    setState({ ...r, scores: Array(10).fill(0), round: 1, screen: 'reveal', ...resetRoundState });
  };
  const nextRound = () => {
    clearInterval(timer.current);
    const r = newRound();
    setState({ ...r, round: ref.current.round + 1, screen: 'reveal', ...resetRoundState });
  };
  const newGame = () =>
    setState({ screen: 'setup', scores: Array(10).fill(0), round: 1, matchOver: false, winnerIds: [] });

  // -------- reveal (pass-and-play buffer + card) --------
  const readyReveal = () => setState({ revealPhase: 'card', cardFlipped: false });
  const flipCard = () => {
    tap(Haptics.ImpactFeedbackStyle.Medium);
    setState({ cardFlipped: true });
  };
  const hideAndPass = () => {
    const s = ref.current;
    const next = s.revealIndex + 1;
    if (next >= s.playerCount) {
      goQuestions();
    } else {
      setState({ revealIndex: next, revealPhase: 'buffer', cardFlipped: false });
    }
  };

  // -------- questions --------
  const onePair = (pc) => {
    const asker = Math.floor(Math.random() * pc);
    let askee = Math.floor(Math.random() * (pc - 1));
    if (askee >= asker) askee++;
    return { asker, askee };
  };
  const randomPair = () => {
    const pc = ref.current.playerCount;
    const prev = ref.current.qPair;
    // With 3+ players there are always 6+ ordered pairs, so a few retries are
    // enough to avoid showing the same matchup twice in a row.
    let p = onePair(pc);
    for (let i = 0; i < 8 && prev && p.asker === prev.asker && p.askee === prev.askee; i++) {
      p = onePair(pc);
    }
    return p;
  };
  const startTick = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setState((s) => {
        if (!s.timerRunning) return {};
        const r = Math.max(0, s.timerRemaining - 1);
        // Buzz once when the discussion timer hits zero.
        if (r === 0) {
          notify(Haptics.NotificationFeedbackType.Warning);
          clearInterval(timer.current);
        }
        return { timerRemaining: r, timerRunning: r > 0 };
      });
    }, 1000);
  };
  const goQuestions = () => {
    clearInterval(timer.current);
    const t = ref.current.timerLen * 60;
    setState({
      screen: 'questions',
      qPair: randomPair(),
      qCount: 1,
      timerRemaining: t,
      timerRunning: ref.current.timerLen > 0,
    });
    if (ref.current.timerLen > 0) startTick();
  };
  const continueQuestion = () => {
    tap();
    setState((s) => ({ qPair: randomPair(), qCount: s.qCount + 1 }));
  };
  // Pause / resume the discussion timer. The interval keeps ticking but no-ops
  // while paused, so no restart is needed. Only meaningful with time left.
  const toggleTimer = () => {
    const s = ref.current;
    if (s.timerLen <= 0 || s.timerRemaining <= 0) return;
    tap();
    setState({ timerRunning: !s.timerRunning });
  };

  // -------- voting --------
  const goVoting = () => {
    clearInterval(timer.current);
    setState({ screen: 'voting', voterIndex: 0, votes: [], votePhase: 'buffer' });
  };
  const readyVote = () => setState({ votePhase: 'cast' });
  const castVote = (cand) => {
    tap(Haptics.ImpactFeedbackStyle.Medium);
    const s = ref.current;
    const votes = s.votes.slice();
    votes[s.voterIndex] = cand;
    if (s.voterIndex < s.playerCount - 1) {
      setState({ votes, voterIndex: s.voterIndex + 1, votePhase: 'buffer' });
    } else {
      setState({ votes }, tallyReveal);
    }
  };
  const tallyReveal = () => {
    const s = ref.current;
    const counts = {};
    s.votes.forEach((v) => {
      counts[v] = (counts[v] || 0) + 1;
    });
    let max = -1;
    Object.keys(counts).forEach((k) => {
      if (counts[k] > max) max = counts[k];
    });
    const top = Object.keys(counts)
      .filter((k) => counts[k] === max)
      .map(Number);
    const accused = top[Math.floor(Math.random() * top.length)];
    revealResults(accused);
  };
  const revealResults = (accused) => {
    const s = ref.current;
    const pool = (bank[s.lang] && bank[s.lang][s.category]) || bank.en[s.category] || [];
    const others = pool.filter((w) => w !== s.secretWord);
    const choices = shuffle([s.secretWord, ...shuffle(others).slice(0, Math.min(7, others.length))]);
    setState({
      screen: 'results',
      accusedId: accused,
      resultsRevealing: true,
      guessChoices: choices,
      resultResolved: false,
      imposterGuessCorrect: null,
      scored: false,
    });
    clearTimeout(rev.current);
    rev.current = setTimeout(() => setState({ resultsRevealing: false }), 1600);
  };

  // -------- results / scoring --------
  const imposterGuess = (w) => {
    const correct = w === ref.current.secretWord;
    tap(Haptics.ImpactFeedbackStyle.Heavy);
    setState({ imposterGuessCorrect: correct, resultResolved: true }, applyScores);
  };
  const applyScores = () => {
    const s = ref.current;
    if (s.scored) return;
    const n = s.playerCount;
    const isImp = (i) => s.imposterIds.includes(i);
    const caught = s.accusedId != null && isImp(s.accusedId);
    const delta = Array(n).fill(0);

    // Vote phase: did the table catch an Imposter?
    if (caught) {
      s.votes.forEach((cand, voter) => {
        if (!isImp(voter) && isImp(cand)) delta[voter] += POINTS.correctVote;
      });
    } else {
      s.imposterIds.forEach((i) => (delta[i] += POINTS.evade));
    }

    // Guess phase: did the Imposter name the secret word?
    if (s.imposterGuessCorrect) {
      s.imposterIds.forEach((i) => (delta[i] += POINTS.guess));
    } else {
      for (let i = 0; i < n; i++) if (!isImp(i)) delta[i] += POINTS.survive;
    }

    const scores = s.scores.slice();
    for (let i = 0; i < n; i++) scores[i] += delta[i];

    // Match ends when someone reaches the target AND holds it alone — a tie at
    // the top means sudden-death: keep playing until there's a clear leader.
    let matchOver = false;
    let winnerIds = [];
    if (s.targetScore > 0) {
      let top = -Infinity;
      for (let i = 0; i < n; i++) if (scores[i] > top) top = scores[i];
      const leaders = [];
      for (let i = 0; i < n; i++) if (scores[i] === top) leaders.push(i);
      if (top >= s.targetScore && leaders.length === 1) {
        matchOver = true;
        winnerIds = leaders;
      }
    }

    notify();
    setState({ scores, lastDelta: delta, scored: true, matchOver, winnerIds });
  };
  const goScoreboard = () => setState({ screen: 'scoreboard' });

  const L = getStrings(state.lang);

  return {
    state,
    // static data
    catList,
    catColors,
    rules: L.rules,
    // i18n
    L,
    lang: state.lang,
    langList,
    langNames,
    setLang,
    catName,
    // helpers
    range,
    dName,
    dInit,
    pColor,
    // actions
    setDark,
    setLight,
    openRules,
    closeRules,
    openSettings,
    closeSettings,
    openRulesFromSettings,
    goHome,
    goSetup,
    incPlayers,
    decPlayers,
    setImp1,
    setImp2,
    setCategory,
    setTimer,
    setTarget,
    setName,
    startGame,
    nextRound,
    newGame,
    readyReveal,
    flipCard,
    hideAndPass,
    continueQuestion,
    toggleTimer,
    goVoting,
    readyVote,
    castVote,
    imposterGuess,
    goScoreboard,
  };
}
