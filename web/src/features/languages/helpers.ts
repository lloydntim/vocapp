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
