import { GetObjectCommand, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import s3Client from '../../../config/s3.js';
import audioService from '../audio.service.js';
import { buildAudioKey } from '../audio.utils.js';
import ttsClient from '../tts.client.js';

vi.mock('../../../config/s3.js', () => ({
  default: { send: vi.fn() },
}));

vi.mock('../tts.client.js', () => ({
  default: { synthesizeSpeech: vi.fn() },
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: vi.fn(),
}));

describe('audioService.getOrCreateAudioUrl', () => {
  const text = 'apple';
  const languageCode = 'en';
  const expectedKey = buildAudioKey(text, languageCode);
  const signedUrl = 'https://signed-url.example/audio.mp3';

  // s3Client.send is overloaded per-command in the real SDK, which makes plain
  // vi.mocked(s3Client.send) resolve to an unhelpful overload for mock*ValueOnce.
  // Cast the mock to a plain function type; this is test-only, the real client is untouched.
  const send = s3Client.send as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a presigned URL without synthesizing when the clip is already cached', async () => {
    send.mockResolvedValueOnce({});
    vi.mocked(getSignedUrl).mockResolvedValueOnce(signedUrl);

    const result = await audioService.getOrCreateAudioUrl(text, languageCode);

    expect(ttsClient.synthesizeSpeech).not.toHaveBeenCalled();
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(expect.any(HeadObjectCommand));
    expect(getSignedUrl).toHaveBeenCalledWith(s3Client, expect.any(GetObjectCommand), {
      expiresIn: 60 * 15,
    });
    expect(result).toEqual({ audioKey: expectedKey, audioUrl: signedUrl });
  });

  it('synthesizes and uploads the clip when it is not already cached', async () => {
    send.mockRejectedValueOnce({ name: 'NotFound' }).mockResolvedValueOnce({});
    vi.mocked(ttsClient.synthesizeSpeech).mockResolvedValueOnce(Buffer.from('fake-audio'));
    vi.mocked(getSignedUrl).mockResolvedValueOnce(signedUrl);

    const result = await audioService.getOrCreateAudioUrl(text, languageCode);

    expect(ttsClient.synthesizeSpeech).toHaveBeenCalledWith(text, languageCode);
    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenNthCalledWith(1, expect.any(HeadObjectCommand));
    expect(send).toHaveBeenNthCalledWith(2, expect.any(PutObjectCommand));
    expect(result).toEqual({ audioKey: expectedKey, audioUrl: signedUrl });
  });

  it('propagates unexpected S3 errors instead of treating them as a cache miss', async () => {
    send.mockRejectedValueOnce({ name: 'AccessDenied' });

    await expect(audioService.getOrCreateAudioUrl(text, languageCode)).rejects.toEqual({
      name: 'AccessDenied',
    });
    expect(ttsClient.synthesizeSpeech).not.toHaveBeenCalled();
  });
});
