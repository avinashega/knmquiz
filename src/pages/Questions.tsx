import { allQuestions } from "@/data/quizData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Questions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">All Questions and Answers</h1>
        
        <div className="space-y-6">
          {allQuestions.map((q, index) => (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Question {index + 1}</h3>
                  <p className="text-gray-700">{q.questionDutch}</p>
                  <p className="text-gray-500 italic">{q.questionEnglish}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Options:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {q.optionsDutch.map((option, optIndex) => (
                      <li key={optIndex} className={optIndex === q.correctOptionIndex ? "text-green-600 font-medium" : ""}>
                        {option} ({q.optionsEnglish[optIndex]})
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Correct Answer:</h4>
                  <p className="text-green-600">
                    {q.optionsDutch[q.correctOptionIndex]} ({q.optionsEnglish[q.correctOptionIndex]})
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;