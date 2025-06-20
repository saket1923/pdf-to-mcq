import React, { useState } from 'react';
import PdfUpload from '../components/PdfUpload';
import TimerSettings from '../components/TimerSettings';
import Quiz from '../components/Quiz';
import Results from '../components/Results';

export type AppState = 'upload' | 'timer' | 'quiz' | 'results';

export interface QuizData {
  questions: Question[];
  answers: (number | null)[];
  timeLimit: number;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [timeLimit, setTimeLimit] = useState<number>(10);
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  const handlePdfUpload = (file: File) => {
    setPdfFile(file);
    setAppState('timer');
  };

  const handleTimerSet = (minutes: number) => {
    setTimeLimit(minutes);
    setAppState('quiz');
  };

  const handleQuizComplete = (answers: (number | null)[]) => {
    if (quizData) {
      const updatedQuizData = { ...quizData, answers };
      setQuizData(updatedQuizData);
      setAppState('results');
    }
  };

  const handleBackToTimer = () => {
    setAppState('timer');
  };

  const handleNewQuizSet = () => {
    setAppState('quiz');
  };

  const handleNewPdf = () => {
    setPdfFile(null);
    setQuizData(null);
    setAppState('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            PDF Quiz Generator
          </h1>
          <p className="text-lg text-gray-600">
            Upload a PDF and generate interactive quizzes with AI-powered questions
          </p>
        </div>

        {appState === 'upload' && (
          <PdfUpload onPdfUpload={handlePdfUpload} />
        )}

        {appState === 'timer' && (
          <TimerSettings
            onTimerSet={handleTimerSet}
            pdfFileName={pdfFile?.name || ''}
          />
        )}

        {appState === 'quiz' && (
          <Quiz
            pdfFile={pdfFile}
            timeLimit={timeLimit}
            onQuizComplete={handleQuizComplete}
            onQuizDataGenerated={setQuizData}
            onBackToTimer={handleBackToTimer}
          />
        )}

        {appState === 'results' && quizData && (
          <Results
            quizData={quizData}
            onNewQuizSet={handleNewQuizSet}
            onNewPdf={handleNewPdf}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
