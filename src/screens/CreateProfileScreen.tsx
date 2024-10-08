import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Switch, 
  Animated, 
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const questions = [
  { id: 'name', question: "Comment t'appelles-tu ?", type: 'text' },
  { id: 'age', question: "Quel âge as-tu ?", type: 'number' },
  { id: 'bio', question: "Parle-nous un peu de toi", type: 'textarea' },
  { id: 'language', question: "Quelle est ta langue maternelle ?", type: 'text' },
  { id: 'interests', question: "Quels sont tes centres d'intérêt ?", type: 'text' },
];

const premiumFeatures = [
  "Visibilité accrue de ton profil",
  "Messages illimités",
  "Voir qui t'a liké",
  "Filtres de recherche avancés",
  "Mode incognito",
];

export default function CreateProfileScreen() {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isPremium, setIsPremium] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  const handleAnswer = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const nextStep = async () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
      fadeAnim.setValue(0);
    } else {
      const profileData = { ...answers, isPremium };
      try {
        await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du profil:', error);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      fadeAnim.setValue(0);
    }
  };

  const renderQuestion = () => {
    if (currentStep === questions.length) {
      return renderPremiumOffer();
    }

    const { id, question, type } = questions[currentStep];
    return (
      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
        <Text style={styles.question}>{question}</Text>
        {type === 'textarea' ? (
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={answers[id] || ''}
            onChangeText={(text) => handleAnswer(id, text)}
            placeholder="Écris ici..."
            placeholderTextColor="#888"
          />
        ) : (
          <TextInput
            style={styles.input}
            value={answers[id] || ''}
            onChangeText={(text) => handleAnswer(id, text)}
            keyboardType={type === 'number' ? 'numeric' : 'default'}
            placeholder="Ta réponse..."
            placeholderTextColor="#888"
          />
        )}
      </Animated.View>
    );
  };

  const renderPremiumOffer = () => {
    return (
      <Animated.View style={[styles.premiumContainer, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={['#E50914', '#B20710']}
          style={styles.premiumGradient}
        >
          <Text style={styles.premiumTitle}>Deviens membre Premium !</Text>
          <Text style={styles.premiumSubtitle}>Profite de nombreux avantages :</Text>
          {premiumFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Feather name="check" size={20} color="#FFFFFF" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
          <View style={styles.pricingContainer}>
            <Text style={styles.pricingText}>Seulement 9,99€/mois</Text>
            <Text style={styles.discountText}>Offre spéciale : -50% le premier mois !</Text>
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Activer l'abonnement Premium</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#E50914" }}
              thumbColor={isPremium ? "#FFFFFF" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setIsPremium}
              value={isPremium}
            />
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Feather name="message-circle" size={60} color="#E50914" />
          </View>
          <Text style={styles.title}>Crée ton profil</Text>
          <Text style={styles.subtitle}>Étape {currentStep + 1} sur {questions.length + 1}</Text>
          {renderQuestion()}
          <View style={styles.buttonContainer}>
            {currentStep > 0 && (
              <TouchableOpacity style={styles.button} onPress={prevStep}>
                <Feather name="arrow-left" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Précédent</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>
                {currentStep === questions.length ? 'Terminer' : 'Suivant'}
              </Text>
              <Feather name="arrow-right" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E50914',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 20,
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 4,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#333',
    borderRadius: 4,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E50914',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  premiumContainer: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  premiumGradient: {
    padding: 20,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  premiumSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
  },
  pricingContainer: {
    marginTop: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  pricingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  discountText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  switchText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});