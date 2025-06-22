import React, { useState } from 'react';
import axios from 'axios';
import { Send, Bot } from 'lucide-react';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const res = await axios.post('http://localhost:8000/ask', { query: inputValue }, {
  headers: {
    'Content-Type': 'application/json',
  },
});

      setResponse(res.data.response || 'No response received.');
    } catch (error) {
      let errorMsg = 'Unknown error';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      setResponse(`❌ Error: ${errorMsg}. Please try again or check the server.`);
      console.error('API Error:', error); // Debug log
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">🌾 Agri Assistant</h1>
          <p className="text-green-600">Ask your farming questions</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Input Section */}
          <div className="mb-6">
            <label htmlFor="userInput" className="block text-sm font-medium text-gray-700 mb-2">
              Ask a farming question
            </label>
            <textarea
              id="userInput"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. What fertilizer is best for maize?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              rows={3}
              disabled={isLoading}
            />
            <button
              id="submitBtn"
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isLoading}
              className="mt-3 flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Submit 🌱</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Response Section */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Bot className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-gray-800">AI Response</h3>
            </div>
            <div
              id="responseBox"
              className="min-h-[100px] p-4 bg-gray-50 rounded-lg border"
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-20">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              ) : response ? (
                <div className="text-gray-800 whitespace-pre-wrap">
                  {response}
                </div>
              ) : (
                <div className="text-gray-500 italic text-center flex items-center justify-center h-20">
                  Your farming advice will appear here...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

