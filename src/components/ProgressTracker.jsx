import React from 'react'

const ProgressTracker = ({ attempted, total }) => {
  const percentage = total > 0 ? (attempted / total) * 100 : 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-primary">Progress</h2>
      <div className="flex items-center gap-4">
        <div className="flex-grow">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <div className="text-lg font-medium">
          {attempted}/{total}
        </div>
      </div>
    </div>
  )
}

export default ProgressTracker
