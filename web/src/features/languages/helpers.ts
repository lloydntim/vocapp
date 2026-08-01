import { AutoCompleteItem } from '@/components/ui/AutoComplete/AutoComplete';

export const buildLanguagesDataList = (
  languagesData: { languageCode: string; displayName: string }[] | undefined,
): AutoCompleteItem[] =>
  (languagesData ?? []).map(({ languageCode, displayName }) => ({
    value: languageCode,
    text: displayName,
  }));

export const buildLanguageNameMap = (
  languagesData: { languageCode: string; displayName: string }[] | undefined,
): Record<string, string> =>
  Object.fromEntries(
    (languagesData ?? []).map(({ languageCode, displayName }) => [
      languageCode,
      displayName,
    ]),
  );

// Best-effort flag emoji for the languages users are most likely to study.
// Language codes don't map 1:1 to countries (e.g. English, Arabic, Chinese
// span many), so this is a reasonable default rather than an exhaustive map -
// codes outside this set simply render without a flag.
export const languageFlagMap: Record<string, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  es: '🇪🇸',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹',
  nl: '🇳🇱',
  ru: '🇷🇺',
  ja: '🇯🇵',
  ko: '🇰🇷',
  zh: '🇨🇳',
  'zh-CN': '🇨🇳',
  'zh-TW': '🇹🇼',
  ar: '🇸🇦',
  hi: '🇮🇳',
  ta: '🇮🇳',
  te: '🇮🇳',
  bn: '🇧🇩',
  ur: '🇵🇰',
  fa: '🇮🇷',
  he: '🇮🇱',
  tr: '🇹🇷',
  el: '🇬🇷',
  pl: '🇵🇱',
  sv: '🇸🇪',
  no: '🇳🇴',
  da: '🇩🇰',
  fi: '🇫🇮',
  cs: '🇨🇿',
  sk: '🇸🇰',
  hu: '🇭🇺',
  ro: '🇷🇴',
  bg: '🇧🇬',
  hr: '🇭🇷',
  sr: '🇷🇸',
  sl: '🇸🇮',
  lt: '🇱🇹',
  lv: '🇱🇻',
  et: '🇪🇪',
  uk: '🇺🇦',
  th: '🇹🇭',
  vi: '🇻🇳',
  id: '🇮🇩',
  ms: '🇲🇾',
  sw: '🇰🇪',
  af: '🇿🇦',
};
