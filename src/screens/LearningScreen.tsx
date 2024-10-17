import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Share, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  QuizDetail: { item: ContentItem };
  ActivityDetail: { item: ContentItem };
};

type LearningScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type ContentItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'lesson' | 'quiz' | 'activity';
  location?: string;
};

const contentItems: ContentItem[] = [
  {
    id: '1',
    title: 'Expressions françaises dans les films',
    description: 'Apprenez les expressions françaises courantes utilisées dans les films populaires',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    type: 'lesson',
  },
  {
    id: '2',
    title: 'Quiz : Cinéma français',
    description: 'Testez vos connaissances sur les classiques du cinéma français',
    image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1156&q=80',
    type: 'quiz',
  },
  {
    id: '3',
    title: 'Vocabulaire culinaire espagnol',
    description: 'Découvrez les termes culinaires espagnols à travers les émissions de cuisine',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
    type: 'lesson',
  },
  {
    id: '4',
    title: 'Atelier cuisine "Chef\'s Table"',
    description: 'Apprenez à cuisiner comme les chefs de la série Chef\'s Table en pratiquant votre langue cible',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    type: 'activity',
    location: 'Paris, France',
  },
  {
    id: '5',
    title: 'Argot anglais dans les séries TV',
    description: 'Maîtrisez l\'argot anglais utilisé dans les séries TV populaires',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    type: 'lesson',
  },
  {
    id: '6',
    title: 'Quiz : Séries TV en VO',
    description: 'Testez votre compréhension des séries TV en version originale',
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    type: 'quiz',
  },
  {
    id: '7',
    title: 'Soirée quiz "Netflix & Learn"',
    description: 'Participez à une soirée quiz sur les séries et films Netflix pour pratiquer votre langue cible',
    image: 'https://images.unsplash.com/photo-1567593810070-7a3d471af022?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
    type: 'activity',
    location: 'Lyon, France',
  },
];

const languages = ['Français', 'English', 'Español', 'Deutsch', 'Italiano'];

export default function LearningScreen() {
  const navigation = useNavigation<LearningScreenNavigationProp>();
  const [selectedLanguage, setSelectedLanguage] = useState('Français');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'lessons' | 'quizzes' | 'activities'>('all');
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setUserLocation("Position non disponible");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address[0]) {
        setUserLocation(`${address[0].city}, ${address[0].country}`);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (item: ContentItem) => {
    try {
      await Share.share({
        message: `Découvrez "${item.title}" sur SpeakDate ! Un ${item.type} fascinant.`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderContentCard = ({ item }: { item: ContentItem }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.card}
      onPress={() => navigation.navigate(item.type === 'quiz' ? 'QuizDetail' : 'ActivityDetail', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.cardGradient}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        {item.location && <Text style={styles.cardLocation}>📍 {item.location}</Text>}
      </LinearGradient>
      <TouchableOpacity style={styles.shareButton} onPress={() => handleShare(item)}>
        <Feather name="share-2" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const filteredContent = contentItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.type === selectedCategory;
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Apprendre</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Feather name="settings" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.languageSelector}>
        <Text style={styles.languageLabel}>Langue :</Text>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setIsLanguageModalVisible(true)}
        >
          <Text style={styles.languageButtonText}>{selectedLanguage}</Text>
          <Feather name="chevron-down" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {userLocation && <Text style={styles.locationText}>📍 Votre position : {userLocation}</Text>}

      <FlatList
        data={filteredContent}
        renderItem={renderContentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
      />

      <Modal visible={isLanguageModalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionnez une langue</Text>
            {languages.map((language) => (
              <TouchableOpacity
                key={language}
                style={styles.languageOption}
                onPress={() => {
                  setSelectedLanguage(language);
                  setIsLanguageModalVisible(false);
                }}
              >
                <Text style={styles.languageOptionText}>{language}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsLanguageModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  languageLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#CCCCCC',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  cardLocation: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
  },
  shareButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#141414',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#E50914',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
