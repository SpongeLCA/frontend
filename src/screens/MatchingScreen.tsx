import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, PanResponder, Dimensions, TouchableOpacity, Modal, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { fakeProfiles, Profile, currentUser } from '../data/fakeProfiles';
import { fakeMatches } from '../data/fakeInteractions';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Component() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const position = useRef(new Animated.ValueXY()).current;
  const [speakDateUsed, setSpeakDateUsed] = useState(false);
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const availableProfiles = fakeProfiles.filter(
      profile => !fakeMatches.some(match => match.includes(profile.id))
    );
    setProfiles(availableProfiles);
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
      setShowMatchNotification(true);
      setTimeout(() => setShowMatchNotification(false), 3000);
    });
  };

  const renderUsers = () => {
    if (profiles.length === 0) {
      return (
        <View style={styles.noProfilesContainer}>
          <Text style={styles.noProfilesText}>Aucun profil disponible</Text>
        </View>
      );
    }

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
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={styles.gradient}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}, {item.age}</Text>
              <Text style={styles.language}>{item.languages[0].language} - {item.languages[0].level}</Text>
              <View style={styles.interestsContainer}>
                {item.culturalInterests.slice(0, 3).map((interest, index) => (
                  <View key={index} style={styles.interestBadge}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.viewProfileButton} onPress={() => setShowProfileModal(true)}>
                <Text style={styles.viewProfileButtonText}>Voir le profil</Text>
              </TouchableOpacity>
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
          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            key={item.id}
            style={[{
              transform: [{ scale: nextCardScale }],
            }, styles.animatedCard, styles.nextCard]}
          >
            <Image source={{ uri: item.images[0] }} style={styles.image} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={styles.gradient}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}, {item.age}</Text>
            </View>
          </Animated.View>
        );
      }
    }).reverse();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.headerTitle}>
            <Text style={styles.headerTitleSpeak}>Speak</Text>
            <Text style={styles.headerTitleDate}>Date</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.boostButton, isBoostActive && styles.boostButtonActive]}
          onPress={activateBoost}
        >
          <Feather name="zap" size={24} color={isBoostActive ? "#FFFFFF" : "#E50914"} />
          {isBoostActive && (
            <Text style={styles.boostTimeLeft}>{formatTime(boostTimeLeft)}</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        {renderUsers()}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={swipeLeft} style={styles.actionButton}>
          <Feather name="x" size={30} color="#FF6B6B" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSpeakDate} disabled={speakDateUsed} style={styles.speakDateButton}>
          <Text style={styles.speakDateTextS}>S</Text>
          <Text style={styles.speakDateTextD}>D</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={swipeRight} style={styles.actionButton}>
          <Feather name="heart" size={30} color="#4ECDC4" />
        </TouchableOpacity>
      </View>
      {showMatchNotification && (
        <Animated.View style={styles.matchNotification}>
          <Text style={styles.matchNotificationText}>C'est un match SpeakDate !</Text>
        </Animated.View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showProfileModal}
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            {profiles[currentIndex] && (
              <>
                <Image source={{ uri: profiles[currentIndex].images[0] }} style={styles.modalUserImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(20,20,20,0.8)', '#141414']}
                  style={styles.modalGradient}
                />
                <View style={styles.modalUserInfo}>
                  <Text style={styles.modalUserName}>{profiles[currentIndex].name}, {profiles[currentIndex].age}</Text>
                  <Text style={styles.modalUserLanguage}>
                    {profiles[currentIndex].languages.map(lang => `${lang.language} - ${lang.level}`).join(', ')}
                  </Text>
                  <Text style={styles.modalUserOrigin}>Origine : {profiles[currentIndex].originCountry}</Text>
                  <Text style={styles.modalUserDestination}>Destination : {profiles[currentIndex].destinationCountry}</Text>
                  <Text style={styles.modalSectionTitle}>Intérêts culturels :</Text>
                  <View style={styles.modalInterestsContainer}>
                    {profiles[currentIndex].culturalInterests.map((interest, index) => (
                      <View key={index} style={styles.modalInterestBadge}>
                        <Text style={styles.modalInterestText}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.modalSectionTitle}>Bio :</Text>
                  <Text style={styles.modalUserBio}>{profiles[currentIndex].bio}</Text>
                </View>
              </>
            )}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowProfileModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerTitleSpeak: {
    color: '#FFFFFF',
  },
  headerTitleDate: {
    color: '#E50914',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent:  'center',
  },
  animatedCard: {
    height: SCREEN_HEIGHT - 220,
    width: SCREEN_WIDTH - 40,
    padding: 10,
    position: 'absolute',
    borderRadius: 20,
    backgroundColor: '#141414',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  nextCard: {
    top: 10,
    zIndex: -1,
  },
  image: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  language: {
    fontSize: 18,
    color: '#E50914',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  interestBadge: {
    backgroundColor: 'rgba(229, 9, 20, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  interestText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  viewProfileButton: {
    backgroundColor: '#E50914',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  viewProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  speakDateButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  boostButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boostButtonActive: {
    backgroundColor: '#E50914',
  },
  boostTimeLeft: {
    color: '#FFFFFF',
    fontSize: 10,
    position: 'absolute',
    bottom: 5,
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
    transform: [{rotate: '-30deg'}],
  },
  dislikeText: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    color: '#FF6B6B',
    fontSize: 32,
    fontWeight: '800',
    padding: 10,
    transform: [{rotate: '30deg'}],
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
  matchNotification: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(229, 9, 20, 0.9)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  matchNotificationText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#141414',
  },
  modalUserImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  modalGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
  },
  modalUserInfo: {
    padding: 20,
  },
  modalUserName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  modalUserLanguage: {
    fontSize: 18,
    color: '#E50914',
    marginBottom: 10,
  },
  modalUserOrigin: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 5,
  },
  modalUserDestination: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 15,
  },
  modalSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 5,
  },
  modalInterestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  modalInterestBadge: {
    backgroundColor: 'rgba(229, 9, 20, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  modalInterestText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  modalUserBio: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
    lineHeight: 24,
  },
  closeModalButton: {
    backgroundColor: '#E50914',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 20,
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noProfilesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProfilesText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});