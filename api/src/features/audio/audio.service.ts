import { GetObjectCommand, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import env from '../../config/env.js';
import logger from '../../config/logger.js';
import s3Client from '../../config/s3.js';
import { buildAudioKey } from './audio.utils.js';
import ttsClient from './tts.client.js';

const PRESIGNED_URL_TTL_SECONDS = 60 * 15;

async function objectExists(key: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: env.AWS_BUCKET_NAME, Key: key }));
    return true;
  } catch (error) {
    if ((error as { name?: string }).name === 'NotFound') return false;
    throw error;
  }
}

async function getOrCreateAudioUrl(text: string, languageCode: string) {
  const key = buildAudioKey(text, languageCode);

  if (!(await objectExists(key))) {
    const audioContent = await ttsClient.synthesizeSpeech(text, languageCode);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: key,
        Body: audioContent,
        ContentType: 'audio/mpeg',
      }),
    );

    logger.info({ key, languageCode }, 'Synthesized and cached new audio clip');
  }

  const audioUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: env.AWS_BUCKET_NAME, Key: key }),
    { expiresIn: PRESIGNED_URL_TTL_SECONDS },
  );

  return { audioKey: key, audioUrl };
}

export default { getOrCreateAudioUrl };
