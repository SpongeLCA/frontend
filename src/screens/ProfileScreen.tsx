import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type UserProfile = {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  languages: string[];
  interests: string[];
  photos: string[];
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // In a real app, fetch the user's profile from an API or local storage
    const fetchedProfile: UserProfile = {
      id: '1',
      name: 'John Doe',
      age: 28,
      bio: 'I love traveling and learning new languages!',
      location: 'Paris, France',
      languages: ['French', 'English', 'Spanish'],
      interests: ['Travel', 'Languages', 'Cooking', 'Photography', 'Music'],
      photos: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1505503693641-1926193e8d57?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      ],
    };
    setProfile(fetchedProfile);
  }, []);

  const handleSave = () => {
    // In a real app, send the updated profile to an API
    setIsEditing(false);
    Alert.alert('Profil mis à jour', 'Vos modifications ont été enregistrées avec succès.');
  };

  const navigateToPurchase = () => {
    navigation.navigate('Subscription');
  };

  const renderPhotoItem = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.photoItem} />
  );

  const renderInterestItem = ({ item }: { item: string }) => (
    <View style={styles.interestItem}>
      <Text style={styles.interestText}>{item}</Text>
    </View>
  );

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <LinearGradient colors={['#E50914', '#141414']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Feather name={isEditing ? "check" : "edit-2"} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profile.photos[0] }} style={styles.profileImage} />
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Feather name="camera" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.profileInfo}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                placeholder="Nom"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                value={profile.age.toString()}
                onChangeText={(text) => setProfile({ ...profile, age: parseInt(text) || 0 })}
                placeholder="Âge"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </>
          ) : (
            <Text style={styles.name}>{profile.name}, {profile.age}</Text>
          )}

          {isEditing ? (
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={profile.bio}
              onChangeText={(text) => setProfile({ ...profile, bio: text })}
              placeholder="Bio"
              placeholderTextColor="#999"
              multiline
            />
          ) : (
            <Text style={styles.bio}>{profile.bio}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localisation</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profile.location}
              onChangeText={(text) => setProfile({ ...profile, location: text })}
              placeholder="Localisation"
              placeholderTextColor="#999"
            />
          ) : (
            <Text style={styles.sectionContent}>{profile.location}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Langues</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profile.languages.join(', ')}
              onChangeText={(text) => setProfile({ ...profile, languages: text.split(', ') })}
              placeholder="Langues (séparées par des virgules)"
              placeholderTextColor="#999"
            />
          ) : (
            <View style={styles.languagesContainer}>
              {profile.languages.map((language, index) => (
                <View key={index} style={styles.languageItem}>
                  <Text style={styles.languageText}>{language}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intérêts</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profile.interests.join(', ')}
              onChangeText={(text) => setProfile({ ...profile, interests: text.split(', ') })}
              placeholder="Intérêts (séparés par des virgules)"
              placeholderTextColor="#999"
            />
          ) : (
            <FlatList
              data={profile.interests}
              renderItem={renderInterestItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <FlatList
            data={profile.photos}
            renderItem={renderPhotoItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.purchaseButton} onPress={navigateToPurchase}>
          <Feather name="shopping-bag" size={24} color="#FFFFFF" />
          <Text style={styles.purchaseButtonText}>Achats</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#E50914',
    borderRadius: 20,
    padding: 8,
  },
  profileInfo: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E50914',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#333',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageItem: {
    backgroundColor: '#E50914',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  interestItem: {
    backgroundColor: '#333',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  interestText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  photoItem: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#E50914',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});

export default ProfileScreen;