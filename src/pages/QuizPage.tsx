
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getQuizQuestions, submitQuizAnswer } from '../api/ecowattAPI';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
}

interface QuizResponse {
  questions: QuizQuestion[];
}

const QuizPage = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuestions = async () => {
      if (isAuthenticated) {
        try {
          setIsLoading(true);
          const data = await getQuizQuestions() as QuizResponse;
          setQuestions(data.questions);
        } catch (error) {
          console.error('Error fetching quiz questions:', error);
          toast({
            title: 'Error',
            description: 'Failed to load quiz questions. Please try again later.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchQuestions();
  }, [isAuthenticated, toast]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setIsCorrect(null); // Reset the correction status
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null) {
      toast({
        title: 'Selection required',
        description: 'Please select an answer before submitting.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await submitQuizAnswer(currentQuestion.id, selectedOption);
      setIsCorrect(response.is_correct);

      if (response.is_correct) {
        toast({
          title: 'Correct!',
          description: `You earned ${response.points_earned} points!`,
          variant: 'default',
        });

        if (response.new_badges && response.new_badges.length > 0) {
          toast({
            title: 'New Badge Earned!',
            description: `You've earned the ${response.new_badges[0].name} badge!`,
            variant: 'default',
          });
        }
      } else {
        toast({
          title: 'Incorrect',
          description: 'Try again with another question!',
          variant: 'destructive',
        });
      }

      // Move to the next question after a short delay
      setTimeout(() => {
        // Move to next question if available, otherwise cycle back to the first question
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
          setCurrentQuestionIndex(0);
        }
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1500);
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your answer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Environmental Quiz</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Environmental Quiz</h1>
        <Card className="p-6 text-center">
          <p>No quiz questions available at the moment. Please check back later!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Environmental Quiz</h1>
      <div className="w-full max-w-3xl mx-auto">
        <Card className="p-6">
          <div className="mb-4 text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedOption === index 
                    ? isCorrect === null 
                      ? 'bg-primary text-white'
                      : isCorrect 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => !isSubmitting && isCorrect === null && handleOptionSelect(index)}
              >
                {option}
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null || isSubmitting || isCorrect !== null}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizPage;
