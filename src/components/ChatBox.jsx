import React, { useState, useRef, useEffect } from 'react'

const ChatBox = ({ chatHistory, onSubmitAnswer, onNextQuestion, onResetSession, selectedSubject }) => {
  const [userInput, setUserInput] = useState('')
  const chatContainerRef = useRef(null)

  useEffect(() => {
    // Scroll to bottom when chat history changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (userInput.trim()) {
      onSubmitAnswer(userInput)
      setUserInput('')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-[400px]">
      <h2 className="text-xl font-bold mb-4 text-primary">Interview Chat</h2>
      
      <div 
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto mb-4 space-y-4"
      >
        {chatHistory.map((message, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg max-w-[80%] ${
              message.role === 'bot' 
                ? 'bg-blue-50 self-start' 
                : 'bg-teal-50 self-end ml-auto'
            }`}
          >
            <p className="font-bold mb-1">
              {message.role === 'bot' ? 'Interviewer Bot' : 'You'}
            </p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      
      {selectedSubject ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer here..."
            className="flex-grow border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-secondary transition-colors flex-grow sm:flex-grow-0"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onNextQuestion}
              className="bg-secondary text-white py-3 px-6 rounded-lg hover:bg-primary transition-colors flex-grow sm:flex-grow-0"
            >
              Skip
            </button>
          </div>
        </form>
      ) : null}
      
      <div className="mt-4 flex justify-center">
        <button
          onClick={onResetSession}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Reset Session
        </button>
      </div>
    </div>
  )
}

export default ChatBox
