import { QuizQuestion } from '../types/quiz.js';

export const questions: QuizQuestion[] = [
  {
    question: "What is the capital of France?",
    answers: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2  // This is correct (Paris is at index 2)
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1  // This is correct (Mars is at index 1)
  },
  {
    question: "What is the largest mammal in the world?",
    answers: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1  // This is correct (Blue Whale is at index 1)
  },
  {
    question: "How many continents are there on Earth?",
    answers: ["5", "6", "7", "8"],
    correctAnswer: 2  // This is correct (7 is at index 2)
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: ["Ag", "Au", "Fe", "Cu"],
    correctAnswer: 1  // This is correct (Au is at index 1)
  }
];