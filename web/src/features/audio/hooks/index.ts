import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '@/features/auth/hooks';
import { getItemAudio } from '../api';
import { ItemAudioField } from '../schemas';

// Shared across every useItemAudio instance so starting a new clip stops
// whichever one is already playing, instead of overlapping audio.
let currentlyPlaying: HTMLAudioElement | null = null;

export function useItemAudio(
  listId: string,
  itemId: string,
  field: ItemAudioField,
) {
  const { data: user } = useCurrentUser();

  const query = useQuery({
    queryKey: ['itemAudio', user.id, listId, itemId, field],
    queryFn: () => getItemAudio(user.id, listId, itemId, field),
    enabled: false,
    // Stay comfortably under the API's 15-minute presigned URL TTL so a
    // repeat play within this window reuses the same URL (and lets the
    // browser's HTTP cache reuse the audio bytes) instead of re-fetching.
    staleTime: 10 * 60 * 1000,
  });

  const play = async () => {
    const result = query.data ?? (await query.refetch()).data;
    if (!result) return;

    currentlyPlaying?.pause();
    const audio = new Audio(result.data.audioUrl);
    currentlyPlaying = audio;
    audio.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });
  };

  return { play, isLoading: query.isFetching };
}
