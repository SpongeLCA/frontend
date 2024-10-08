import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { fakeProfiles, Profile } from '../data/fakeProfiles';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [currentUser] = useState<Profile>(fakeProfiles[0]); // Assuming the first profile is the current user

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <TouchableOpacity onPress={() => {/* TODO: Implement edit profile */}}>
            <Feather name="edit" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: currentUser.images[0] }} style={styles.profileImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{currentUser.name}, {currentUser.age}</Text>
          {currentUser.isPremium && (
            <View style={styles.premiumBadge}>
              <Feather name="star" size={16} color="#FFD700" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
          <Text style={styles.bio}>{currentUser.bio}</Text>
          <Text style={styles.sectionTitle}>Langues</Text>
          <FlatList
            data={currentUser.languages}
            renderItem={renderLanguageItem}
            keyExtractor={(item, index) => `language-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <Text style={styles.sectionTitle}>Intérêts</Text>
          <FlatList
            data={currentUser.interests}
            renderItem={renderInterestItem}
            keyExtractor={(item, index) => `interest-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
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
});