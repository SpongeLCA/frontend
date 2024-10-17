import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const settingsOptions = [
    { title: 'Account', icon: 'user' },
    { title: 'Notifications', icon: 'bell' },
    { title: 'Privacy', icon: 'lock' },
    { title: 'Language', icon: 'globe' },
    { title: 'Help & Support', icon: 'help-circle' },
    { title: 'About', icon: 'info' },
  ];

  const renderSettingItem = (title: string, icon: string) => (
    <TouchableOpacity style={styles.settingItem} key={title}>
      <Feather name={icon} size={24} color="#FFFFFF" style={styles.settingIcon} />
      <Text style={styles.settingText}>{title}</Text>
      <Feather name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        {settingsOptions.map(option => renderSettingItem(option.title, option.icon))}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
});