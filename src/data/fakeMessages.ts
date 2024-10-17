import { Profile, currentUser, fakeProfiles } from './fakeProfiles';
import { fakeMatches } from './fakeInteractions';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'match';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  matchProfile: Profile;
  messages: Message[];
  unreadCount: number;
}

const createFakeMessages = (matchProfile: Profile): Message[] => {
  const messages: Message[] = [
    {
      id: '1',
      text: `Bonjour ${matchProfile.name} ! J'ai vu que vous venez de ${matchProfile.originCountry}. Comment trouvez-vous la France jusqu'à présent ?`,
      sender: 'user',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      text: `Bonjour ${currentUser.name} ! La France est magnifique, j'adore découvrir la culture et la langue. C'est très différent de ${matchProfile.originCountry} !`,
      sender: 'match',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      text: `Je suis ravi(e) que vous appréciez votre séjour ! Avez-vous déjà eu l'occasion de visiter ${matchProfile.destinationCity} ?`,
      sender: 'user',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      text: `Oui, j'ai commencé à explorer ${matchProfile.destinationCity} et c'est vraiment une ville fascinante. J'aimerais en découvrir plus sur la culture locale. Auriez-vous des recommandations ?`,
      sender: 'match',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ];

  return messages;
};

// Créer seulement trois conversations
const conversationProfiles = fakeProfiles.slice(0, 3);
export const fakeConversations: Conversation[] = conversationProfiles.map(profile => ({
  id: profile.id,
  matchProfile: profile,
  messages: createFakeMessages(profile),
  unreadCount: Math.floor(Math.random() * 3),
}));

// Créer des correspondants sans conversation
const allMatchIds = new Set(fakeMatches.flat());
const conversationProfileIds = new Set(conversationProfiles.map(profile => profile.id));
export const matchesWithoutConversation: Profile[] = fakeProfiles.filter(profile => 
  allMatchIds.has(profile.id) && !conversationProfileIds.has(profile.id)
);

// Combiner les conversations et les correspondants sans conversation
export const allMatches: (Conversation | Profile)[] = [
  ...fakeConversations,
  ...matchesWithoutConversation
];

// Fonction utilitaire pour déterminer si un élément est une conversation ou un profil
export const isConversation = (item: Conversation | Profile): item is Conversation => {
  return 'messages' in item;
};

// Fonction utilitaire pour trier les matchs (conversations en premier, puis par date du dernier message ou par nom)
export const sortMatches = (a: Conversation | Profile, b: Conversation | Profile): number => {
  if (isConversation(a) && isConversation(b)) {
    const lastMessageA = a.messages[a.messages.length - 1];
    const lastMessageB = b.messages[b.messages.length - 1];
    return lastMessageB.timestamp.getTime() - lastMessageA.timestamp.getTime();
  } else if (isConversation(a)) {
    return -1;
  } else if (isConversation(b)) {
    return 1;
  } else {
    return a.name.localeCompare(b.name);
  }
};

// Trier les matchs
allMatches.sort(sortMatches);