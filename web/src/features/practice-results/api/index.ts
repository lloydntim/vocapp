import { clientApi } from '@/lib/client-api';
import { AddPracticeResultsPayload } from '../schemas';

export async function addPracticeResults(
  userId: string,
  listId: string,
  sessionId: string,
  payload: AddPracticeResultsPayload,
): Promise<void> {
  await clientApi<unknown>(
    `/users/${userId}/lists/${listId}/sessions/${sessionId}/results/batch`,
    {
      body: JSON.stringify({ results: payload }),
      method: 'POST',
    },
  );
}
