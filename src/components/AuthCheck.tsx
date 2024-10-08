import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AuthCheck = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      if (profileData !== null) {
        setHasProfile(true);
      } else {
        navigation.navigate('CreateProfile');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du profil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return hasProfile ? children : null;
};

export default AuthCheck;