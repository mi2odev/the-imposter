// CSS custom properties from the prototype, translated to a plain JS theme object.
// RN has no CSS variables, so screens read colors from the object returned by getTheme().

// Static accent colors (theme-independent in the prototype).
const accents = {
  goldTop: '#FFE066',
  goldBot: '#F2A81C',
  goldSh: '#B5740A',
  goldInk: '#2A1B00',
  gold: '#FFCE3A',
  crewTop: '#39C75A',
  crewBot: '#1E9E3E',
  crewSh: '#14722C',
  impTop: '#F2554F',
  impBot: '#C5201B',
  impSh: '#8E1410',
  blue: '#2D9CDB',
};

export function getTheme(dark) {
  const base = dark
    ? {
        bg2: '#0A0717',
        text: '#FFFFFF',
        muted: '#B9A7E0',
        card: '#211747',
        card2: '#2C2060',
        line: 'rgba(255,255,255,0.13)',
        // purpleGrad was a 180deg 3-stop gradient — expressed as a stops array for LinearGradient.
        purpleGrad: ['#3A2173', '#281652', '#160E32'],
      }
    : {
        bg2: '#EDE7FB',
        text: '#1C1340',
        muted: '#6B5BA6',
        card: '#FFFFFF',
        card2: '#F3EEFF',
        line: 'rgba(28,19,64,0.12)',
        purpleGrad: ['#6E50B6', '#8A5FC6', '#A579D6'],
      };
  return { ...accents, ...base, dark };
}

// gold gradient used by buttons / gradient text
export const GOLD = [accents.goldTop, accents.goldBot];

// Arabic is cursive: letterSpacing on tracked/all-caps labels breaks the joins
// between letters. Spread this onto any spaced Text to neutralize tracking in
// Arabic while leaving Latin scripts untouched. Usage: style={[base, arText(lang)]}.
export const arText = (lang) => (lang === 'ar' ? { letterSpacing: 0 } : null);

// Font family names registered by the @expo-google-fonts packages in App.js.
export const F = {
  lucky: 'LuckiestGuy_400Regular',
  fredoka4: 'Fredoka_400Regular',
  fredoka5: 'Fredoka_500Medium',
  fredoka6: 'Fredoka_600SemiBold',
  fredoka7: 'Fredoka_700Bold',
  nun4: 'Nunito_400Regular',
  nun6: 'Nunito_600SemiBold',
  nun7: 'Nunito_700Bold',
  nun8: 'Nunito_800ExtraBold',
  nun9: 'Nunito_900Black',
};

// Lighten/darken a hex color by ratio p (port of the prototype's shade()).
export function shade(hex, p) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const f = (c) => Math.round(Math.max(0, Math.min(255, c * (1 + p))));
  r = f(r);
  g = f(g);
  b = f(b);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
