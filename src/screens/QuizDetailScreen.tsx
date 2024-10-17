import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Quel réalisateur est connu pour ses films "La Haine" et "Samba" ?',
    options: ['Mathieu Kassovitz', 'Luc Besson', 'Jean-Pierre Jeunet', 'François Ozon'],
    correctAnswer: 'Mathieu Kassovitz',
  },
  {
    id: '2',
    question: 'Quel film a remporté la Palme d\'Or au Festival de Cannes en 2021 ?',
    options: ['Titane', 'Parasite', 'The Square', 'La Vie d\'Adèle'],
    correctAnswer: 'Titane',
  },
  {
    id: '3',
    question: 'Qui a joué le rôle principal dans le film "Amélie" ?',
    options: ['Audrey Tautou', 'Marion Cotillard', 'Juliette Binoche', 'Léa Seydoux'],
    correctAnswer: 'Audrey Tautou',
  },
];

export default function QuizDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{item.title}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        <Image source={{ uri: item.image }} style={styles.quizImage} />
        <Text style={styles.description}>{item.description}</Text>
        {!quizCompleted ? (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{quizQuestions[currentQuestionIndex].question}</Text>
            {quizQuestions[currentQuestionIndex].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && styles.selectedOptionButton,
                ]}
                onPress={() => handleAnswerSelection(option)}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswer === option && styles.selectedOptionText,
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.nextButton, !selectedAnswer && styles.disabledButton]}
              onPress={handleNextQuestion}
              disabled={!selectedAnswer}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex === quizQuestions.length - 1 ? 'Terminer' : 'Question suivante'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Quiz terminé !</Text>
            <Text style={styles.scoreText}>Votre score : {score}/{quizQuestions.length}</Text>
            <TouchableOpacity
              style={styles.restartButton}
              onPress={() => {
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setScore(0);
                setQuizCompleted(false);
              }}
            >
              <Text style={styles.restartButtonText}>Recommencer le quiz</Text>
            </TouchableOpacity>
          </View>
        )}
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
    padding: 16,
  },
  quizImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 24,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedOptionButton: {
    backgroundColor: '#E50914',
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#E50914',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 24,
  },
  restartButton: {
    backgroundColor: '#E50914',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  restartButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});