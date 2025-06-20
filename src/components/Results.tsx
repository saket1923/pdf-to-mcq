
import React from 'react';
import { Trophy, RotateCcw, Upload, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuizData } from '../pages/Index';

interface ResultsProps {
  quizData: QuizData;
  onNewQuizSet: () => void;
  onNewPdf: () => void;
}

const Results: React.FC<ResultsProps> = ({
  quizData,
  onNewQuizSet,
  onNewPdf
}) => {
  const { questions, answers } = quizData;
  
  const attemptedAnswers = answers.filter(answer => answer !== null);
  const correctAnswers = answers.filter(
    (answer, index) => answer === questions[index].correctAnswer
  );
  
  const score = correctAnswers.length;
  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const attemptedCount = attemptedAnswers.length;

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeText = (percentage: number) => {
    if (percentage >= 90) return 'Excellent!';
    if (percentage >= 80) return 'Great Job!';
    if (percentage >= 70) return 'Good Work!';
    if (percentage >= 60) return 'Fair';
    return 'Need Improvement';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Score Overview */}
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Quiz Complete!
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Here are your results
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {score}
              </div>
              <div className="text-lg font-medium text-gray-700">
                Correct Answers
              </div>
              <div className="text-sm text-gray-500">
                out of {totalQuestions}
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className={`text-4xl font-bold mb-2 ${getGradeColor(percentage)}`}>
                {percentage}%
              </div>
              <div className="text-lg font-medium text-gray-700">
                Your Score
              </div>
              <div className={`text-sm font-medium ${getGradeColor(percentage)}`}>
                {getGradeText(percentage)}
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {attemptedCount}
              </div>
              <div className="text-lg font-medium text-gray-700">
                Questions Attempted
              </div>
              <div className="text-sm text-gray-500">
                out of {totalQuestions}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Question Review
          </CardTitle>
          <p className="text-gray-600">
            Review your answers and see the correct solutions
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const wasAttempted = userAnswer !== null;

            return (
              <div
                key={question.id}
                className={`p-4 rounded-xl border-2 ${
                  !wasAttempted
                    ? 'border-gray-200 bg-gray-50'
                    : isCorrect
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {!wasAttempted ? (
                      <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">-</span>
                      </div>
                    ) : isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium text-gray-800">
                      Question {index + 1}: {question.question}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded ${
                            optionIndex === question.correctAnswer
                              ? 'bg-green-100 text-green-800 font-medium'
                              : userAnswer === optionIndex && !isCorrect
                              ? 'bg-red-100 text-red-800'
                              : 'bg-white'
                          }`}
                        >
                          {option}
                          {optionIndex === question.correctAnswer && (
                            <span className="ml-2 text-green-600">✓ Correct</span>
                          )}
                          {userAnswer === optionIndex && !isCorrect && (
                            <span className="ml-2 text-red-600">✗ Your answer</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {!wasAttempted && (
                      <p className="text-gray-500 text-sm italic">
                        Question not attempted
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onNewQuizSet}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Generate New Quiz Set</span>
            </Button>

            <Button
              onClick={onNewPdf}
              size="lg"
              variant="outline"
              className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <Upload className="w-5 h-5" />
              <span>Upload New PDF</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
