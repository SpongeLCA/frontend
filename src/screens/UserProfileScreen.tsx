import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { fakeProfiles, Profile } from '../data/fakeProfiles';

type RootStackParamList = {
  UserProfile: { userId: string };
};

type UserProfileScreenRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;

export default function UserProfileScreen() {
  const route = useRoute<UserProfileScreenRouteProp>();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    const foundUser = fakeProfiles.find(profile => profile.id === userId);
    if (foundUser) {
      setUser(foundUser);
    }
  }, [userId]);

  const renderLanguageItem = ({ item }: { item: { language: string; level: string } }) => (
    <View style={styles.languageItem}>
      <Text style={styles.languageText}>{item.language}</Text>
      <Text style={styles.levelText}>{item.level}</Text>
    </View>
  );

  const renderInterestItem = ({ item }: { item: string }) => (
    <View style={styles.interestTag}>
      <Text style={styles.interestText}>{item}</Text>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Utilisateur non trouvé</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil</Text>
          <TouchableOpacity onPress={() => {/* TODO: Implement report user */}}>
            <Feather name="flag" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: user.images[0] }} style={styles.profileImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user.name}, {user.age}</Text>
          {user.isPremium && (
            <View style={styles.premiumBadge}>
              <Feather name="star" size={16} color="#FFD700" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
          <Text style={styles.bio}>{user.bio}</Text>
          <Text style={styles.sectionTitle}>Langues</Text>
          <FlatList
            data={user.languages}
            renderItem={renderLanguageItem}
            keyExtractor={(item, index) => `language-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <Text style={styles.sectionTitle}>Intérêts</Text>
          <FlatList
            data={user.interests}
            renderItem={renderInterestItem}
            keyExtractor={(item, index) => `interest-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.messageButton} onPress={() => {/* TODO: Implement messaging */}}>
            <Feather name="message-circle" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButton} onPress={() => {/* TODO: Implement like */}}>
            <Feather name="heart" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>J'aime</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  premiumText: {
    color: '#FFD700',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  languageItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  levelText: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  interestTag: {
    backgroundColor: '#E50914',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  interestText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E50914',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});