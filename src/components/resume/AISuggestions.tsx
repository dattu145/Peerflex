// src/components/resume/AISuggestions.tsx
import React, { useState } from 'react';
import { Wand2, Sparkles, Copy, Check } from 'lucide-react';
import { ResumeData } from '../../types/resume';
import Button from '../ui/Button';

interface AISuggestionsProps {
  resumeData: ResumeData;
  onApplySuggestion: (suggestion: string) => void;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ resumeData, onApplySuggestion }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateSuggestions = async (type: string) => {
    setIsLoading(true);
    try {
      // Integrate with Gemini AI API
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          resumeData,
          prompt: `Generate professional ${type} suggestions based on this resume data`
        })
      });
      
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('AI suggestion error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Wand2 className="h-5 w-5 text-purple-600" />
        <h4 className="font-semibold text-gray-900 dark:text-white">AI Suggestions</h4>
      </div>
      
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => generateSuggestions('summary')}
          disabled={isLoading}
          leftIcon={<Sparkles className="h-4 w-4" />}
        >
          {isLoading ? 'Generating...' : 'Improve Summary'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => generateSuggestions('skills')}
          disabled={isLoading}
          leftIcon={<Sparkles className="h-4 w-4" />}
        >
          {isLoading ? 'Generating...' : 'Suggest Skills'}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{suggestion}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onApplySuggestion(suggestion)}
                >
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(suggestion, index)}
                  leftIcon={copiedIndex === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                >
                  {copiedIndex === index ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AISuggestions;