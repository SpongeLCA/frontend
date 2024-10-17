import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

type Notification = {
  id: string;
  title: string;
  description: string;
  read: boolean;
  timestamp: string;
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Match!',
    description: 'You have a new match with Sarah. Start a conversation now!',
    read: false,
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    title: 'Message Received',
    description: 'John sent you a new message. Check it out!',
    read: true,
    timestamp: 'Yesterday',
  },
  {
    id: '3',
    title: 'Profile Viewed',
    description: 'Your profile was viewed by 5 new people today.',
    read: false,
    timestamp: '3 days ago',
  },
];

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const toggleNotificationRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: !notification.read } : notification
      )
    );
  };

  const filteredNotifications = showUnreadOnly
    ? notifications.filter(notification => !notification.read)
    : notifications;

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, item.read && styles.readNotification]}
      onPress={() => toggleNotificationRead(item.id)}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
        <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
      </View>
      {!item.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Show unread only</Text>
        <Switch
          value={showUnreadOnly}
          onValueChange={setShowUnreadOnly}
          trackColor={{ false: "#767577", true: "#E50914" }}
          thumbColor={showUnreadOnly ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        style={styles.notificationsList}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>No notifications to display</Text>
        )}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  readNotification: {
    opacity: 0.6,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E50914',
    marginLeft: 8,
  },
  emptyListText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});