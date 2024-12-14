import { Button } from "@/components/ui/button";

interface LanguageSelectorProps {
  onSelectLanguage: (language: 'dutch' | 'english') => void;
}

export const LanguageSelector = ({ onSelectLanguage }: LanguageSelectorProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8 animate-fadeIn">
      <h1 className="text-4xl font-bold text-dutch-blue">Dutch Integration Quiz</h1>
      <p className="text-lg text-gray-600">Choose your preferred language:</p>
      <div className="space-x-4">
        <Button
          onClick={() => onSelectLanguage('dutch')}
          className="bg-dutch-orange hover:bg-dutch-orange/90 text-white"
        >
          Nederlands
        </Button>
        <Button
          onClick={() => onSelectLanguage('english')}
          className="bg-dutch-blue hover:bg-dutch-blue/90 text-white"
        >
          English
        </Button>
      </div>
    </div>
  );
};