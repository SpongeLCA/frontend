import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { fakeProfiles, Profile } from '../data/fakeProfiles';
import { fakeConversations, Conversation } from '../data/fakeMessages';

const { width } = Dimensions.get('window');

export default function MessagingScreen() {
  const navigation = useNavigation();
  const [onlineProfiles, setOnlineProfiles] = useState<Profile[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    console.log('fakeProfiles:', fakeProfiles);
    console.log('fakeConversations:', fakeConversations);

    if (Array.isArray(fakeProfiles)) {
      const online = fakeProfiles.filter(profile => profile.isOnline);
      setOnlineProfiles(online);
    } else {
      console.error('fakeProfiles is not an array:', fakeProfiles);
    }

    if (Array.isArray(fakeConversations)) {
      setConversations(fakeConversations);
    } else {
      console.error('fakeConversations is not an array:', fakeConversations);
    }
  }, []);

  const renderOnlineProfile = ({ item }: { item: Profile }) => (
    <TouchableOpacity style={styles.onlineProfileItem} onPress={() => navigation.navigate('UserProfile', { userId: item.id })}>
      <View style={styles.onlineProfileImageContainer}>
        <Image source={{ uri: item.images[0] }} style={styles.onlineProfileImage} />
        <View style={styles.onlineIndicator} />
      </View>
      <Text style={styles.onlineProfileName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderConversationItem = ({ item }: { item: Conversation }) => (
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
          {item.messages[item.messages.length - 1]?.text || "Pas de messages"}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Messages</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={onlineProfiles}
        renderItem={renderOnlineProfile}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.onlineProfilesList}
        ListEmptyComponent={() => <Text style={styles.emptyListText}>Aucun profil en ligne</Text>}
      />
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        style={styles.conversationsList}
        ListEmptyComponent={() => <Text style={styles.emptyListText}>Aucune conversation</Text>}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  onlineProfilesList: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  onlineProfileItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 60,
  },
  onlineProfileImageContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  onlineProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineProfileName: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    borderColor: '#000000',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#999',
  },
  unreadBadge: {
    backgroundColor: '#E50914',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyListText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});