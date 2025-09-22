// AI Interview Coach Service
// This service evaluates user answers and provides detailed explanations

import { evaluateAnswer, getExplanation, getNextQuestion } from './llmService.js';

// Main function that implements the AI Interview Coach functionality
export const processInterviewResponse = async (input) => {
  const { subject, userAnswer, currentQuestion, currentIndex = 0 } = input;
  
  // Validate inputs
  if (!subject) {
    throw new Error("Subject is required");
  }
  
  if (!currentQuestion) {
    throw new Error("Current question is required");
  }
  
  if (userAnswer === undefined || userAnswer === null) {
    throw new Error("User answer is required");
  }
  
  // Evaluate the user's answer
  let evaluation;
  try {
    evaluation = await evaluateAnswer(subject, currentQuestion, userAnswer);
  } catch (error) {
    // If evaluation fails, provide a default response
    evaluation = {
      score: 0,
      feedback: "It's ok, I will explain the concept clearly"
    };
  }
  
  // Get detailed explanation if needed
  let explanation = null;
  if (evaluation.score < 7 || evaluation.score === 0) {
    try {
      explanation = getExplanation(subject, currentQuestion);
    } catch (error) {
      explanation = "I don't have a detailed explanation for this question yet.";
    }
  }
  
  // Generate next question
  let nextQuestion;
  try {
    nextQuestion = await getNextQuestion(subject, currentIndex + 1);
  } catch (error) {
    // Default questions if dynamic generation fails
    const defaultQuestions = {
      Python: "Explain Python decorators.",
      SQL: "Explain the use of indexes in SQL.",
      Networking: "What is the difference between TCP and UDP?",
      HR: "What are your strengths and weaknesses?"
    };
    
    nextQuestion = defaultQuestions[subject] || "Tell me about yourself.";
  }
  
  // Return JSON response as specified
  return {
    evaluation: evaluation,
    explanation: explanation,
    nextQuestion: nextQuestion
  };
};

export default {
  processInterviewResponse
};
