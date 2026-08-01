import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import env from '../../config/env.js';

const { GCS_CLIENT_EMAIL, GCS_PRIVATE_KEY, GCS_PROJECT_ID } = env;

const ttsClient = new TextToSpeechClient({
  projectId: GCS_PROJECT_ID,
  credentials: {
    client_email: GCS_CLIENT_EMAIL,
    private_key: GCS_PRIVATE_KEY,
  },
});

async function synthesizeSpeech(text: string, languageCode: string): Promise<Buffer> {
  const [response] = await ttsClient.synthesizeSpeech({
    input: { text },
    voice: { languageCode },
    audioConfig: { audioEncoding: 'MP3' },
  });

  if (!response.audioContent) {
    throw new Error('Text-to-speech synthesis returned no audio content');
  }

  return Buffer.from(response.audioContent);
}

export default { synthesizeSpeech };
