import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SubscriptionTier } from '../backend';

export function useUpgradeToPro() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { tier: SubscriptionTier; discountCode?: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.upgradeToPro(data.discountCode || null, data.tier);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}
