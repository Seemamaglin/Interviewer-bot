import React from 'react'
import { motion } from 'framer-motion'

const QuestionArea = ({ question, loading }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-4 text-primary">Question</h2>
      <motion.div 
        className="min-h-[100px]"
        key={question}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {loading ? (
          <p className="text-lg">Loading...</p>
        ) : question ? (
          <p className="text-lg">{question}</p>
        ) : (
          <p className="text-gray-500 italic">Please select a subject to begin...</p>
        )}
      </motion.div>
    </motion.div>
  )
}

export default QuestionArea
