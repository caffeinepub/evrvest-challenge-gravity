import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, ExperienceLevel, SportFocus } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched
  };
}

export function useCreateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      bodyweightKg: number;
      heightCm: number;
      experienceLevel: ExperienceLevel;
      sportFocus: SportFocus;
      goals: string;
      weeklyTrainingFrequency: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProfile(
        data.bodyweightKg,
        data.heightCm,
        data.experienceLevel,
        data.sportFocus,
        data.goals,
        data.weeklyTrainingFrequency
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      bodyweightKg: number;
      heightCm: number;
      experienceLevel: ExperienceLevel;
      sportFocus: SportFocus;
      goals: string;
      weeklyTrainingFrequency: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProfile(
        data.bodyweightKg,
        data.heightCm,
        data.experienceLevel,
        data.sportFocus,
        data.goals,
        data.weeklyTrainingFrequency
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

export function useDeleteProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProfile();
    },
    onSuccess: () => {
      queryClient.clear();
    }
  });
}

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });
}
