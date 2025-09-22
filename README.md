# Interview Practice Bot

An interactive interview practice application built with React and Vite that helps users prepare for technical interviews by simulating real interview scenarios.

## Deployment

The application is deployed and can be accessed at: https://interview-practice-bot-iota.vercel.app/

## Features

- Interactive chat-based interview simulation
- Subject selection for different technical domains
- Progress tracking during interview sessions
- Question generation based on selected subjects
- Real-time feedback and evaluation

## Project Structure

```
src/
├── App.jsx              # Main application component
├── main.jsx             # Entry point
├── components/
│   ├── ChatBox.jsx       # Handles the chat interface
│   ├── Header.jsx        # Application header
│   ├── ProgressTracker.jsx # Tracks interview progress
│   ├── QuestionArea.jsx    # Displays interview questions
│   └── SubjectSelector.jsx # Allows subject selection
└── services/
    └── llmService.js    # Service for interacting with language models
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Seemamaglin/Interviewer-bot.git
   ```

2. Navigate to the project directory:
   ```bash
   cd interview-practice-bot
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.
