import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import SubjectSelector from './components/SubjectSelector'
import QuestionArea from './components/QuestionArea'
import ChatBox from './components/ChatBox'
import ProgressTracker from './components/ProgressTracker'
import { getNextQuestion, evaluateAnswer, continueInterview } from './services/llmService'

const App = () => {
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [questionCount, setQuestionCount] = useState({ attempted: 0, total: 10 })
  const [loading, setLoading] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject)
    setQuestionIndex(0)
    setQuestionCount({ attempted: 1, total: 10 })
    // Get the first question from the LLM service
    const firstQuestion = await getNextQuestion(subject, 0)
    setCurrentQuestion(firstQuestion)
    setChatHistory([
      { role: 'bot', content: `Hello! I'm your ${subject} interviewer.` },
      { role: 'bot', content: firstQuestion }
    ])
  }

  const handleAnswerSubmit = async (answer) => {
    // Add user's answer to chat history immediately
    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: answer }
    ])
    setLoading(true)
    
    try {
      // Get feedback and next question from the LLM service
      const { evaluation, nextQuestion } = await continueInterview(selectedSubject, currentQuestion, answer, questionIndex)
      
      // Add score and feedback to chat history if evaluation exists
      if (evaluation) {
        // Check if this is a "don't know" response that needs explanation
        if (evaluation.score === 0 && evaluation.feedback === "It's ok, I will explain you the concept clearly:") {
          // Provide detailed explanation for "don't know" responses
          let explanation = '';
          switch (selectedSubject) {
            case 'Python':
              if (currentQuestion === "What is the difference between a list and a tuple in Python?") {
                explanation = "In Python, both lists and tuples are used to store collections of items, but they have key differences:\n\n" +
                  "1. Mutability: Lists are mutable (can be changed after creation), while tuples are immutable (cannot be changed after creation).\n" +
                  "2. Syntax: Lists use square brackets [], while tuples use parentheses ().\n" +
                  "3. Performance: Tuples are generally faster than lists for accessing elements.\n" +
                  "4. Use cases: Lists are used for collections that may change over time, while tuples are used for fixed data like coordinates.\n" +
                  "5. Dictionary keys: Tuples can be used as dictionary keys because they're immutable, but lists cannot.";
              } else {
                explanation = "I'd be happy to explain this concept to you. In a real implementation, I would provide a detailed explanation of the topic.";
              }
              break;
            case 'SQL':
              if (currentQuestion === "What is the difference between INNER JOIN and LEFT JOIN?") {
                explanation = "In SQL, JOINs are used to combine rows from two or more tables based on a related column:\n\n" +
                  "INNER JOIN:\n" +
                  "- Returns only rows that have matching values in both tables\n" +
                  "- If there's no match, the row is not included in the result set\n\n" +
                  "LEFT JOIN (or LEFT OUTER JOIN):\n" +
                  "- Returns all rows from the left table, and matching rows from the right table\n" +
                  "- If there's no match in the right table, NULL values are returned for right table columns\n" +
                  "- The left table is the first table mentioned in the query";
              } else {
                explanation = "I'd be happy to explain this concept to you. In a real implementation, I would provide a detailed explanation of the topic.";
              }
              break;
            case 'Networking':
              if (currentQuestion === "What is the difference between TCP and UDP?") {
                explanation = "TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) are both transport layer protocols, but they have important differences:\n\n" +
                  "TCP:\n" +
                  "- Connection-oriented (requires a connection to be established before data transfer)\n" +
                  "- Reliable (guarantees delivery and order of packets)\n" +
                  "- Slower due to error checking and acknowledgments\n" +
                  "- Used for applications where accuracy is more important than speed (web browsing, email)\n\n" +
                  "UDP:\n" +
                  "- Connectionless (no connection establishment required)\n" +
                  "- Unreliable (no guarantee of delivery or order)\n" +
                  "- Faster with less overhead\n" +
                  "- Used for applications where speed is more important than accuracy (streaming, gaming)";
              } else {
                explanation = "I'd be happy to explain this concept to you. In a real implementation, I would provide a detailed explanation of the topic.";
              }
              break;
            case 'General HR':
            case 'HR':
              if (currentQuestion === "Tell me about yourself.") {
                explanation = "This is a common opening question in interviews. A good approach is to structure your answer like this:\n\n" +
                  "1. Brief introduction (name, current role/position)\n" +
                  "2. Relevant educational background\n" +
                  "3. Key professional experiences related to the job\n" +
                  "4. Important skills and strengths\n" +
                  "5. Personal interests (optional, only if relevant)\n\n" +
                  "Keep it concise (1-2 minutes), focus on professional aspects, and tailor it to the position you're applying for.";
              } else {
                explanation = "I'd be happy to explain how to approach this question. In a real implementation, I would provide specific guidance.";
              }
              break;
            default:
              explanation = "I'd be happy to explain this concept to you. In a real implementation, I would provide a detailed explanation.";
          }
          
          const feedbackContent = `${evaluation.feedback}\n\n${explanation}`;
          setChatHistory(prev => [
            ...prev,
            { role: 'bot', content: feedbackContent }
          ]);
        } else if (evaluation.score > 0 && evaluation.feedback.includes("Here's the complete explanation:")) {
          // Provide detailed explanation for short/incomplete answers
          let explanation = '';
          switch (selectedSubject) {
            case 'Python':
              if (currentQuestion === "What is the difference between a list and a tuple in Python?") {
                explanation = "In Python, both lists and tuples are used to store collections of items, but they have key differences:\n\n" +
                  "1. Mutability: Lists are mutable (can be changed after creation), while tuples are immutable (cannot be changed after creation).\n" +
                  "2. Syntax: Lists use square brackets [], while tuples use parentheses ().\n" +
                  "3. Performance: Tuples are generally faster than lists for accessing elements.\n" +
                  "4. Use cases: Lists are used for collections that may change over time, while tuples are used for fixed data like coordinates.\n" +
                  "5. Dictionary keys: Tuples can be used as dictionary keys because they're immutable, but lists cannot.";
              } else {
                explanation = "Here's a more detailed explanation of the topic.";
              }
              break;
            case 'SQL':
              if (currentQuestion === "What is the difference between INNER JOIN and LEFT JOIN?") {
                explanation = "In SQL, JOINs are used to combine rows from two or more tables based on a related column:\n\n" +
                  "INNER JOIN:\n" +
                  "- Returns only rows that have matching values in both tables\n" +
                  "- If there's no match, the row is not included in the result set\n\n" +
                  "LEFT JOIN (or LEFT OUTER JOIN):\n" +
                  "- Returns all rows from the left table, and matching rows from the right table\n" +
                  "- If there's no match in the right table, NULL values are returned for right table columns\n" +
                  "- The left table is the first table mentioned in the query";
              } else {
                explanation = "Here's a more detailed explanation of the topic.";
              }
              break;
            case 'Networking':
              if (currentQuestion === "What is the difference between TCP and UDP?") {
                explanation = "TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) are both transport layer protocols, but they have important differences:\n\n" +
                  "TCP:\n" +
                  "- Connection-oriented (requires a connection to be established before data transfer)\n" +
                  "- Reliable (guarantees delivery and order of packets)\n" +
                  "- Slower due to error checking and acknowledgments\n" +
                  "- Used for applications where accuracy is more important than speed (web browsing, email)\n\n" +
                  "UDP:\n" +
                  "- Connectionless (no connection establishment required)\n" +
                  "- Unreliable (no guarantee of delivery or order)\n" +
                  "- Faster with less overhead\n" +
                  "- Used for applications where speed is more important than accuracy (streaming, gaming)";
              } else {
                explanation = "Here's a more detailed explanation of the topic.";
              }
              break;
            case 'General HR':
            case 'HR':
              if (currentQuestion === "Tell me about yourself.") {
                explanation = "This is a common opening question in interviews. A good approach is to structure your answer like this:\n\n" +
                  "1. Brief introduction (name, current role/position)\n" +
                  "2. Relevant educational background\n" +
                  "3. Key professional experiences related to the job\n" +
                  "4. Important skills and strengths\n" +
                  "5. Personal interests (optional, only if relevant)\n\n" +
                  "Keep it concise (1-2 minutes), focus on professional aspects, and tailor it to the position you're applying for.";
              } else {
                explanation = "Here's guidance on how to approach this question.";
              }
              break;
            default:
              explanation = "Here's a more detailed explanation of the topic.";
          }
          
          const feedbackContent = `Score: ${evaluation.score}/10\n\n${evaluation.feedback}\n\n${explanation}`;
          setChatHistory(prev => [
            ...prev,
            { role: 'bot', content: feedbackContent }
          ]);
        } else {
          // Regular feedback for good answers
          const feedbackContent = `Score: ${evaluation.score}/10\n\n${evaluation.feedback}`;
          setChatHistory(prev => [
            ...prev,
            { role: 'bot', content: feedbackContent }
          ]);
        }
      }
      
      setQuestionCount(prev => ({ ...prev, attempted: prev.attempted + 1 }))
      
      // Set next question
      setCurrentQuestion(nextQuestion)
      setChatHistory(prev => [...prev, { role: 'bot', content: nextQuestion }])
      setQuestionIndex(prev => prev + 1)
    } catch (error) {
      console.error('Error evaluating answer:', error)
      // Get the next question even if evaluation fails
      const nextQuestion = await getNextQuestion(selectedSubject, questionIndex + 1)
      setCurrentQuestion(nextQuestion)
      setChatHistory(prev => [
        ...prev,
        { role: 'bot', content: `Let's move on to the next question.\n\n${nextQuestion}` }
      ])
      setQuestionCount(prev => ({ ...prev, attempted: prev.attempted + 1 }))
      setQuestionIndex(prev => prev + 1)
    } finally {
      setLoading(false)
    }
  }

  const handleNextQuestion = async () => {
    setLoading(true)
    try {
      // Get next question from the LLM service
      const nextQuestion = await getNextQuestion(selectedSubject, questionIndex + 1)
      setCurrentQuestion(nextQuestion)
      setChatHistory(prev => [...prev, { role: 'bot', content: nextQuestion }])
      setQuestionIndex(prev => prev + 1)
      setQuestionCount(prev => ({ ...prev, attempted: prev.attempted + 1 }))
    } catch (error) {
      console.error('Error fetching next question:', error)
      // If there's an error, repeat the current question
      setChatHistory(prev => [...prev, { role: 'bot', content: currentQuestion }])
    } finally {
      setLoading(false)
    }
  }

  const handleResetSession = () => {
    setSelectedSubject(null)
    setCurrentQuestion('')
    setChatHistory([])
    setQuestionCount({ attempted: 0, total: 10 })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-col md:flex-row flex-grow gap-6 p-4">
        <div className="w-full md:w-1/4">
          <SubjectSelector 
            onSelectSubject={handleSubjectSelect} 
            selectedSubject={selectedSubject}
          />
</div>
        <div className="w-full md:w-3/4 flex flex-col gap-6">
          <ProgressTracker 
            attempted={questionCount.attempted} 
            total={questionCount.total}
          />
          <QuestionArea question={currentQuestion} loading={loading} />
          <ChatBox 
            chatHistory={chatHistory} 
            onSubmitAnswer={handleAnswerSubmit}
            onNextQuestion={handleNextQuestion}
            onResetSession={handleResetSession}
            selectedSubject={selectedSubject}
          />
</div>
</div>
</div>
  )
}

export default App
