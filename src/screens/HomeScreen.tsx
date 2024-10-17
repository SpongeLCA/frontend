import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, RefreshControl, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Profile } from '../data/fakeProfiles';
import { Conversation } from '../data/fakeMessages';
import { featuredProfiles, recentMatches } from '../data/fakeRecommendations';
import { fakeConversations } from '../data/fakeMessages';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.8;

const OnlineIndicator = () => (
  <LinearGradient
    colors={['#4CAF50', '#45a049']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.onlineIndicatorContainer}
  >
    <View style={styles.onlineIndicator} />
    <Text style={styles.onlineText}>En ligne</Text>
  </LinearGradient>
);

const ProfileCard = ({ profile, onPress }: { profile: Profile; onPress: () => void }) => {
  const [scaleAnim] = useState(new Animated.Value(0.95));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[styles.profileCard, { transform: [{ scale: scaleAnim }] }]}>
        <Image source={{ uri: profile.images[0] }} style={styles.profileImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.profileOverlay}
        >
          <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
          <Text style={styles.profileLanguage}>
            {profile.languages[0]?.language || 'Langue non spécifiée'}
          </Text>
          <Text style={styles.profileInfo}>
            {profile.originCountry} → {profile.destinationCity}
          </Text>
          <Text style={styles.profileInterests}>
            {profile.culturalInterests.join(' • ')}
          </Text>
          {profile.isPremium && (
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumBadge}
            >
              <Feather name="star" size={12} color="#FFFFFF" />
              <Text style={styles.premiumText}>Premium</Text>
            </LinearGradient>
          )}
          {profile.isOnline && <OnlineIndicator />}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const MessagePreview = ({ conversation, onPress }: { conversation: Conversation; onPress: () => void }) => (
  <TouchableOpacity style={styles.messagePreview} onPress={onPress}>
    <Image source={{ uri: conversation.matchProfile.images[0] }} style={styles.messageAvatar} />
    <View style={styles.messageContent}>
      <Text style={styles.messageName}>{conversation.matchProfile.name}</Text>
      <Text style={styles.messageText} numberOfLines={1}>
        {conversation.messages[conversation.messages.length - 1]?.text || ''}
      </Text>
    </View>
    {conversation.matchProfile.isOnline && <View style={styles.messageOnlineIndicator} />}
    {conversation.unreadCount > 0 && (
      <View style={styles.unreadBadge}>
        <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const ToolbarButton = ({ icon, label, onPress, isActive }) => (
  <TouchableOpacity style={styles.toolbarButton} onPress={onPress}>
    <LinearGradient
      colors={isActive ? ['#E50914', '#B20710'] : ['#333333', '#222222']}
      style={styles.toolbarButtonGradient}
    >
      <Feather name={icon} size={24} color="#FFFFFF" />
    </LinearGradient>
    <Text style={[styles.toolbarButtonLabel, isActive && styles.toolbarButtonLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const navigation = useNavigation();
  const [featuredProfilesState, setFeaturedProfilesState] = useState<Profile[]>([]);
  const [recentMatchesProfilesState, setRecentMatchesProfilesState] = useState<Profile[]>([]);
  const [recentMessagesState, setRecentMessagesState] = useState<Conversation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setFeaturedProfilesState(featuredProfiles || []);
    setRecentMatchesProfilesState(recentMatches || []);
    setRecentMessagesState(fakeConversations || []);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const navigateToConversation = (conversationId: string) => {
    navigation.navigate('Conversation', { conversationId });
  };

  const navigateToMatching = () => {
    navigation.navigate('Matching');
  };

  const navigateToMessaging = () => {
    navigation.navigate('Messaging');
  };

  const navigateToLearning = () => {
    navigation.navigate('Learning');
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" />
        }
      >
        <LinearGradient
          colors={['#1a1a1a', '#000000']}
          style={styles.header}
        >
          <Text style={styles.logo}>Speak<Text style={styles.logoAccent}>Date</Text></Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Profils en vedette</Text>
        {featuredProfilesState.length > 0 ? (
          <FlatList
            data={featuredProfilesState}
            renderItem={({ item }) => (
              <ProfileCard
                profile={item}
                onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.featuredContainer}
            snapToInterval={cardWidth + 16}
            decelerationRate="fast"
          />
        ) : (
          <BlurView intensity={80} tint="dark" style={styles.noContentContainer}>
            <Text style={styles.noContentText}>
              Aucun profil en vedette pour le moment. Continuez à explorer et à interagir avec de nouveaux profils !
            </Text>
          </BlurView>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Derniers messages</Text>
          {recentMessagesState.slice(0, 3).map((conversation) => (
            <MessagePreview
              key={conversation.id}
              conversation={conversation}
              onPress={() => navigateToConversation(conversation.id)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Vos matchs récents</Text>
        {recentMatchesProfilesState.length > 0 ? (
          <FlatList
            data={recentMatchesProfilesState}
            renderItem={({ item }) => (
              <ProfileCard
                profile={item}
                onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.matchesContainer}
            snapToInterval={cardWidth + 16}
            decelerationRate="fast"
          />
        ) : (
          <BlurView intensity={80} tint="dark" style={styles.noContentContainer}>
            <Text style={styles.noContentText}>
              Aucun match récent. Continuez à explorer de nouveaux profils !
            </Text>
          </BlurView>
        )}
      </ScrollView>

      <BlurView intensity={100} tint="dark" style={styles.toolbar}>
        <ToolbarButton icon="home" label="Accueil" onPress={() => {}} isActive={true} />
        <ToolbarButton icon="heart" label="Swiper" onPress={navigateToMatching} isActive={false} />
        <ToolbarButton icon="message-square" label="Messages" onPress={navigateToMessaging} isActive={false} />
        <ToolbarButton icon="book-open" label="Apprendre" onPress={navigateToLearning} isActive={false} />
        <ToolbarButton icon="user" label="Profil" onPress={navigateToProfile} isActive={false} />
      </BlurView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoAccent: {
    color: '#E50914',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  featuredContainer: {
    paddingLeft: 16,
    marginBottom: 32,
  },
  matchesContainer: {
    paddingLeft: 16,
    marginBottom: 32,
  },
  profileCard: {
    width: cardWidth,
    height: 350,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  profileLanguage: {
    fontSize: 16,
    color: '#E50914',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  profileInfo: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  profileInterests: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    top: 16,
    right: 16,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  onlineIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    top: 16,
    left: 16,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  onlineText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  messageAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  messageContent: {
    flex: 1,
  },
  messageName: {
    fontSize: 18,
    fontWeight:  'bold',
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
    left: 60,
    borderWidth: 2,
    borderColor: '#000000',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  toolbarButton: {
    alignItems: 'center',
  },
  toolbarButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbarButtonLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  toolbarButtonLabelActive: {
    color: '#E50914',
  },
  noContentContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  noContentText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  unreadBadge: {
    backgroundColor: '#E50914',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 32,
  },
});