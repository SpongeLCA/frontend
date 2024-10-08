import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { fakeProfiles, Profile } from '../data/fakeProfiles';
import { fakeConversations, Conversation } from '../data/fakeMessages';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.8;

const OnlineIndicator = () => (
  <View style={styles.onlineIndicatorContainer}>
    <View style={styles.onlineIndicator} />
    <Text style={styles.onlineText}>En ligne</Text>
  </View>
);

const ProfileCard = ({ profile, onPress }: { profile: Profile; onPress: () => void }) => (
  <TouchableOpacity style={styles.profileCard} onPress={onPress}>
    <Image source={{ uri: profile.images[0] }} style={styles.profileImage} />
    <View style={styles.profileOverlay}>
      <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
      <Text style={styles.profileLanguage}>{profile.languages[0]?.language || 'Langue non spécifiée'}</Text>
      {profile.isPremium && (
        <View style={styles.premiumBadge}>
          <Feather name="star" size={12} color="#FFD700" />
          <Text style={styles.premiumText}>Premium</Text>
        </View>
      )}
      {profile.isOnline && <OnlineIndicator />}
    </View>
  </TouchableOpacity>
);

const MessagePreview = ({ conversation, onPress }: { conversation: Conversation; onPress: () => void }) => (
  <TouchableOpacity style={styles.messagePreview} onPress={onPress}>
    <Image source={{ uri: conversation.matchProfile.images[0] }} style={styles.messageAvatar} />
    <View style={styles.messageContent}>
      <Text style={styles.messageName}>{conversation.matchProfile.name}</Text>
      <Text style={styles.messageText} numberOfLines={1}>
        {conversation.messages[conversation.messages.length - 1].text}
      </Text>
    </View>
    {conversation.matchProfile.isOnline && <View style={styles.messageOnlineIndicator} />}
  </TouchableOpacity>
);

export default function HomeScreen() {
  const navigation = useNavigation();
  const [featuredProfiles, setFeaturedProfiles] = useState<Profile[]>([]);
  const [recentMatches, setRecentMatches] = useState<Profile[]>([]);
  const [recentMessages, setRecentMessages] = useState<Conversation[]>([]);

  useEffect(() => {
    if (fakeProfiles && fakeProfiles.length > 0) {
      const updatedProfiles = fakeProfiles.map(profile => ({
        ...profile,
        isOnline: Math.random() < 0.3
      }));
      setFeaturedProfiles(updatedProfiles.slice(0, 5));
      setRecentMatches(updatedProfiles.slice(5, 15));
    }

    if (fakeConversations && fakeConversations.length > 0) {
      const sortedConversations = [...fakeConversations].sort((a, b) => {
        const aTimestamp = a.messages[a.messages.length - 1].timestamp.getTime();
        const bTimestamp = b.messages[b.messages.length - 1].timestamp.getTime();
        return bTimestamp - aTimestamp;
      });
      setRecentMessages(sortedConversations.slice(0, 3));
    }
  }, []);

  const navigateToConversation = (conversationId: string) => {
    navigation.navigate('Conversation', { conversationId });
  };

  if (featuredProfiles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Chargement des profils...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.logo}>Speak<Text style={styles.logoAccent}>Date</Text></Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Feather name="user" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Profils en vedette</Text>
        <FlatList
          data={featuredProfiles}
          renderItem={({ item }) => (
            <ProfileCard
              profile={item}
              onPress={() => navigation.navigate('Profile', { profileId: item.id })}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.featuredContainer}
        />

        <Text style={styles.sectionTitle}>Messages récents</Text>
        {recentMessages.map((conversation) => (
          <MessagePreview
            key={conversation.id}
            conversation={conversation}
            onPress={() => navigateToConversation(conversation.id)}
          />
        ))}

        <Text style={styles.sectionTitle}>Vos matchs récents</Text>
        <FlatList
          data={recentMatches}
          renderItem={({ item }) => (
            <ProfileCard
              profile={item}
              onPress={() => navigation.navigate('Profile', { profileId: item.id })}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.matchesContainer}
        />

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.swipeButton]}
            onPress={() => navigation.navigate('Matching')}
          >
            <Feather name="heart" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Swiper</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.messagesButton]}
            onPress={() => navigation.navigate('Messaging')}
          >
            <Feather name="message-square" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Messages</Text>
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
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoAccent: {
    color: '#E50914',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  featuredContainer: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  matchesContainer: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  profileCard: {
    width: cardWidth,
    height: 300,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    padding: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileLanguage: {
    fontSize: 14,
    color: '#E50914',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  onlineIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  onlineText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 25,
    width: '40%',
  },
  swipeButton: {
    backgroundColor: '#E50914',
  },
  messagesButton: {
    backgroundColor: '#0077B5',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  messageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  messageContent: {
    flex: 1,
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#999',
  },
  messageOnlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 16,
    left: 54,
    borderWidth: 2,
    borderColor: '#000000',
  },
});