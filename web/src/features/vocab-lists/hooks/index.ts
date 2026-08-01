import { useCurrentUser } from '@/features/auth/hooks';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createList, deleteList, getList, getLists, updateList } from '../api';
import { CreateListFormValues, UpdateListPayload } from '../schemas';

export const listKeys = {
  all: ['lists'] as const,
  byUser: (userId: string) => [...listKeys.all, userId] as const,
};

export function useGetLists() {
  const { data: user } = useCurrentUser();

  return useSuspenseQuery({
    queryKey: ['lists', user.id],
    queryFn: () => getLists(user.id),
    select: (response) => response.data,
  });
}

export function useListsQuery() {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: ['lists', user.id],
    queryFn: () => getLists(user.id),
    select: (response) => response.data,
  });
}

export function useGetList(listId: string) {
  const { data: user } = useCurrentUser();

  return useSuspenseQuery({
    queryKey: ['lists', user.id, listId],
    queryFn: () => getList(user.id, listId),
    select: (response) => response.data,
  });
}

// Non-suspense read of the same cached query as useGetList, for callers
// that need the list's data (e.g. its language codes) without forcing
// their component to suspend while it loads.
export function useListQuery(listId: string) {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: ['lists', user.id, listId],
    queryFn: () => getList(user.id, listId),
    select: (response) => response.data,
  });
}

export function useCreateList() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateListFormValues) => createList(user.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists', user.id] });
    },
  });
}

export function useUpdateList(listId: string) {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateListPayload) =>
      updateList(user.id, listId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists', user.id] });
    },
  });
}

export function useDeleteList() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listId: string) => deleteList(user.id, listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists', user.id] });
    },
  });
}
