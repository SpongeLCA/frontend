import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { allMatches, isConversation, Conversation, Profile } from '../data/fakeMessages';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function NewMessageScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState(allMatches);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchBarAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSearchFocus = useCallback((focused: boolean) => {
    Animated.spring(searchBarAnim, {
      toValue: focused ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, []);

  const filteredItems = searchQuery
    ? items.filter(item => {
        const name = isConversation(item) ? item.matchProfile.name : item.name;
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : items;

  const renderItem = useCallback(({ item }: { item: Conversation | Profile }) => {
    const translateY = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    const opacity = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const handlePress = () => {
      if (isConversation(item)) {
        navigation.navigate('Conversation', { conversationId: item.id });
      } else {
        // Créer une nouvelle conversation
        const newConversation: Conversation = {
          id: `new-${Date.now()}`,
          matchProfile: item,
          messages: [],
          unreadCount: 0,
        };
        setItems(prevItems => [newConversation, ...prevItems.filter(i => i !== item)]);
        navigation.navigate('Conversation', { conversationId: newConversation.id });
      }
    };

    const profile = isConversation(item) ? item.matchProfile : item;

    return (
      <Animated.View
        style={{
          opacity,
          transform: [{ translateY }],
        }}
      >
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={handlePress}
        >
          <Image source={{ uri: profile.images[0] }} style={styles.avatar} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{profile.name}</Text>
            <Text style={styles.itemSubtext}>
              {isConversation(item) 
                ? (item.messages[item.messages.length - 1]?.text || "Pas de messages")
                : "Démarrer une conversation"
              }
            </Text>
          </View>
          {profile.isOnline && <View style={styles.onlineIndicator} />}
          {!isConversation(item) && (
            <View style={styles.newMatchBadge}>
              <Text style={styles.newMatchText}>Nouveau</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }, [navigation, fadeAnim]);

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
          <View style={{ width: 24 }} />
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
            placeholder="Rechercher dans vos matchs et conversations"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => handleSearchFocus(true)}
            onBlur={() => handleSearchFocus(false)}
          />
        </Animated.View>
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => isConversation(item) ? item.id : item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <BlurView intensity={100} tint="dark" style={styles.emptyContainer}>
              <Feather name="users" size={48} color="#666" />
              <Text style={styles.emptyText}>Aucun match ou conversation</Text>
            </BlurView>
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
    paddingTop: Platform.OS === 'android' ? 25 : 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    marginVertical: 16,
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#121212',
  },
  newMatchBadge: {
    backgroundColor: '#E50914',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  newMatchText: {
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
    marginTop: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});