import { useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { QuizCard } from "@/components/QuizCard";
import { QuizProgress } from "@/components/QuizProgress";
import { allQuestions, shuffleQuestions } from "@/data/quizData";
import type { QuizState } from "@/types/quiz";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with Logo */}
      <header className="py-6 bg-white shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-dutch-blue mr-2" />
          <h1 className="text-2xl font-bold text-dutch-blue">KNM Quiz</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {!quizState.questions.length ? (
          <LanguageSelector onSelectLanguage={handleLanguageChange} />
        ) : (
          <>
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
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 bg-white border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            Made by Avinash Ega | <Link to="/questions" className="text-blue-600 hover:underline">View All Questions</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;