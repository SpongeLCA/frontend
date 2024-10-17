import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

const darkTheme = {
  dark: true,
  colors: {
    primary: '#E50914',
    background: '#141414',
    card: '#1F1F1F',
    text: '#FFFFFF',
    border: '#2C2C2C',
    notification: '#E50914',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={darkTheme}>
        <StatusBar barStyle="light-content" backgroundColor="#141414" />
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}