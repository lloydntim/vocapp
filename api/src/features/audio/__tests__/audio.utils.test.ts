import { describe, expect, it } from 'vitest';
import { buildAudioKey } from '../audio.utils.js';

describe('buildAudioKey', () => {
  it('produces a stable key for the same text and language', () => {
    expect(buildAudioKey('apple', 'en')).toEqual(buildAudioKey('apple', 'en'));
  });

  it('is case- and whitespace-insensitive', () => {
    expect(buildAudioKey('  Apple ', 'EN')).toEqual(buildAudioKey('apple', 'en'));
  });

  it('produces different keys for different text', () => {
    expect(buildAudioKey('apple', 'en')).not.toEqual(buildAudioKey('banana', 'en'));
  });

  it('produces different keys for the same text in different languages', () => {
    expect(buildAudioKey('bank', 'en')).not.toEqual(buildAudioKey('bank', 'de'));
  });

  it('does not collide on non-Latin scripts', () => {
    // Regression: the old key generator stripped everything but a-zA-Z, so every
    // non-Latin word for a given language collapsed onto the same filename.
    const apple = buildAudioKey('りんご', 'ja');
    const banana = buildAudioKey('バナナ', 'ja');

    expect(apple).not.toEqual(banana);
  });

  it('namespaces the key under audio/<languageCode>/ as a sha256 hex digest', () => {
    expect(buildAudioKey('apple', 'en')).toMatch(/^audio\/en\/[0-9a-f]{64}\.mp3$/);
  });
});
