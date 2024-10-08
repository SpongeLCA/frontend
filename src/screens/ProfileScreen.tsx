import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { fakeProfiles, Profile } from '../data/fakeProfiles';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);

  useEffect(() => {
    // For demonstration, we'll use the first profile from fakeProfiles
    setProfile(fakeProfiles[0]);
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
    // In a real app, this would navigate to an edit profile screen
    console.log("Editing profile...");
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In a real app, this would save the profile changes
    console.log("Saving profile changes...");
  };

  const toggleOnlineStatus = () => {
    setShowOnlineStatus(prevStatus => !prevStatus);
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={isEditing ? handleSaveProfile : handleEditProfile}>
            <Text style={styles.editButton}>{isEditing ? "Save" : "Edit"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeader}>
          <Image source={{ uri: profile.images[0] }} style={styles.profileImage} />
          <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
          <Text style={styles.profileLocation}>{profile.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.sectionContent}>{profile.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          {profile.languages.map((lang, index) => (
            <Text key={index} style={styles.languageItem}>
              {lang.language}: {lang.level}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {profile.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Show Online Status</Text>
            <Switch
              value={showOnlineStatus}
              onValueChange={toggleOnlineStatus}
              trackColor={{ false: "#767577", true: "#E50914" }}
              thumbColor={showOnlineStatus ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>
        </View>

        {profile.isPremium && (
          <View style={styles.premiumBadge}>
            <Feather name="star" size={16} color="#FFD700" />
            <Text style={styles.premiumText}>Premium Member</Text>
          </View>
        )}
      </ScrollView>
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
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    color: '#E50914',
    fontSize: 16,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  profileLocation: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  languageItem: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 5,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#E50914',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  interestText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 20,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
});