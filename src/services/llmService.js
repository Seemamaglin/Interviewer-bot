// Mock implementation of LLM service
// In a real implementation, this would connect to an actual LLM API

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock questions database
const mockQuestions = {
  Python: [
    "What is the difference between a list and a tuple in Python?",
    "Explain Python decorators.",
    "What is the purpose of the __init__ method in Python classes?",
    "How does garbage collection work in Python?",
    "What are Python's built-in data types?",
    "Explain the concept of Python's GIL (Global Interpreter Lock).",
    "What is the difference between deep copy and shallow copy?",
    "How do you handle exceptions in Python?",
    "Explain the use of *args and **kwargs in Python functions.",
    "What is a Python virtual environment and why is it useful?"
  ],
  SQL: [
    "What is the difference between INNER JOIN and LEFT JOIN?",
    "Explain the use of indexes in SQL.",
    "What is a primary key and foreign key?",
    "How would you optimize a slow SQL query?",
    "What is the difference between DELETE and TRUNCATE?",
    "Explain the ACID properties of database transactions.",
    "What is normalization and why is it important?",
    "How do you prevent SQL injection attacks?",
    "Explain the difference between WHERE and HAVING clauses.",
    "What are window functions in SQL and how are they used?"
  ],
  Networking: [
    "Explain the OSI model and its layers.",
    "What is the difference between TCP and UDP?",
    "Describe the process of a DNS lookup.",
    "What is a subnet mask and how is it used?",
    "Explain the concept of load balancing.",
    "What is the difference between HTTP and HTTPS?",
    "Explain how a firewall works.",
    "What is the purpose of ARP (Address Resolution Protocol)?",
    "Describe the differences between IPv4 and IPv6.",
    "What is a CDN (Content Delivery Network) and how does it work?"
  ],
  HR: [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Why do you want to work here?",
    "Describe a challenging situation you faced at work and how you handled it.",
    "Where do you see yourself in 5 years?",
    "How do you handle stress and pressure?",
    "Tell me about a time you worked in a team.",
    "What motivates you in your work?",
    "How do you deal with failure or setbacks?",
    "Why should we hire you?"
  ]
};

// Mock interviewer responses with subject-specific feedback
const mockInterviewerResponses = {
  Python: {
    "What is the difference between a list and a tuple in Python?": {
      excellent: {
        score: 9,
        feedback: "Excellent answer! You've correctly identified that lists are mutable while tuples are immutable. Your explanation of use cases for each is spot on - lists for collections that change and tuples for fixed data. You also mentioned the performance implications correctly. To make it perfect, you could have mentioned that tuples can be used as dictionary keys while lists cannot."
      },
      good: {
        score: 7,
        feedback: "Good answer with correct information about mutability. You've explained that lists can be modified while tuples cannot. However, you missed some important details like the performance differences and use cases. Also, it would be beneficial to mention that tuples can be used as dictionary keys due to their immutability."
      },
      fair: {
        score: 5,
        feedback: "You've touched on the basic difference but your answer lacks depth. Lists are indeed mutable and tuples immutable, but you should elaborate more on when to use each. For example, tuples are often used for heterogeneous data and lists for homogeneous data. You also missed mentioning that tuples can be dictionary keys."
      },
      poor: {
        score: 3,
        feedback: "Your answer needs improvement. While you mentioned that lists and tuples are different, you didn't clearly explain the key difference - mutability. You should also discuss performance implications and appropriate use cases for each data structure."
      }
    }
  },
  SQL: {
    "What is the difference between INNER JOIN and LEFT JOIN?": {
      excellent: {
        score: 9,
        feedback: "Perfect explanation! You've clearly described that INNER JOIN returns only matching records from both tables while LEFT JOIN returns all records from the left table and matching records from the right table. Your example with NULL values for non-matching records in LEFT JOIN is exactly right. You could add that RIGHT JOIN and FULL OUTER JOIN are other types of joins."
      },
      good: {
        score: 7,
        feedback: "Good answer with correct information. You've explained that INNER JOIN only returns matching rows while LEFT JOIN returns all rows from the left table. However, you could be more specific about what happens to non-matching rows in a LEFT JOIN (they appear with NULL values for right table columns)."
      },
      fair: {
        score: 5,
        feedback: "You've got the basic concept but your explanation lacks precision. INNER JOIN does return matching records from both tables, but LEFT JOIN returns ALL records from the left table regardless of matches. You should also explain how NULL values appear in the result set for non-matching records."
      },
      poor: {
        score: 3,
        feedback: "Your answer needs significant improvement. You haven't clearly explained the fundamental difference between these joins. INNER JOIN returns only records with matches in both tables, while LEFT JOIN returns all records from the left table and only matching records from the right table."
      }
    }
  },
  Networking: {
    "What is the difference between TCP and UDP?": {
      excellent: {
        score: 9,
        feedback: "Excellent answer! You've correctly identified that TCP is connection-oriented and reliable while UDP is connectionless and unreliable. Your explanation of TCP's three-way handshake and UDP's speed advantage is spot on. You also correctly mentioned use cases like web browsing for TCP and streaming for UDP."
      },
      good: {
        score: 7,
        feedback: "Good explanation of the key differences. You've correctly identified that TCP is reliable and UDP is faster but unreliable. However, you could elaborate more on why TCP is slower (due to acknowledgments and retransmissions) and provide more specific use cases for each protocol."
      },
      fair: {
        score: 5,
        feedback: "You've touched on some differences but your answer lacks depth. TCP is indeed reliable but you should explain how (through acknowledgments, sequencing, and retransmissions). UDP is faster but you should explain why (no connection setup, no acknowledgments). Include specific examples like HTTP for TCP and DNS for UDP."
      },
      poor: {
        score: 3,
        feedback: "Your answer needs improvement. You haven't clearly explained the fundamental differences between TCP and UDP. TCP provides reliable, ordered delivery through connection establishment and acknowledgments, while UDP is faster but doesn't guarantee delivery or order."
      }
    }
  },
  HR: {
    "Tell me about yourself.": {
      excellent: {
        score: 9,
        feedback: "Great response! You've structured your answer well with a logical flow from education to experience to interests. You've highlighted relevant skills without just repeating your resume. Your answer is concise yet comprehensive, showing self-awareness and fit for the role."
      },
      good: {
        score: 7,
        feedback: "Good structure but could be more focused on professional aspects. You've covered your background but should emphasize skills and experiences most relevant to this position. Try to connect your personal interests to professional development or company values."
      },
      fair: {
        score: 5,
        feedback: "Your answer is too generic or too personal. Instead of just listing facts about your life, focus on creating a narrative that connects your background to why you're a good fit for the role. Emphasize professional experiences and skills that align with the job description."
      },
      poor: {
        score: 3,
        feedback: "This answer doesn't effectively communicate your value. It's either too vague, too detailed about irrelevant aspects, or doesn't show how your background makes you suitable for the position. Structure your response to highlight key experiences and skills relevant to the job."
      }
    }
  }
};

