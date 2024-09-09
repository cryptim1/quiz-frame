'use client';

import React, { useState, useEffect } from 'react';
import { questions } from '../data/questions';
import { QuizState } from '../types/quiz';

export default function Frame() {
  const [state, setState] = useState<QuizState>({
    questionIndex: 0,
    score: 0,
    isFinished: false,
  });

  const currentQuestion = questions[state.questionIndex];

  useEffect(() => {
    // This effect will run on component mount to set up the initial frame state
    // You can add any initialization logic here if needed
  }, []);

  const handleAnswer = async (choice: number) => {
    try {
      const response = await fetch('/api/frame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionIndex: state.questionIndex,
          choice,
          score: state.score,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const newState: QuizState = await response.json();
      setState(newState);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const renderQuestion = () => (
    <>
      <h2>Question {state.questionIndex + 1}</h2>
      <p>{currentQuestion.question}</p>
      <div className="answers">
        {currentQuestion.answers.map((answer, index) => (
          <button key={index} onClick={() => handleAnswer(index)}>
            {answer}
          </button>
        ))}
      </div>
    </>
  );

  const renderResult = () => (
    <div className="result">
      <h2>Quiz Completed!</h2>
      <p>Your Final Score: {state.score}/5</p>
      <p>
        {state.score >= 4
          ? "Congratulations! You are smarter than a 5th grader!"
          : "Oops! You are not smarter than a 5th grader."}
      </p>
    </div>
  );

  return (
    <div className="frame chalkboard">
      <h1>Are You Smarter Than a 5th Grader?</h1>
      {state.isFinished ? renderResult() : renderQuestion()}
    </div>
  );
}