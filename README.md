# Interview Practice Bot

A web application that helps users practice interview questions with an AI-powered interviewer bot. The app provides questions on various subjects and evaluates user answers to help improve interview skills.

## Deployment

The application is deployed and can be accessed at: https://interview-practice-bot-iota.vercel.app/

## Features

- Practice interview questions in multiple subjects:
  - Python
  - SQL
  - Networking
  - HR (General interview questions)
- AI-powered interviewer that evaluates your answers
- Score and feedback for each answer
- Progress tracking to monitor your practice session
- Responsive design that works on desktop and mobile devices

## How It Works

1. Select a subject from the sidebar (Python, SQL, Networking, or HR)
2. The interviewer bot will greet you and ask the first question
3. Type your answer in the chat box and submit it
4. The bot will evaluate your answer and provide a score (out of 10) and feedback
5. The bot will then ask the next question
6. Continue the conversation to practice multiple questions
7. Your progress is tracked at the top of the main panel

## Technical Details

This application is built with:
- React.js for the frontend framework
- Vite as the build tool
- Tailwind CSS for styling
- Framer Motion for animations

The app uses a mock LLM service that simulates API calls with delays. In a production environment, this would be replaced with actual calls to an LLM API.

## Components

- `App.jsx`: Main application component that manages state and orchestrates the interview flow
- `Header.jsx`: Application header with title
- `SubjectSelector.jsx`: Sidebar component for selecting interview subjects
- `QuestionArea.jsx`: Component that displays the current question
- `ChatBox.jsx`: Component for submitting answers and displaying the conversation
- `ProgressTracker.jsx`: Component that shows interview progress
- `llmService.js`: Service that handles question generation and answer evaluation (mock implementation)

## Getting Started

To run this application locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5173

## Building for Production

To build the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you have suggestions for improvements or bug fixes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
