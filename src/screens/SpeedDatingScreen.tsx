import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const SpeedDatingScreen = () => {
  const navigation = useNavigation();
  const [upcomingSessions, setUpcomingSessions] = useState([
    { id: '1', theme: '🎬 Cinéphiles', date: '15 Juin', time: '20:00' },
    { id: '2', theme: '✈️ Voyageurs', date: '18 Juin', time: '19:30' },
    { id: '3', theme: '👨‍🍳 Cuisine', date: '22 Juin', time: '20:30' },
    { id: '4', theme: '🎮 Jeux Vidéo', date: '25 Juin', time: '21:00' },
  ]);

  const renderSessionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.sessionCard}
      onPress={() => navigation.navigate('SpeedDatingRoom', { sessionId: item.id })}
    >
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTheme}>{item.theme}</Text>
        <Text style={styles.sessionDateTime}>{item.date} à {item.time}</Text>
      </View>
      <Feather name="chevron-right" size={24} color="#E50914" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#E50914', '#141414']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Sessions Speed Dating</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Sessions à venir</Text>
        <FlatList
          data={upcomingSessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.sessionList}
        />
      </View>

      <TouchableOpacity 
        style={styles.buyMoreButton}
        onPress={() => navigation.navigate('BuySpeedDatingSessions')}
      >
        <Text style={styles.buyMoreButtonText}>Acheter plus de sessions</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  sessionList: {
    flexGrow: 1,
  },
  sessionCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTheme: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  sessionDateTime: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  buyMoreButton: {
    backgroundColor: '#E50914',
    borderRadius: 25,
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  buyMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SpeedDatingScreen;