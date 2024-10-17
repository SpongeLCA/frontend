import { currentUser, fakeProfiles } from './fakeProfiles';

export interface Like {
  userId: string;
  likedUserId: string;
  timestamp: Date;
}

export const fakeLikes: Like[] = fakeProfiles.slice(0, 10).map(profile => ({
  userId: currentUser.id,
  likedUserId: profile.id,
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
}));

export const fakeMatches: string[][] = fakeProfiles.slice(0, 5).map(profile => [currentUser.id, profile.id]);