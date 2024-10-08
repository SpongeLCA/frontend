import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { fakeConversations, Conversation, Message } from '../data/fakeMessages';

export default function MessagingScreen() {
  const [conversations, setConversations] = useState<Conversation[]>(fakeConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (flatListRef.current && selectedConversation) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, messages: [...conv.messages, message], unreadCount: 0 }
          : conv
      )
    );

    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      unreadCount: 0,
    } : null);

    setNewMessage('');
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => setSelectedConversation(item)}
    >
      <Image source={{ uri: item.matchProfile.images[0] }} style={styles.avatar} />
      <View style={styles.conversationInfo}>
        <Text style={styles.conversationName}>{item.matchProfile.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.messages[item.messages.length - 1].text}
        </Text>
      </View>
      {item.matchProfile.isOnline && (
        <View style={styles.onlineIndicator} />
      )}
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.matchMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTimestamp}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {!selectedConversation ? (
        <View style={styles.conversationList}>
          <Text style={styles.title}>Messages</Text>
          <FlatList
            data={conversations}
            renderItem={renderConversationItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedConversation(null)}>
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Image source={{ uri: selectedConversation.matchProfile.images[0] }} style={styles.chatHeaderAvatar} />
            <Text style={styles.chatHeaderTitle}>{selectedConversation.matchProfile.name}</Text>
            {selectedConversation.matchProfile.isOnline && (
              <View style={styles.chatHeaderOnlineIndicator} />
            )}
          </View>
          <FlatList
            ref={flatListRef}
            data={selectedConversation.messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Tapez votre message..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Feather name="send" size={24} color="#E50914" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  conversationList: {
    flex: 1,
    paddingTop: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#999',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 10,
    right: 20,
    borderWidth: 2,
    borderColor: '#000000',
  },
  unreadBadge: {
    backgroundColor: '#E50914',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 15,
    marginRight: 10,
  },
  chatHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  chatHeaderOnlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginLeft: 10,
  },
  messageList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E50914',
  },
  matchMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  messageTimestamp: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#FFFFFF',
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
  },
});