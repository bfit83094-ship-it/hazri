import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/profileService';
import type { Profile } from '../types/db';

export const PROFILE_KEY = ['profile'] as const;

export function useProfile() {
  const { userId } = useAuth();

  return useQuery<Profile | null>({
    queryKey: [...PROFILE_KEY, userId],
    queryFn: () =>
      userId ? profileService.getCurrentProfile(userId) : Promise.resolve(null),
    enabled: Boolean(userId),
  });
}
