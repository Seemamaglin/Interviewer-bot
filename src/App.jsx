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
        const feedbackContent = `Score: ${evaluation.score}/10\n\n${evaluation.feedback}`
        setChatHistory(prev => [
          ...prev,
          { role: 'bot', content: feedbackContent }
        ])
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
