import { createHash } from 'node:crypto';

export function buildAudioKey(text: string, languageCode: string) {
  const normalized = `${text.trim().toLowerCase()}|${languageCode.toLowerCase()}`;
  const hash = createHash('sha256').update(normalized).digest('hex');

  return `audio/${languageCode.toLowerCase()}/${hash}.mp3`;
}
