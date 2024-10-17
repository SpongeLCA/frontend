import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fakeProfiles, Profile, Language } from '../data/fakeProfiles';

type RootStackParamList = {
  UserProfile: { userId: string };
  Conversation: { userId: string };
};

type UserProfileScreenRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;

const { width } = Dimensions.get('window');

export default function UserProfileScreen() {
  const route = useRoute<UserProfileScreenRouteProp>();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [user, setUser] = useState<Profile | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const foundUser = fakeProfiles.find(profile => profile.id === userId);
    if (foundUser) {
      setUser(foundUser);
    }
  }, [userId]);

  const handleMessage = () => {
    navigation.navigate('Conversation', { userId: user.id });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    Alert.alert(
      "J'aime",
      isLiked ? "Vous n'aimez plus ce profil." : "Vous aimez ce profil !",
      [{ text: "OK" }]
    );
  };

  const handleReport = () => {
    Alert.alert(
      "Signaler l'utilisateur",
      "Êtes-vous sûr de vouloir signaler cet utilisateur ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Signaler", 
          style: "destructive",
          onPress: () => {
            Alert.alert("Signalement", "L'utilisateur a été signalé. Nous examinerons votre signalement dans les plus brefs délais.");
          }
        }
      ]
    );
  };

  const renderLanguageItem = ({ item }: { item: Language }) => (
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

  const renderImageItem = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.galleryImage} />
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
          <TouchableOpacity onPress={handleReport}>
            <Feather name="flag" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: user.images[0] }} style={styles.profileImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.profileImageOverlay}
          >
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user.name}, {user.age}</Text>
              {user.isPremium && (
                <View style={styles.premiumBadge}>
                  <Feather name="star" size={16} color="#FFD700" />
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.bio}>{user.bio}</Text>
          <View style={styles.locationInfo}>
            <Feather name="map-pin" size={16} color="#FFFFFF" />
            <Text style={styles.locationText}>{user.originCountry} → {user.destinationCity}</Text>
          </View>
          <Text style={styles.sectionTitle}>Langues</Text>
          <FlatList
            data={user.languages}
            renderItem={renderLanguageItem}
            keyExtractor={(item, index) => `language-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <Text style={styles.sectionTitle}>Intérêts culturels</Text>
          <FlatList
            data={user.culturalInterests}
            renderItem={renderInterestItem}
            keyExtractor={(item, index) => `interest-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <Text style={styles.sectionTitle}>Galerie</Text>
          <FlatList
            data={user.images}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => `image-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width - 32}
            decelerationRate="fast"
          />
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
            <Feather name="message-circle" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Feather name={isLiked ? "heart" : "heart"} size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>{isLiked ? "Je n'aime plus" : "J'aime"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileImageContainer: {
    width: '100%',
    height: 450,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
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
    lineHeight: 24,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
  },
  languageItem: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginTop: 4,
  },
  interestTag: {
    backgroundColor: '#E50914',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  interestText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  galleryImage: {
    width: width - 32,
    height: 200,
    borderRadius: 8,
    marginRight: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 16,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flex: 1,
    marginRight: 8,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flex: 1,
    marginLeft: 8,
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