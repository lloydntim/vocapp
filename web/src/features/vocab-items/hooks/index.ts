import { useCurrentUser } from '@/features/auth/hooks';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  createListItem,
  deleteListItem,
  getListItems,
  updateListItem,
} from '../api';
import { CreateListItemPayload, UpdateListItemPayload } from '../schemas';

export function useGetListItems(listId: string) {
  const { data: user } = useCurrentUser();

  return useSuspenseQuery({
    queryKey: ['listItems', user.id, listId],
    queryFn: () => getListItems(user.id, listId),
    select: (response) => response.data,
  });
}

export function useCreateListItem(listId: string) {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateListItemPayload) =>
      createListItem(user.id, listId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listItems', user.id, listId],
      });
    },
  });
}

export function useUpdateListItem(listId: string, itemId: string) {
  const { data: user } = useCurrentUser();
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateListItemPayload) =>
      updateListItem(user.id, listId, itemId, payload),
    onSuccess: () => {
      clientQuery.invalidateQueries({
        queryKey: ['listItems', user.id, listId],
      });
    },
  });
}

export function useDeleteListItem(listId: string) {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteListItem(user.id, listId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listItems', user.id, listId],
      });
    },
  });
}
