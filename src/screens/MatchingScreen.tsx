import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, PanResponder, Dimensions, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { fakeProfiles, Profile } from '../data/fakeProfiles';
import { useNavigation } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function MatchingScreen() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const position = useRef(new Animated.ValueXY()).current;
  const [speakDateUsed, setSpeakDateUsed] = useState(false);
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [showSpeakDateMessage, setShowSpeakDateMessage] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const profilsMisAJour = fakeProfiles.map(profile => ({
      ...profile,
      isOnline: Math.random() < 0.5
    }));
    setProfiles(profilsMisAJour);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBoostActive && boostTimeLeft > 0) {
      interval = setInterval(() => {
        setBoostTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (boostTimeLeft === 0) {
      setIsBoostActive(false);
    }
    return () => clearInterval(interval);
  }, [isBoostActive, boostTimeLeft]);

  const activateBoost = () => {
    setIsBoostActive(true);
    setBoostTimeLeft(30 * 60); // 30 minutes
    setShowBoostModal(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  });

  const rotateAndTranslate = {
    transform: [{
      rotate: rotate
    },
    ...position.getTranslateTransform()
    ]
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp'
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp'
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp'
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy });
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy < -120 && !speakDateUsed) {
        handleSpeakDate();
      } else if (gestureState.dx > 120) {
        swipeRight();
      } else if (gestureState.dx < -120) {
        swipeLeft();
      } else {
        resetPosition();
      }
    }
  });

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: true
    }).start();
  };

  const handleSpeakDate = () => {
    setSpeakDateUsed(true);
    Animated.timing(position, {
      toValue: { x: 0, y: -SCREEN_HEIGHT - 100 },
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      console.log("SpeakDate envoyé !");
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
      setSpeakDateUsed(false);
      displaySpeakDateMessage();
    });
  };
  
  const displaySpeakDateMessage = () => {
    setShowSpeakDateMessage(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowSpeakDateMessage(false));
  };

  const renderUsers = () => {
    return profiles.map((item, i) => {
      if (i < currentIndex) {
        return null;
      } else if (i === currentIndex) {
        return (
          <Animated.View
            {...panResponder.panHandlers}
            key={item.id}
            style={[rotateAndTranslate, styles.animatedCard]}
          >
            <Animated.View style={[styles.likeContainer, { opacity: likeOpacity }]}>
              <Text style={styles.likeText}>J'AIME</Text>
            </Animated.View>
            <Animated.View style={[styles.dislikeContainer, { opacity: dislikeOpacity }]}>
              <Text style={styles.dislikeText}>PASSER</Text>
            </Animated.View>
            <Image source={{ uri: item.images[0] }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}, {item.age}</Text>
              <Text style={styles.language}>{item.languages[0].language} - {item.languages[0].level}</Text>
              <Text style={styles.bio}>{item.bio}</Text>
            </View>
            {item.isPremium && (
              <View style={styles.premiumBadge}>
                <Feather name="star" size={16} color="#FFD700" />
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
            {item.isOnline && (
              <View style={styles.onlineIndicator}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>En ligne</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => setSelectedProfile(item)}
            >
              <View style={styles.infoCircle}>
                <Feather name="info" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            key={item.id}
            style={[{
              opacity: nextCardOpacity,
              transform: [{ scale: nextCardScale }],
            }, styles.animatedCard]}
          >
            <Image source={{ uri: item.images[0] }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}, {item.age}</Text>
              <Text style={styles.language}>{item.languages[0].language} - {item.languages[0].level}</Text>
              <Text style={styles.bio}>{item.bio}</Text>
            </View>
            {item.isPremium && (
              <View style={styles.premiumBadge}>
                <Feather name="star" size={16} color="#FFD700" />
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
            {item.isOnline && (
              <View style={styles.onlineIndicator}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>En ligne</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => setSelectedProfile(item)}
            >
              <View style={styles.infoCircle}>
                <Feather name="info" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        );
      }
    }).reverse();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Découvrir</Text>
        <TouchableOpacity
          style={[styles.boostButton, isBoostActive && styles.boostButtonActive]}
          onPress={activateBoost}
        >
          <Feather name="zap" size={24} color="#E50914" />
          {isBoostActive && (
            <Text style={styles.boostTimeLeft}>{formatTime(boostTimeLeft)}</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        {renderUsers()}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={swipeLeft}>
          <Feather name="x" size={30} color="#FF6B6B" style={styles.button} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSpeakDate} disabled={speakDateUsed}>
          <View style={[styles.speakDateButton, speakDateUsed && styles.speakDateButtonDisabled]}>
            <Text style={styles.speakDateTextS}>S</Text>
            <Text style={styles.speakDateTextD}>D</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={swipeRight}>
          <Feather name="heart" size={30} color="#4ECDC4" style={styles.button} />
        </TouchableOpacity>
      </View>

      {showSpeakDateMessage && (
        <Animated.View style={[styles.speakDateMessage, { opacity: fadeAnim }]}>
          <Text style={styles.speakDateMessageText}>SpeakDate envoyé !</Text>
        </Animated.View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showBoostModal}
        onRequestClose={() => setShowBoostModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Feather name="zap" size={50} color="#E50914" />
            <Text style={styles.modalTitle}>Boost activé !</Text>
            <Text style={styles.modalText}>
              Ton profil est maintenant mis en avant pour les 30 prochaines minutes.
              Profites-en pour trouver plus de partenaires linguistiques !
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowBoostModal(false)}
            >
              <Text style={styles.modalButtonText}>Compris</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedProfile}
        onRequestClose={() => setSelectedProfile(null)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.profileModalContent}>
            {selectedProfile && (
              <>
                <Image source={{ uri: selectedProfile.images[0] }} style={styles.profileModalImage} />
                <View style={styles.profileModalInfo}>
                  <Text style={styles.profileModalName}>{selectedProfile.name}, {selectedProfile.age}</Text>
                  {selectedProfile.isOnline && (
                    <View style={styles.profileModalOnlineIndicator}>
                      <View style={styles.onlineDot} />
                      <Text style={styles.onlineText}>En ligne</Text>
                    </View>
                  )}
                  <Text style={styles.profileModalLanguage}>
                    {selectedProfile.languages.map(lang => `${lang.language} - ${lang.level}`).join(', ')}
                  </Text>
                  <Text style={styles.profileModalBio}>{selectedProfile.bio}</Text>
                  <Text style={styles.profileModalInterests}>Intérêts : {selectedProfile.interests.join(', ')}</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeProfileButton}
                  onPress={() => setSelectedProfile(null)}
                >
                  <Text style={styles.closeProfileButtonText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles =   StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  boostButton: {
    backgroundColor: '#141414',
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boostButtonActive: {
    backgroundColor: '#141414',
  },
  boostTimeLeft: {
    color: '#E50914',
    marginLeft: 5,
    fontSize: 12,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedCard: {
    height: SCREEN_HEIGHT - 200,
    width: SCREEN_WIDTH - 40,
    padding: 10,
    position: 'absolute',
    borderRadius: 20,
    backgroundColor: '#141414',
  },
  image: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  language: {
    fontSize: 18,
    color: '#E50914',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    padding: 20,
    backgroundColor: '#141414',
    borderRadius: 30,
  },
  likeContainer: {
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 1000,
  },
  dislikeContainer: {
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 1000,
  },
  likeText: {
    borderWidth: 1,
    borderColor: '#4ECDC4',
    color: '#4ECDC4',
    fontSize: 32,
    fontWeight: '800',
    padding: 10,
  },
  dislikeText: {
    borderWidth:  1,
    borderColor: '#FF6B6B',
    color: '#FF6B6B',
    fontSize: 32,
    fontWeight: '800',
    padding: 10,
  },
  speakDateButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  speakDateButtonDisabled: {
    opacity: 0.5,
  },
  speakDateTextS: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  speakDateTextD: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E50914',
  },
  speakDateMessage: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    paddingVertical: 10,
  },
  speakDateMessageText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#141414',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#E50914',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  onlineText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 1000,
  },
  infoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(229, 9, 20, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModalContent: {
    backgroundColor: '#141414',
    borderRadius: 20,
    padding: 20,
    width: SCREEN_WIDTH - 40,
    maxHeight: SCREEN_HEIGHT - 100,
  },
  profileModalImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
  },
  profileModalInfo: {
    marginBottom: 20,
  },
  profileModalName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  profileModalOnlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileModalLanguage: {
    fontSize: 18,
    color: '#E50914',
    marginBottom: 10,
  },
  profileModalBio: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 10,
  },
  profileModalInterests: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  closeProfileButton: {
    backgroundColor: '#E50914',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  closeProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});