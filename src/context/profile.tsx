import { createContext, useContext, useState, type PropsWithChildren } from 'react';

export type Profile = { name: string; email: string };

const ProfileContext = createContext<{
  profile: Profile;
  setProfile: (profile: Profile) => void;
} | null>(null);

export function ProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<Profile>({
    name: 'Nguyen Van An',
    email: 'student@uit.edu.vn',
  });
  return <ProfileContext value={{ profile, setProfile }}>{children}</ProfileContext>;
}

export function useProfile() {
  const value = useContext(ProfileContext);
  if (!value) throw new Error('useProfile must be used inside ProfileProvider');
  return value;
}
