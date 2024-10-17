import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Share, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function ActivityDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const [isParticipating, setIsParticipating] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.2, 1, 0.8],
    extrapolate: 'clamp',
  });

  const handleParticipate = () => {
    setIsParticipating(!isParticipating);
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Rejoins-moi pour "${item.title}" sur SpeakDate ! C'est une activité super intéressante pour pratiquer nos langues.`,
      });
      if (result.action === Share.sharedAction) {
        console.log('Shared');
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <BlurView intensity={100} style={StyleSheet.absoluteFill} />
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{item.title}</Text>
          <TouchableOpacity onPress={handleShare}>
            <Feather name="share-2" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{ uri: item.image }}
          style={[styles.activityImage, { transform: [{ scale: imageScale }] }]}
        />
        <LinearGradient
          colors={['transparent', 'rgba(20, 20, 20, 0.8)', '#141414']}
          style={styles.imageOverlay}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          {item.location && (
            <View style={styles.locationContainer}>
              <Feather name="map-pin" size={20} color="#E50914" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          )}

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Feather name="calendar" size={20} color="#E50914" />
              <Text style={styles.infoText}>Date: 15 Juin 2023</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="clock" size={20} color="#E50914" />
              <Text style={styles.infoText}>Heure: 19:00 - 22:00</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="users" size={20} color="#E50914" />
              <Text style={styles.infoText}>Participants: 12/20</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.participateButton, isParticipating && styles.participatingButton]}
            onPress={handleParticipate}
          >
            <Text style={styles.participateButtonText}>
              {isParticipating ? 'Annuler la participation' : 'Participer'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flexShrink: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  activityImage: {
    width: width,
    height: 400,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
    lineHeight: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 31, 31, 0.8)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: 'rgba(31, 31, 31, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    fontWeight: '500',
  },
  participateButton: {
    backgroundColor: '#E50914',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  participatingButton: {
    backgroundColor: '#444',
  },
  participateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
});