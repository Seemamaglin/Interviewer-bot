import React from 'react'

const SubjectSelector = ({ onSelectSubject, selectedSubject }) => {
  const subjects = [
    { id: 'python', name: 'Python' },
    { id: 'sql', name: 'SQL' },
    { id: 'networking', name: 'Networking' },
    { id: 'hr', name: 'General HR' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
      <h2 className="text-xl font-bold mb-4 text-primary">Select Subject</h2>
      <div className="flex flex-col gap-3">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => onSelectSubject(subject.name)}
            disabled={selectedSubject === subject.name}
            className={`py-3 px-4 rounded-lg text-center font-medium transition-all duration-300 ${
              selectedSubject === subject.name
                ? 'bg-secondary text-white cursor-default'
                : 'bg-primary text-white hover:bg-secondary hover:scale-105'
            }`}
          >
            {subject.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SubjectSelector
