export interface QuizQuestion {
    question: string;
    answers: string[];
    correctAnswer: number;
  }
  
  export interface QuizState {
    questionIndex: number;
    score: number;
    isFinished: boolean;
  }