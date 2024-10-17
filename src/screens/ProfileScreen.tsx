import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

export const currentUser = {
  id: '0',
  name: 'Thomas',
  age: 30,
  gender: 'male',
  images: [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    'https://images.unsplash.com/photo-1505503693641-1926193e8d57?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
  ],
  languages: [
    { language: 'Français', level: 'Natif' },
    { language: 'Anglais', level: 'Avancé' },
  ],
  originCountry: 'France',
  destinationCity: 'Paris',
  culturalInterests: ['Voyages', 'Cuisine internationale', 'Langues étrangères'],
  bio: "Français passionné par les cultures du monde, je suis ravi d'accueillir des personnes venant s'installer en France. J'adore échanger sur nos différences culturelles et partager mes connaissances sur la France.",
  isPremium: true,
  isOnline: true,
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(currentUser);

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Profil mis à jour', 'Vos modifications ont été enregistrées avec succès.');
  };

  const navigateToPurchase = () => {
    navigation.navigate('Subscription');
  };

  const renderPhotoItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.photoItem} />
  );

  const renderInterestItem = ({ item }) => (
    <View style={styles.interestItem}>
      <Text style={styles.interestText}>{item}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#E50914" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Feather name={isEditing ? "check" : "edit-2"} size={24} color="#E50914" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profile.images[0] }} style={styles.profileImage} />
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
            <Text style={styles.name}>
              {profile.name}, {profile.age}
            </Text>
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
              value={profile.destinationCity}
              onChangeText={(text) => setProfile({ ...profile, destinationCity: text })}
              placeholder="Localisation"
              placeholderTextColor="#999"
            />
          ) : (
            <Text style={styles.sectionContent}>{profile.destinationCity}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Langues</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profile.languages.map(lang => `${lang.language} (${lang.level})`).join(', ')}
              onChangeText={(text) => {
                const newLanguages = text.split(', ').map(lang => {
                  const [language, level] = lang.split(' (');
                  return { language, level: level ? level.slice(0, -1) : 'Débutant' };
                });
                setProfile({ ...profile, languages: newLanguages });
              }}
              placeholder="Langues (séparées par des virgules)"
              placeholderTextColor="#999"
            />
          ) : (
            <View style={styles.languagesContainer}>
              {profile.languages.map((lang, index) => (
                <View key={index} style={styles.languageItem}>
                  <Text style={styles.languageText}>{`${lang.language} (${lang.level})`}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intérêts culturels</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profile.culturalInterests.join(', ')}
              onChangeText={(text) => setProfile({ ...profile, culturalInterests: text.split(', ') })}
              placeholder="Intérêts (séparés par des virgules)"
              placeholderTextColor="#999"
            />
          ) : (
            <FlatList
              data={profile.culturalInterests}
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
            data={profile.images}
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

        {profile.isPremium ? (
          <View style={styles.premiumBadge}>
            <Feather name="award" size={24} color="#E50914" />
            <Text style={styles.premiumText}>Compte Premium</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.purchaseButton} onPress={navigateToPurchase}>
            <Feather name="shopping-bag" size={24} color="#FFFFFF" />
            <Text style={styles.purchaseButtonText}>Passer à Premium</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#141414',
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
    borderWidth: 2,
    borderColor: '#E50914',
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
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
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
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 4,
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
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    borderRadius: 4,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#E50914',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    margin: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    padding: 16,
    borderRadius: 4,
    margin: 16,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    padding: 16,
    borderRadius: 4,
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