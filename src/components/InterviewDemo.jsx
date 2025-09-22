import React, { useState } from 'react';
import { processInterviewResponse } from '../services/interviewCoach.js';

const InterviewDemo = () => {
  const [subject, setSubject] = useState('Python');
  const [currentQuestion, setCurrentQuestion] = useState("What is the difference between a list and a tuple in Python?");
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);

  const handleProcess = async () => {
    try {
      const input = {
        subject,
        currentQuestion,
        userAnswer
      };
      const response = await processInterviewResponse(input);
      setResult(response);
    } catch (error) {
      setResult({ error: error.message });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Interview Coach Demo</h1>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Subject: </label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="Python">Python</option>
          <option value="SQL">SQL</option>
          <option value="Networking">Networking</option>
          <option value="HR">HR</option>
        </select>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Current Question: </label>
        <textarea 
          value={currentQuestion} 
          onChange={(e) => setCurrentQuestion(e.target.value)}
          rows={3}
          style={{ width: '100%', marginTop: '5px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>User Answer: </label>
        <textarea 
          value={userAnswer} 
          onChange={(e) => setUserAnswer(e.target.value)}
          rows={5}
          style={{ width: '100%', marginTop: '5px' }}
        />
      </div>
      
      <button onClick={handleProcess} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Process Interview Response
      </button>
      
      {result && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          <h2>Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default InterviewDemo;
