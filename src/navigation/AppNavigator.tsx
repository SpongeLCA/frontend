import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

// Import all screens
import CreateProfileScreen from '../screens/CreateProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import SpeedDatingScreen from '../screens/SpeedDatingScreen';
import MessagingScreen from '../screens/MessagingScreen';
import ConversationScreen from '../screens/ConversationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MatchingScreen from '../screens/MatchingScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import NewMessageScreen from '../screens/NewMessageScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import LearningScreen from '../screens/LearningScreen';
import QuizDetailScreen from '../screens/QuizDetailScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [isProfileCreated, setIsProfileCreated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#141414' }}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#141414' },
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
          overlayStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
              extrapolate: 'clamp',
            }),
          },
        }),
      }}>
        {isProfileCreated === false ? (
          <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} />
            <Stack.Screen name="SpeedDating" component={SpeedDatingScreen} />
            <Stack.Screen name="Messaging" component={MessagingScreen} />
            <Stack.Screen name="Conversation" component={ConversationScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Matching" component={MatchingScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="NewMessage" component={NewMessageScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Learning" component={LearningScreen} />
            <Stack.Screen name="QuizDetail" component={QuizDetailScreen} />
            <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}