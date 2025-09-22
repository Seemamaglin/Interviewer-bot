import React, { useState } from 'react'
import Header from './components/Header'
import SubjectSelector from './components/SubjectSelector'
import QuestionArea from './components/QuestionArea'
import ChatBox from './components/ChatBox'
import ProgressTracker from './components/ProgressTracker'
import { getNextQuestion, continueInterview, evaluateAnswer, getExplanation } from './services/llmService.js'
import InterviewDemo from './components/InterviewDemo.jsx'

const App = () => {
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [questionCount, setQuestionCount] = useState({ attempted: 0, total: 10 })
  const [loading, setLoading] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [demoMode, setDemoMode] = useState(false)

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject)
    setQuestionIndex(0)
    setQuestionCount({ attempted: 1, total: 10 })
    
    // Get first question
    const firstQuestion = await getNextQuestion(subject, 0)
    setCurrentQuestion(firstQuestion)
    setChatHistory([
      { role: 'bot', content: `Hello! I'm your ${subject} interviewer. Let's get started!` },
      { role: 'bot', content: firstQuestion }
    ])
  }

  const handleAnswerSubmit = async (answer) => {
    setChatHistory(prev => [...prev, { role: 'user', content: answer }])
    setLoading(true)

    try {
      const { question, evaluation, explanation } = await continueInterview(selectedSubject, currentQuestion, answer, questionIndex)

      // Handle evaluation and explanation
      if (evaluation) {
        // For evaluated answers, provide score and feedback
        const feedbackContent = `Score: ${evaluation.score}/10\n\n${evaluation.feedback}`
        setChatHistory(prev => [...prev, { role: 'bot', content: feedbackContent }])
        
        // If the answer was short or incomplete, also provide detailed explanation
        if (evaluation.score < 7 && explanation) {
          const explanationContent = `Let me provide a more detailed explanation:\n\n${explanation}`
          setChatHistory(prev => [...prev, { role: 'bot', content: explanationContent }])
        }
        
        // Handle "don't know" answers with score 0
        if (evaluation.score === 0 && explanation) {
          const explanationContent = `${evaluation.feedback}\n\n${explanation}`
          setChatHistory(prev => [...prev, { role: 'bot', content: explanationContent }])
        }
      }

      // Move to next question
      setCurrentQuestion(question)
      setChatHistory(prev => [...prev, { role: 'bot', content: question }])
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

  // Toggle demo mode
  const toggleDemoMode = () => {
    setDemoMode(!demoMode)
    if (!demoMode) {
      // Reset session when entering demo mode
      handleResetSession()
    }
  }

  if (demoMode) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex flex-col md:flex-row flex-grow gap-6 p-4">
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Demo Mode</h2>
              <button 
                onClick={toggleDemoMode}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Exit Demo Mode
              </button>
            </div>
          </div>
          <div className="w-full md:w-3/4">
            <InterviewDemo />
          </div>
        </div>
      </div>
    )
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
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Demo Mode</h2>
            <button 
              onClick={toggleDemoMode}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Enter AI Interview Coach Demo
            </button>
          </div>
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
