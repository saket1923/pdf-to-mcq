
import React, { useState } from 'react';
import { Clock, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TimerSettingsProps {
  onTimerSet: (minutes: number) => void;
  pdfFileName: string;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({ 
  onTimerSet, 
  pdfFileName 
}) => {
  const [minutes, setMinutes] = useState<number>(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (minutes > 0 && minutes <= 120) {
      onTimerSet(minutes);
    } else {
      alert('Please enter a valid time between 1 and 120 minutes');
    }
  };

  const presetTimes = [5, 10, 15, 20, 30];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-2 bg-green-100 rounded-full">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-lg font-medium text-green-700 truncate max-w-md">
              {pdfFileName}
            </span>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center space-x-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <span>Set Quiz Timer</span>
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Choose how much time you need to complete 10 questions
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-5 gap-3">
            {presetTimes.map((time) => (
              <Button
                key={time}
                variant={minutes === time ? "default" : "outline"}
                onClick={() => setMinutes(time)}
                className={`h-12 text-lg font-semibold transition-all duration-200 ${
                  minutes === time
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                    : 'hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                {time}m
              </Button>
            ))}
          </div>

          <div className="text-center">
            <span className="text-gray-500 text-sm">or set custom time</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="custom-time" className="text-lg font-medium">
                Custom Time (minutes)
              </Label>
              <Input
                id="custom-time"
                type="number"
                min="1"
                max="120"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                className="text-center text-xl h-14 text-gray-800 border-2 focus:border-blue-500"
                placeholder="Enter minutes"
              />
              <p className="text-sm text-gray-500 text-center">
                Maximum: 120 minutes
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Quiz
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimerSettings;
