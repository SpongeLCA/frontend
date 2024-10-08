export interface Profile {
    id: string;
    name: string;
    age: number;
    images: string[];
    bio: string;
    languages: { language: string; level: string }[];
    interests: string[];
    isOnline: boolean;
    isPremium: boolean;
  }
  
  export const fakeProfiles: Profile[] = [
    {
      id: '1',
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
    {
      id: '2',
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
    {
      id: '3',
      name: 'Amélie',
      age: 25,
      images: [
        'https://images.unsplash.com/photo-1524638431109-93d95c968f03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
      ],
      bio: "Artiste peintre à la recherche d'inspiration. J'aime les conversations profondes et les cafés en terrasse.",
      languages: [
        { language: 'Français', level: 'Natif' },
        { language: 'Italien', level: 'Intermédiaire' },
      ],
      interests: ['Art', 'Littérature', 'Philosophie', 'Café'],
      isOnline: true,
      isPremium: false,
    },
    {
      id: '4',
      name: 'Lucas',
      age: 30,
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1148&q=80',
      ],
      bio: "Sportif passionné et entrepreneur. Je recherche quelqu'un qui partage mon goût pour l'aventure et le dépassement de soi.",
      languages: [
        { language: 'Français', level: 'Natif' },
        { language: 'Anglais', level: 'Courant' },
        { language: 'Portugais', level: 'Débutant' },
      ],
      interests: ['Sport', 'Entrepreneuriat', 'Voyages', 'Développement personnel'],
      isOnline: true,
      isPremium: true,
    },
    {
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
      isOnline: false,
      isPremium: false,
    },
    {
      id: '6',
      name: 'Antoine',
      age: 35,
      images: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      ],
      bio: "Chef cuisinier passionné par la gastronomie française. Je cherche quelqu'un pour partager mes créations culinaires et explorer de nouveaux restaurants.",
      languages: [
        { language: 'Français', level: 'Natif' },
        { language: 'Anglais', level: 'Intermédiaire' },
      ],
      interests: ['Cuisine', 'Vin', 'Voyages gastronomiques', 'Art de la table'],
      isOnline: true,
      isPremium: true,
    },
    {
      id: '7',
      name: 'Emma',
      age: 29,
      images: [
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
      ],
      bio: "Avocate engagée dans la défense des droits humains. Je recherche quelqu'un qui partage mes valeurs et mon désir de changer le monde.",
      languages: [
        { language: 'Français', level: 'Natif' },
        { language: 'Anglais', level: 'Courant' },
        { language: 'Arabe', level: 'Intermédiaire' },
      ],
      interests: ['Droits humains', 'Politique', 'Lecture', 'Débats'],
      isOnline: false,
      isPremium: false,
    },
    {
      id: '8',
      name: 'Maxime',
      age: 31,
      images: [
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      ],
      bio: "Architecte passionné par le design durable. Je cherche quelqu'un pour partager ma vision d'un monde plus vert et esthétique.",
      languages: [
        { language: 'Français', level: 'Natif' },
        { language: 'Anglais', level: 'Courant' },
        { language: 'Japonais', level: 'Débutant' },
      ],
      interests: ['Architecture', 'Design', 'Écologie', 'Art contemporain'],
      isOnline: true,
      isPremium: true,
    },
    {
      id: '9',
      name: 'Léa',
      age: 26,
      images: [
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      ],
      bio: "Danseuse professionnelle et professeure de danse. Je cherche quelqu'un qui apprécie l'art du mouvement et de l'expression corporelle.",
      languages: [
        { language: 'Français', level: 'Natif' },
        { language: 'Espagnol', level: 'Courant' },
        { language: 'Russe', level: 'Débutant' },
      ],
      interests: ['Danse', 'Musique', 'Théâtre', 'Mode'],
      isOnline: true,
      isPremium: false,
    },
    {
      id: '10',
      name: 'Hugo',
      age: 33,
      images: [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        
        'https://images.unsplash.com/photo-1508341591423-4347099e1f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      ],
      bio: "Journaliste globe-trotter à la recherche de nouvelles histoires. J'aimerais rencontrer quelqu'un qui partage ma curiosité pour le monde.",
      languages: [
        { language: 'Français', level: 'Natif' },
        { language: 'Anglais', level: 'Courant' },
        { language: 'Mandarin', level: 'Intermédiaire' },
      ],
      interests: ['Journalisme', 'Voyages', 'Photographie', 'Géopolitique'],
      isOnline: false,
      isPremium: true,
    },
  ];