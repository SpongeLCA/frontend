import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@react-navigation/native'; // Import ThemeProvider from react-navigation

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import CreateProfileScreen from './src/screens/CreateProfileScreen';
import MatchingScreen from './src/screens/MatchingScreen';
import MessagingScreen from './src/screens/MessagingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import ConversationScreen from './src/screens/ConversationScreen';

const Stack = createStackNavigator();

// Define a basic theme
const MyTheme = {
  dark: true,
  colors: {
    primary: '#E50914',
    background: '#000000',
    card: '#121212',
    text: '#FFFFFF',
    border: '#272729',
    notification: '#E50914',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={MyTheme}>
        <NavigationContainer theme={MyTheme}>
          <StatusBar style="light" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#000' },
            }}
          >
            <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Matching" component={MatchingScreen} />
            <Stack.Screen name="Messaging" component={MessagingScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="Conversation" component={ConversationScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}