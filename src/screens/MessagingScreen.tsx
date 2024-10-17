import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Image, Animated, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fakeProfiles, Profile } from '../data/fakeProfiles';
import { fakeConversations, Conversation } from '../data/fakeMessages';
import { FlatList } from 'react-native';


const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function MessagingScreen() {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [onlineMatches, setOnlineMatches] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const searchBarAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setConversations(fakeConversations);
    setOnlineMatches(fakeProfiles.filter(profile => profile.isOnline));
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleSearchFocus = (focused: boolean) => {
    Animated.spring(searchBarAnim, {
      toValue: focused ? 1 : 0,
      useNativeDriver: false,
    }).start();
  };

  const renderMatchItem = useCallback(({ item }: { item: Profile }) => (
    <TouchableOpacity
      style={styles.matchItem}
      onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.images[0] }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <Text style={styles.matchName}>{item.name}</Text>
    </TouchableOpacity>
  ), [navigation]);

  const renderConversationItem = useCallback(({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => navigation.navigate('Conversation', { conversationId: item.id })}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.matchProfile.images[0] }} style={styles.avatar} />
        {item.matchProfile.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.conversationInfo}>
        <Text style={styles.conversationName}>{item.matchProfile.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.messages[item.messages.length - 1]?.text || "Pas encore de messages"}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  ), [navigation]);

  const sections = [
    { title: 'Conversations', data: conversations, renderItem: renderConversationItem }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedLinearGradient
        colors={['#1E1E1E', '#121212']}
        style={[styles.gradient, { opacity: fadeAnim }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Retour">
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity onPress={() => navigation.navigate('NewMessage')} accessibilityLabel="Nouveau message">
            <Feather name="edit" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Animated.View style={[
          styles.searchContainer,
          {
            marginHorizontal: searchBarAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 0]
            }),
            borderRadius: searchBarAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [25, 0]
            })
          }
        ]}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des conversations"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => handleSearchFocus(true)}
            onBlur={() => handleSearchFocus(false)}
          />
        </Animated.View>

        <SectionList
  sections={sections}
  keyExtractor={(item) => item.id}
  renderItem={({ section, item }) => section.renderItem({ item })}
  renderSectionHeader={({ section: { title } }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  )}
  ListHeaderComponent={() => (
    <View style={styles.matchesContainer}>
      <Text style={styles.sectionTitle}>Matchs en ligne</Text>
      <FlatList
        data={onlineMatches}
        horizontal
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}  // Cache la barre de scroll
        contentContainerStyle={{ paddingLeft: 16 }} // Ajuste les marges internes
      />
    </View>
  )}
  ListEmptyComponent={() => (
    <View style={styles.emptyContainer}>
      <Feather name="message-circle" size={48} color="#666" />
      <Text style={styles.emptyText}>Pas encore de conversations</Text>
      <TouchableOpacity style={styles.startChatButton} onPress={() => navigation.navigate('NewMessage')}>
        <Text style={styles.startChatButtonText}>Démarrer une nouvelle conversation</Text>
      </TouchableOpacity>
    </View>
  )}
/>
      </AnimatedLinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
    marginBottom: 8,
  },
  matchItem: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#121212',
  },
  matchName: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  unreadBadge: {
    backgroundColor: '#E50914',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  startChatButton: {
    backgroundColor: '#E50914',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startChatButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