export const getNextQuestion = async (subject, currentIndex = 0) => {
  // Simulate API delay
  await delay(1000);
  
  // Get the next question from the subject
  // In a real implementation, we would track which questions have been asked
  const subjectQuestions = mockQuestions[subject] || mockQuestions.HR;
  // Return the next question in the sequence
  const nextIndex = currentIndex % subjectQuestions.length;
  return subjectQuestions[nextIndex];
};

export const evaluateAnswer = async (subject, question, answer) => {
  // Simulate API delay
  await delay(1500);
  
  if (!subject || !question || !answer) {
    throw new Error('Subject, question, and answer are required');
  }
  
  // In a real implementation, this would call an LLM API with the specified behavior
  // For this mock implementation, we'll provide tailored feedback based on the answer
  
  // Check for "don't know" type responses
  const dontKnowResponses = [
    "don't know",
    "dont know",
    "i don't know",
    "i dont know",
    "idk",
    "not sure",
    "unsure",
    "i'm not sure",
    "im not sure",
    "no idea",
    "i have no idea",
    "i am not sure",
    "i don't have knowledge",
    "i dont have knowledge",
    "i don't understand",
    "i dont understand",
    "can't answer",
    "cant answer",
    "cannot answer",
    "i can't answer",
    "i cant answer",
    "i cannot answer"
  ];
  
  const trimmedAnswer = answer.trim().toLowerCase();
  const isDontKnowResponse = dontKnowResponses.some(response => trimmedAnswer === response || trimmedAnswer.startsWith(response));
  
  if (isDontKnowResponse) {
    // Don't penalize score for "don't know" responses
    return {
      score: 0,
      feedback: "It's ok, I will explain you the concept clearly:"
    };
  }
  
  // Check if we have a specific response for this question
  if (mockInterviewerResponses[subject] && mockInterviewerResponses[subject][question]) {
    // Simple logic to determine response quality based on answer length
    // In a real implementation, an LLM would analyze the content
    const answerLength = answer.trim().length;
    
    if (answerLength > 100) {
      return mockInterviewerResponses[subject][question].excellent;
    } else if (answerLength > 50) {
      return {
        score: mockInterviewerResponses[subject][question].good.score,
        feedback: "Good attempt, but you missed some details. Here's the complete explanation:"
      };
    } else if (answerLength > 20) {
      return {
        score: mockInterviewerResponses[subject][question].fair.score,
        feedback: "Good attempt, but you missed some details. Here's the complete explanation:"
      };
    } else {
      return mockInterviewerResponses[subject][question].poor;
    }
  }
  
  // Default response if no specific question feedback is available
  const answerLength = answer.trim().length;
  let score, feedback;
  
  if (answerLength > 100) {
    score = 8;
    feedback = "Great answer! You've demonstrated a solid understanding of the topic. Keep up the good work!";
  } else if (answerLength > 50) {
    score = 6;
    feedback = "Good attempt, but you missed some details. Here's the complete explanation:";
  } else if (answerLength > 20) {
    score = 4;
    feedback = "Good attempt, but you missed some details. Here's the complete explanation:";
  } else {
    score = 2;
    feedback = "Your answer is too brief to properly evaluate your understanding. Here's a more comprehensive explanation:";
  }
  
  return {
    score,
    feedback
  };
};

// Function to get the next question in a subject after answering
export const continueInterview = async (subject, question, answer, currentIndex = 0) => {
  // Simulate API delay
  await delay(1500);
  
  // First evaluate the answer if provided
  let evaluation = null;
  if (answer && answer.trim().length > 0) {
    try {
      evaluation = await evaluateAnswer(subject, question, answer);
    } catch (error) {
      // If evaluation fails, continue with next question anyway
      evaluation = {
        score: 0,
        feedback: "I couldn't evaluate your answer properly, but let's move on to the next question."
      };
    }
  }
  
  // Then get the next question
  // In a real implementation, the next question would be based on the conversation context
  let nextQuestion = "Tell me about yourself.";
  
  if (mockQuestions[subject]) {
    // Get the next question in the sequence
    const nextIndex = (currentIndex + 1) % mockQuestions[subject].length;
    nextQuestion = mockQuestions[subject][nextIndex];
  }
  
  return {
    evaluation,
    nextQuestion
  };
};
