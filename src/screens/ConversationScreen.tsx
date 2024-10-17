import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fakeConversations, Conversation, Message } from '../data/fakeMessages';
import { fakeProfiles, Profile } from '../data/fakeProfiles';

type RootStackParamList = {
  Conversation: { conversationId?: string; userId?: string };
};

type ConversationScreenRouteProp = RouteProp<RootStackParamList, 'Conversation'>;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const TypingIndicator = () => {
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));

  useEffect(() => {
    const animateDot = (dot: Animated.Value) => {
      return Animated.sequence([
        Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true })
      ]);
    };

    Animated.loop(
      Animated.stagger(200, [
        animateDot(dot1),
        animateDot(dot2),
        animateDot(dot3)
      ])
    ).start();
  }, [dot1, dot2, dot3]);

  const dotStyle = (animatedValue: Animated.Value) => ({
    opacity: animatedValue,
    transform: [{
      translateY: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -5]
      })
    }]
  });

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.typingDot, dotStyle(dot1)]} />
      <Animated.View style={[styles.typingDot, dotStyle(dot2)]} />
      <Animated.View style={[styles.typingDot, dotStyle(dot3)]} />
    </View>
  );
};

export default function ConversationScreen() {
  const navigation = useNavigation();
  const route = useRoute<ConversationScreenRouteProp>();
  const { conversationId, userId } = route.params || {};
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [fadeAnims, setFadeAnims] = useState<{ [key: string]: Animated.Value }>({});

  useEffect(() => {
    const loadConversation = async () => {
      setIsLoading(true);
      try {
        if (conversationId) {
          const foundConversation = fakeConversations.find(conv => conv.id === conversationId);
          if (foundConversation) {
            setConversation(foundConversation);
            initializeFadeAnims(foundConversation.messages);
          } else {
            throw new Error('Conversation not found');
          }
        } else if (userId) {
          const matchProfile = fakeProfiles.find(profile => profile.id === userId);
          if (matchProfile) {
            const newConversation: Conversation = {
              id: `new-${Date.now()}`,
              matchProfile,
              messages: [],
              unreadCount: 0,
            };
            setConversation(newConversation);
          } else {
            throw new Error('User profile not found');
          }
        } else {
          throw new Error('Invalid navigation parameters');
        }
      } catch (error) {
        console.error(error);
        // Handle the error (e.g., show an error message to the user)
      } finally {
        setIsLoading(false);
      }
    };

    loadConversation();
  }, [conversationId, userId]);

  const initializeFadeAnims = (messages: Message[]) => {
    const newFadeAnims: { [key: string]: Animated.Value } = {};
    messages.forEach((message) => {
      newFadeAnims[message.id] = new Animated.Value(1);
    });
    setFadeAnims(newFadeAnims);
  };

  const sendMessage = (text: string, sender: 'user' | 'match') => {
    if (text.trim() && conversation) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        sender,
        timestamp: new Date(),
      };
      setConversation(prev => ({
        ...prev!,
        messages: [...prev!.messages, newMessage],
      }));
      
      // Create a new fade animation for the new message
      const newFadeAnim = new Animated.Value(0);
      setFadeAnims(prev => ({ ...prev, [newMessage.id]: newFadeAnim }));

      // Trigger fade-in animation for the new message
      Animated.timing(newFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      sendMessage(inputText, 'user');
      setInputText('');
      setIsTyping(true);
      
      // Simulate match typing and responding
      setTimeout(() => {
        setIsTyping(false);
        sendMessage("Je suis ravi(e) de discuter avec vous ! Que pensez-vous de notre match ?", 'match');
      }, 2000);
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const messageStyle = [
      styles.messageBubble,
      item.sender === 'user' ? styles.userMessage : styles.matchMessage,
    ];

    return (
      <Animated.View style={[messageStyle, { opacity: fadeAnims[item.id] || 1 }]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>Chargement de la conversation...</Text>
      </View>
    );
  }

  if (!conversation) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={48} color="#E50914" />
        <Text style={styles.errorText}>Impossible de charger la conversation</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1E1E1E', '#121212']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Image source={{ uri: conversation.matchProfile.images[0] }} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{conversation.matchProfile.name}</Text>
            <Text style={styles.headerStatus}>
              {isTyping ? 'En train d\'écrire...' : (conversation.matchProfile.isOnline ? 'En ligne' : 'Hors ligne')}
            </Text>
          </View>
        </View>
        <AnimatedFlatList
          ref={flatListRef}
          data={conversation.messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={handleInputChange}
            placeholder="Tapez votre message..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
            <Feather name="send" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </LinearGradient>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerStatus: {
    fontSize: 14,
    color: '#999',
  },
  messageList: {
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E50914',
    borderBottomRightRadius: 4,
  },
  matchMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#303030',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  messageTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#303030',
    borderRadius: 20,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E50914',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButtonText: {
    color: '#E50914',
    fontSize: 16,
    fontWeight: 'bold',
  },
  typingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E50914',
    marginHorizontal: 2,
  },
});