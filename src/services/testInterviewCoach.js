// Test script for AI Interview Coach
import { processInterviewResponse } from './interviewCoach.js';

async function runTests() {
  // Test case 1: User doesn't know the answer
  console.log("Test Case 1: User doesn't know the answer");
  const test1 = await processInterviewResponse({
    subject: "Python",
    currentQuestion: "What is the difference between a list and a tuple in Python?",
    userAnswer: "I don't know",
    currentIndex: 0
  });

  console.log(JSON.stringify(test1, null, 2));

  // Test case 2: User gives a short answer
  console.log("\nTest Case 2: User gives a short answer");
  const test2 = await processInterviewResponse({
    subject: "SQL",
    currentQuestion: "What is the difference between INNER JOIN and LEFT JOIN?",
    userAnswer: "INNER JOIN returns matching rows, LEFT JOIN returns all rows from left table",
    currentIndex: 0
  });

  console.log(JSON.stringify(test2, null, 2));

  // Test case 3: User gives a comprehensive answer
  console.log("\nTest Case 3: User gives a comprehensive answer");
  const test3 = await processInterviewResponse({
    subject: "Networking",
    currentQuestion: "Explain the OSI model and its layers.",
    userAnswer: "The OSI model is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven abstraction layers. The layers are: 1. Physical Layer - deals with transmission and reception of unstructured raw data over a physical medium. 2. Data Link Layer - provides node-to-node data transfer and handles error correction from the physical layer. 3. Network Layer - provides routing and forwarding functions, determining the best path for data transfer. 4. Transport Layer - provides reliable data transfer services to the upper layers, handling segmentation, error checking, and retransmission. 5. Session Layer - manages sessions between applications, establishing, managing, and terminating connections. 6. Presentation Layer - translates data between the application layer and the network format, handling encryption and compression. 7. Application Layer - provides network services directly to end-user applications.",
    currentIndex: 0
  });

  console.log(JSON.stringify(test3, null, 2));

  // Test case 4: Invalid subject
  console.log("\nTest Case 4: Invalid subject");
  const test4 = await processInterviewResponse({
    subject: "InvalidSubject",
    currentQuestion: "Tell me about yourself.",
    userAnswer: "I am a software developer with 5 years of experience.",
    currentIndex: 0
  });

  console.log(JSON.stringify(test4, null, 2));
}

runTests();
