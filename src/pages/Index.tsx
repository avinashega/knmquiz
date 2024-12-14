import { useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { QuizCard } from "@/components/QuizCard";
import { QuizProgress } from "@/components/QuizProgress";
import { allQuestions, shuffleQuestions } from "@/data/quizData";
import type { QuizState } from "@/types/quiz";

const Index = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    showAnswer: false,
    language: 'dutch',
    questions: shuffleQuestions(allQuestions),
  });

  const handleLanguageChange = (language: 'dutch' | 'english') => {
    setQuizState(prev => ({
      ...prev,
      language,
    }));
  };

  const handleNext = () => {
    if (quizState.currentQuestion < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        showAnswer: false,
      }));
    } else {
      // Reset quiz with new shuffled questions
      setQuizState(prev => ({
        ...prev,
        currentQuestion: 0,
        questions: shuffleQuestions(allQuestions),
        score: 0,
      }));
    }
  };

  const handleScore = () => {
    setQuizState(prev => ({
      ...prev,
      score: prev.score + 1,
    }));
  };

  if (!quizState.questions.length) {
    return <LanguageSelector onSelectLanguage={handleLanguageChange} />;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <QuizProgress
        current={quizState.currentQuestion}
        total={quizState.questions.length}
        score={quizState.score}
      />
      <QuizCard
        question={quizState.questions[quizState.currentQuestion]}
        language={quizState.language}
        onNext={handleNext}
        onScore={handleScore}
      />
    </div>
  );
};

export default Index;