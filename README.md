# Health Care Chatbot

An intelligent, full-stack health care chatbot assistant designed to provide informative responses to health-related queries, built with React, TypeScript, and Express.

## Features

- **Conversational Interface**: Real-time interaction with a Mistral-powered AI model.
- **Disease Information**: Browse and learn about various diseases.
- **Secure Authentication**: User sign-up and login functionality.
- **Responsive Design**: Optimized for desktop and mobile devices.

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Router.
- **Backend**: Node.js, Express, Axios.
- **AI/LLM**: Mistral 7B via Hugging Face Inference API.
- **Authentication**: Firebase Authentication.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Hugging Face API Key

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the required variables, including `HUGGINGFACE_API_KEY`.

### Running the Application

- **Development**:
  ```bash
  npm run dev
  ```
- **Production**:
  ```bash
  npm run build
  npm start
  ```
