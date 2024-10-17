import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedBoost, setSelectedBoost] = useState(null);
  const [selectedSpeedDating, setSelectedSpeedDating] = useState(null);

  const subscriptionPlans = [
    { id: 1, name: 'Mensuel', price: '9,99€/mois' },
    { id: 2, name: 'Pack 3 mois', price: '24,99€' },
    { id: 3, name: 'Pack annuel', price: '89,99€' },
  ];

  const boostOptions = [
    { id: 1, name: 'Unitaire', price: '4,99€' },
    { id: 2, name: 'Pack de 5', price: '19,99€' },
    { id: 3, name: 'Pack de 10', price: '34,99€' },
  ];

  const speedDatingOptions = [
    { id: 1, name: 'Unitaire', price: '7,99€' },
    { id: 2, name: 'Pack de 3', price: '19,99€' },
    { id: 3, name: 'Pack de 5', price: '29,99€' },
  ];

  const renderOption = (item, selectedItem, setSelectedItem, icon) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.optionCard, selectedItem === item.id && styles.selectedOption]}
      onPress={() => setSelectedItem(item.id)}
    >
      <Feather name={icon} size={24} color="#E50914" />
      <Text style={styles.optionName}>{item.name}</Text>
      <Text style={styles.optionPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <LinearGradient colors={['#E50914', '#141414']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Abonnements & Options</Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abonnements Premium</Text>
          <View style={styles.optionsContainer}>
            {subscriptionPlans.map(plan => renderOption(plan, selectedPlan, setSelectedPlan, 'star'))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Boosts</Text>
          <View style={styles.optionsContainer}>
            {boostOptions.map(boost => renderOption(boost, selectedBoost, setSelectedBoost, 'zap'))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sessions de Speed Dating</Text>
          <View style={styles.optionsContainer}>
            {speedDatingOptions.map(session => renderOption(session, selectedSpeedDating, setSelectedSpeedDating, 'users'))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.speedDatingButton}
            onPress={() => navigation.navigate('SpeedDating')}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} 
              style={styles.speedDatingImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.speedDatingGradient}
            >
              <Text style={styles.speedDatingText}>Découvrir les Speed Dating</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.subscribeButton}
          onPress={() => {
            // Implement subscription logic here
            console.log('Subscription:', selectedPlan);
            console.log('Boost:', selectedBoost);
            console.log('Speed Dating:', selectedSpeedDating);
          }}
        >
          <Text style={styles.subscribeButtonText}>Valider la sélection</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  optionCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '30%',
    marginBottom: 15,
  },
  selectedOption: {
    borderColor: '#E50914',
    borderWidth: 2,
  },
  optionName: {
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  optionPrice: {
    color: '#E50914',
    fontWeight: 'bold',
  },
  speedDatingButton: {
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    overflow: 'hidden',
  },
  speedDatingImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  speedDatingGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  speedDatingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subscribeButton: {
    backgroundColor: '#E50914',
    borderRadius: 25,
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SubscriptionScreen;