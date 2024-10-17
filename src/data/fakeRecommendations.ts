import { Profile, fakeProfiles } from './fakeProfiles';
import { fakeMatches } from './fakeInteractions';

export const featuredProfiles: Profile[] = fakeProfiles
  .filter(profile => !fakeMatches.some(match => match.includes(profile.id)))
  .slice(0, 3);

export const recentMatches: Profile[] = fakeProfiles
  .filter(profile => fakeMatches.some(match => match.includes(profile.id)))
  .slice(0, 3);

export const suggestedProfiles: Profile[] = fakeProfiles
  .filter(profile => 
    !featuredProfiles.some(fp => fp.id === profile.id) && 
    !recentMatches.some(rm => rm.id === profile.id)
  )
  .slice(0, 5);