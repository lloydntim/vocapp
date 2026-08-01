'use client';

import { clientApi } from '@/lib/client-api';
import {
  EndSessionPayload,
  SessionRequestResponse,
  sessionRequestResponseSchema,
  StartSessionPayload,
} from '../schemas';

export async function getPracticeSession(
  userId: string,
  listId: string,
  sessionId: string,
): Promise<SessionRequestResponse> {
  const response = await clientApi<unknown>(
    `/users/${userId}/lists/${listId}/sessions/${sessionId}`,
  );

  return sessionRequestResponseSchema.parse(response);
}

export async function startPracticeSession(
  userId: string,
  listId: string,
  { idempotencyKey, ...payload }: StartSessionPayload,
): Promise<SessionRequestResponse> {
  const response = await clientApi<unknown>(
    `/users/${userId}/lists/${listId}/sessions`,
    {
      headers: {
        'idempotency-key': idempotencyKey,
      },
      body: JSON.stringify(payload),
      method: 'POST',
    },
  );

  return sessionRequestResponseSchema.parse(response);
}

export async function endPracticeSession(
  userId: string,
  listId: string,
  sessionId: string,
  payload: EndSessionPayload,
): Promise<SessionRequestResponse> {
  const response = await clientApi<unknown>(
    `/users/${userId}/lists/${listId}/sessions/${sessionId}`,
    {
      body: JSON.stringify(payload),
      method: 'PATCH',
    },
  );

  return sessionRequestResponseSchema.parse(response);
}
