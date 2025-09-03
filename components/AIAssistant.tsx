
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const AIAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const presetPrompts = [
    "Draft a post-op instruction email for a wisdom tooth extraction.",
    "Explain the pros and cons of dental implants vs. a bridge for a patient.",
    "Summarize the latest research on periodontal disease treatment.",
    "Create a marketing email for a teeth whitening promotion."
  ];

  const handleSubmit = async (currentPrompt: string) => {
    if (!currentPrompt.trim()) return;

    setIsLoading(true);
    setResponse('');
    setError('');

    try {
        const result = await ai.models.generateContent({
            model,
            contents: `As an AI assistant for a dentist, provide a helpful and professional response to the following query: "${currentPrompt}"`,
        });
        setResponse(result.text);
    } catch (err) {
      console.error("AI Assistant Error:", err);
      setError("I'm sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePresetClick = (preset: string) => {
    setPrompt(preset);
    handleSubmit(preset);
  }

  return (
    <div className="bg-surface p-6 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Assistant</h3>
      <p className="text-sm text-subtle mb-4">Your intelligent partner for clinical and administrative tasks. Ask anything.</p>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600 mb-2">Try a preset prompt:</p>
        <div className="flex flex-wrap gap-2">
            {presetPrompts.map((p, i) => (
                 <button key={i} onClick={() => handlePresetClick(p)} disabled={isLoading} className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-100 disabled:opacity-50 transition">
                    {p}
                 </button>
            ))}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col bg-gray-50 rounded-lg p-4 overflow-y-auto mb-4">
        {response ? (
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">{response}</div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-subtle">
            {isLoading ? 'Thinking...' : 'Your AI response will appear here.'}
          </div>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      
      <div className="mt-auto flex items-center gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., How to handle a patient with dental anxiety?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={2}
          onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(prompt);
              }
          }}
        />
        <button
          onClick={() => handleSubmit(prompt)}
          disabled={isLoading}
          className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-600 disabled:bg-gray-400 transition-colors duration-200"
        >
          {isLoading ? '...' : 'Ask'}
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
