import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import {
  endPracticeSession,
  getPracticeSession,
  startPracticeSession,
} from '../api';
import { useCurrentUser } from '@/features/auth/hooks';
import {
  EndSessionPayload,
  SessionRequestResponse,
  StartSessionPayload,
} from '../schemas';
import { getQueryClient } from '@/lib/query-client';

export function useGetPracticeSession(listId: string, sessionId: string) {
  const { data: user } = useCurrentUser();

  return useSuspenseQuery({
    queryKey: ['sessions', user.id, listId],
    queryFn: () => getPracticeSession(user.id, listId, sessionId),
    select: (response: SessionRequestResponse) => response.data,
  });
}

export function useStartPracticeSession(listId: string) {
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: (payload: StartSessionPayload) =>
      startPracticeSession(user.id, listId, payload),
    onSuccess: () => {
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({
        queryKey: ['sessions', user.id, listId],
      });
    },
  });
}

export function useEndPracticeSession(listId: string, sessionId: string) {
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: (payload: EndSessionPayload) =>
      endPracticeSession(user.id, listId, sessionId, payload),
    onSuccess: () => {
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({
        queryKey: ['sessions', user.id, listId],
      });
    },
  });
}
