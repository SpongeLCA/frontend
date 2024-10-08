import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import HomeScreen from '../screens/HomeScreen';
// Importez ici les autres écrans de votre application

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [isProfileCreated, setIsProfileCreated] = useState<boolean | null>(null);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      setIsProfileCreated(profileData !== null);
    } catch (error) {
      console.error('Erreur lors de la vérification du profil:', error);
      setIsProfileCreated(false);
    }
  };

  if (isProfileCreated === null) {
    // Vous pouvez afficher un écran de chargement ici si vous le souhaitez
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isProfileCreated ? (
          <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            {/* Ajoutez ici les autres écrans de votre application */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}