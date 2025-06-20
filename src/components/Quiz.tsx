import React, { useState, useEffect } from 'react';
import { Clock, SkipForward, ChevronLeft, ChevronRight, Pause, Play, RefreshCcw, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Question, QuizData } from '../pages/Index';
import { extractTextFromPDF, generateQuestionsFromText } from '../utils/pdfProcessor';

interface QuizProps {
  pdfFile: File | null;
  timeLimit: number;
  onQuizComplete: (answers: (number | null)[]) => void;
  onQuizDataGenerated: (quizData: QuizData) => void;
  onBackToTimer: () => void;
}

const Quiz: React.FC<QuizProps> = ({
  pdfFile,
  timeLimit,
  onQuizComplete,
  onQuizDataGenerated,
  onBackToTimer
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(10).fill(null));
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timerExpired, setTimerExpired] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Generate questions from PDF using AI
  useEffect(() => {
    const generateQuestions = async () => {
      if (!pdfFile) {
        setLoadingError("No PDF file provided");
        setIsLoading(false);
        return;
      }

      try {
        setLoadingError(null);
        console.log("Starting PDF processing...");
        
        // Extract text from PDF
        const pdfText = await extractTextFromPDF(pdfFile);
        console.log("PDF text extracted, length:", pdfText.length);

        // Generate questions using AI
        console.log("Generating questions with AI...");
        const aiQuestions = await generateQuestionsFromText(pdfText);
        console.log("AI questions generated:", aiQuestions.length);

        setQuestions(aiQuestions);
        const quizData: QuizData = {
          questions: aiQuestions,
          answers: new Array(aiQuestions.length).fill(null),
          timeLimit: timeLimit
        };
        onQuizDataGenerated(quizData);
        setAnswers(new Array(aiQuestions.length).fill(null));
        setIsLoading(false);
      } catch (error) {
        console.error("Error generating questions:", error);
        setLoadingError(error instanceof Error ? error.message : "Failed to generate questions");
        setIsLoading(false);
      }
    };

    generateQuestions();
  }, [pdfFile, timeLimit, onQuizDataGenerated]);

  // Timer effect - runs the countdown and shows questions after timer expires
  useEffect(() => {
    if (timeLeft > 0 && !isLoading && !timerExpired && !isPaused) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !timerExpired) {
      setTimerExpired(true);
    }
  }, [timeLeft, isLoading, timerExpired, isPaused]);

  // Set selected option when navigating between questions
  useEffect(() => {
    setSelectedOption(answers[currentQuestionIndex]);
  }, [currentQuestionIndex, answers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePausePlay = () => {
    setIsPaused(!isPaused);
  };

  const handleRestart = () => {
    setTimeLeft(timeLimit * 60);
    setIsPaused(false);
    setTimerExpired(false);
  };

  const handleBackToTimer = () => {
    onBackToTimer();
  };

  const handleReset = () => {
    setTimeLeft(timeLimit * 60);
    setIsPaused(false);
    setTimerExpired(false);
    setAnswers(new Array(questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onQuizComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleFinish = () => {
    onQuizComplete(answers);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Generating Quiz Questions...
              </h3>
              <p className="text-gray-600">
                Please wait while we analyze your PDF and create personalized questions.
              </p>
              {loadingError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">Error: {loadingError}</p>
                  <Button
                    onClick={handleBackToTimer}
                    className="mt-2 bg-red-600 hover:bg-red-700"
                  >
                    Back to Timer Settings
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show timer countdown before questions appear
  if (!timerExpired) {
    const totalSeconds = timeLimit * 60;
    const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
    const circumference = 2 * Math.PI * 120;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="max-w-lg mx-auto">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardContent className="p-12 text-center">
            <div className="space-y-8">
              {/* Circular Timer */}
              <div className="relative w-80 h-80 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
                  {/* Background circle */}
                  <circle
                    cx="120"
                    cy="120"
                    r="120"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="120"
                    cy="120"
                    r="120"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-in-out"
                  />
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Timer display in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold text-gray-800 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-lg text-gray-500 font-medium">
                    {isPaused ? 'Paused' : 'Time Remaining'}
                  </div>
                </div>
              </div>

              {/* Title and description */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  Quiz Timer {isPaused ? 'Paused' : 'Active'}
                </h3>
                <p className="text-gray-600 text-lg">
                  {isPaused 
                    ? 'Timer is paused. Click play to continue.' 
                    : 'Questions will appear when the timer reaches zero'
                  }
                </p>
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={handlePausePlay}
                  variant="outline"
                  size="lg"
                  className="rounded-full w-14 h-14 border-2 hover:bg-blue-50"
                >
                  {isPaused ? (
                    <Play className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Pause className="w-6 h-6 text-blue-600" />
                  )}
                </Button>
                
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  size="lg"
                  className="rounded-full w-14 h-14 border-2 hover:bg-green-50"
                >
                  <RefreshCcw className="w-6 h-6 text-green-600" />
                </Button>
                
                <Button
                  onClick={handleBackToTimer}
                  variant="outline"
                  size="lg"
                  className="rounded-full w-14 h-14 border-2 hover:bg-red-50"
                >
                  <Square className="w-6 h-6 text-red-600" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show questions after timer expires
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = answers.filter(answer => answer !== null).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-lg font-bold text-green-600">
                  AI-GENERATED QUIZ
                </span>
              </div>
              <div className="text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Answered: {answeredCount}/{questions.length}
            </div>
          </div>
          <Progress value={progress} className="mt-3 h-2" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Question {currentQuestionIndex + 1}
            </h2>
            {answers[currentQuestionIndex] !== null && (
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Answered
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            {currentQuestion.question}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  selectedOption === index
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedOption === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-3">
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex items-center space-x-2 text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <SkipForward className="w-4 h-4" />
                <span>Skip</span>
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleFinish}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8"
                >
                  Finish Quiz
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2 px-8"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
