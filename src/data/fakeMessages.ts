export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: string;
  }
  
  export const fakeMessages: Message[] = [
    {
      id: '1',
      senderId: '1',
      receiverId: '2',
      text: 'Salut Thomas ! Comment vas-tu ?',
      timestamp: '2023-05-01T10:00:00Z',
    },
    {
      id: '2',
      senderId: '2',
      receiverId: '1',
      text: 'Bonjour Sophie ! Je vais bien, merci. Et toi ?',
      timestamp: '2023-05-01T10:05:00Z',
    },
    {
      id: '3',
      senderId: '1',
      receiverId: '2',
      text: 'Très bien ! Je viens de rentrer d\'un voyage en Espagne, c\'était incroyable !',
      timestamp: '2023-05-01T10:10:00Z',
    },
    {
      id: '4',
      senderId: '2',
      receiverId: '1',
      text: 'Oh, génial ! J\'adorerais en entendre plus. Peut-être autour d\'un café ?',
      timestamp: '2023-05-01T10:15:00Z',
    },
    {
      id: '5',
      senderId: '3',
      receiverId: '4',
      text: 'Salut Lucas ! J\'ai vu que tu étais musicien. Quel genre de musique joues-tu ?',
      timestamp: '2023-05-02T14:00:00Z',
    },
    {
      id: '6',
      senderId: '4',
      receiverId: '3',
      text: 'Coucou Amélie ! Je joue principalement de la guitare, du rock et du blues. Et toi, tu es artiste ?',
      timestamp: '2023-05-02T14:10:00Z',
    },
    {
      id: '7',
      senderId: '3',
      receiverId: '4',
      text: 'Oui, je suis peintre ! J\'adore travailler avec des couleurs vives. On devrait collaborer un jour !',
      timestamp: '2023-05-02T14:20:00Z',
    },
    {
      id: '8',
      senderId: '5',
      receiverId: '1',
      text: 'Bonjour Sophie ! J\'ai vu que tu parlais espagnol. As-tu déjà visité l\'Inde ?',
      timestamp: '2023-05-03T09:00:00Z',
    },
    {
      id: '9',
      senderId: '1',
      receiverId: '5',
      text: 'Salut Chloé ! Non, je n\'ai jamais été en Inde, mais c\'est sur ma liste ! Tu y es déjà allée ?',
      timestamp: '2023-05-03T09:15:00Z',
    },
    {
      id: '10',
      senderId: '5',
      receiverId: '1',
      text: 'Oui, plusieurs fois ! Si tu veux, je peux te donner des conseils pour ton futur voyage.',
      timestamp: '2023-05-03T09:30:00Z',
    },
  ];