import { Profile } from './fakeProfiles';

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

export const fakeConversations: Conversation[] = [
  {
    id: '1',
    matchProfile: {
      id: '2',
      name: 'Sophie',
      age: 28,
      images: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      ],
      bio: "Passionnée de voyages et de photographie. J'adore découvrir de nouvelles cultures et langues.",
      languages: [
        { language: 'Français', level: 'Natif' },
        { language: 'Anglais', level: 'Courant' },
        { language: 'Espagnol', level: 'Intermédiaire' },
      ],
      interests: ['Voyages', 'Photographie', 'Cuisine', 'Randonnée'],
      isOnline: true,
      isPremium: false,
    },
    messages: [
      {
        id: '1',
        text: 'Salut ! J\'ai vu que tu aimais voyager. Quel est ton pays préféré jusqu\'à présent ?',
        sender: 'user',
        timestamp: new Date('2023-05-10T10:00:00Z'),
      },
      {
        id: '2',
        text: 'Bonjour ! Mon pays préféré est le Japon. J\'adore leur culture et leur cuisine. Et toi ?',
        sender: 'match',
        timestamp: new Date('2023-05-10T10:05:00Z'),
      },
      {
        id: '3',
        text: 'Le Japon est magnifique ! J\'ai adoré l\'Italie pour sa nourriture et son histoire. Tu parles japonais ?',
        sender: 'user',
        timestamp: new Date('2023-05-10T10:10:00Z'),
      },
    ],
    unreadCount: 1,
  },
  {
    id: '2',
    matchProfile: {
      id: '3',
      name: 'Thomas',
      age: 32,
      images: [
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
      ],
      bio: "Ingénieur en informatique et musicien amateur. Je cherche quelqu'un pour partager ma passion pour la technologie et la musique.",
      languages: [
        { language: 'Français', level: 'Natif' },
        { language: 'Anglais', level: 'Courant' },
        { language: 'Allemand', level: 'Débutant' },
      ],
      interests: ['Musique', 'Technologie', 'Cinéma', 'Jeux vidéo'],
      isOnline: false,
      isPremium: true,
    },
    messages: [
      {
        id: '1',
        text: 'Salut Thomas ! J\'ai vu que tu étais musicien. Quel instrument joues-tu ?',
        sender: 'user',
        timestamp: new Date('2023-05-09T18:00:00Z'),
      },
      {
        id: '2',
        text: 'Salut ! Je joue de la guitare et un peu de piano. Et toi, tu es musicien aussi ?',
        sender: 'match',
        timestamp: new Date('2023-05-09T18:10:00Z'),
      },
    ],
    unreadCount: 0,
  },
  {
    id: '3',
    matchProfile: {
      id: '5',
      name: 'Chloé',
      age: 27,
      images: [
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80',
      ],
      bio: "Professeure de yoga et adepte de la méditation. À la recherche d'une âme sereine pour partager des moments de zen.",
      languages: [
        { language: 'Français', level: 'Natif' },
        { language: 'Anglais', level: 'Courant' },
        { language: 'Hindi', level: 'Intermédiaire' },
      ],
      interests: ['Yoga', 'Méditation', 'Cuisine végétarienne', 'Écologie'],
      isOnline: true,
      isPremium: false,
    },
    messages: [
      {
        id: '1',
        text: 'Bonjour Chloé ! J\'aimerais commencer le yoga. As-tu des conseils pour les débutants ?',
        sender: 'user',
        timestamp: new Date('2023-05-11T09:00:00Z'),
      },
      {
        id: '2',
        text: 'Bonjour ! C\'est génial que tu veuilles commencer le yoga. Je te conseille de commencer par des cours pour débutants et de te concentrer sur la respiration. As-tu déjà pratiqué une activité similaire ?',
        sender: 'match',
        timestamp: new Date('2023-05-11T09:15:00Z'),
      },
    ],
    unreadCount: 1,
  },
];