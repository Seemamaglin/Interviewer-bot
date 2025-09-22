import React, { useState } from 'react'
import Header from './components/Header'
import SubjectSelector from './components/SubjectSelector'
import QuestionArea from './components/QuestionArea'
import ChatBox from './components/ChatBox'
import ProgressTracker from './components/ProgressTracker'
import { getNextQuestion, continueInterview, getExplanation } from './services/llmService.js'

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
    
    // Get first question
    const firstQuestion = await getNextQuestion(subject, 0)
    setCurrentQuestion(firstQuestion)
    setChatHistory([
      { role: 'bot', content: `Hello! I'm your ${subject} interviewer.` },
      { role: 'bot', content: firstQuestion }
    ])
  }

  const handleAnswerSubmit = async (answer) => {
    setChatHistory(prev => [...prev, { role: 'user', content: answer }])
    setLoading(true)

    try {
      const { evaluation, nextQuestion } = await continueInterview(selectedSubject, currentQuestion, answer, questionIndex)

      // Handle "don't know" answers
      if (answer.toLowerCase().includes("don't know")) {
        const explanation = getExplanation(selectedSubject, currentQuestion)
        const feedbackContent = `It's ok, I will explain you the concept clearly:\n\n${explanation}`
        setChatHistory(prev => [...prev, { role: 'bot', content: feedbackContent }])
      } else if (evaluation) {
        // For short or incomplete answers, provide detailed explanation
        const explanation = getExplanation(selectedSubject, currentQuestion)
        const feedbackContent = `Score: ${evaluation.score}/10\n\n${evaluation.feedback}\n\n${explanation}`
        setChatHistory(prev => [...prev, { role: 'bot', content: feedbackContent }])
      }

      // Move to next question
      setCurrentQuestion(nextQuestion)
      setChatHistory(prev => [...prev, { role: 'bot', content: nextQuestion }])
      setQuestionIndex(prev => prev + 1)
      setQuestionCount(prev => ({ ...prev, attempted: prev.attempted + 1 }))

    } catch (error) {
      console.error('Error evaluating answer:', error)
      const nextQuestion = await getNextQuestion(selectedSubject, questionIndex + 1)
      setCurrentQuestion(nextQuestion)
      setChatHistory(prev => [...prev, { role: 'bot', content: `Let's move on to the next question:\n\n${nextQuestion}` }])
      setQuestionCount(prev => ({ ...prev, attempted: prev.attempted + 1 }))
      setQuestionIndex(prev => prev + 1)
    } finally {
      setLoading(false)
    }
  }

  const handleNextQuestion = async () => {
    setLoading(true)
    try {
      const nextQuestion = await getNextQuestion(selectedSubject, questionIndex + 1)
      setCurrentQuestion(nextQuestion)
      setChatHistory(prev => [...prev, { role: 'bot', content: nextQuestion }])
      setQuestionIndex(prev => prev + 1)
      setQuestionCount(prev => ({ ...prev, attempted: prev.attempted + 1 }))
    } catch (error) {
      console.error('Error fetching next question:', error)
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
    setQuestionIndex(0)
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
