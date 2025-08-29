import { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAnswer('');

    try {
      const response = await fetch('http://localhost:3001/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: prompt }),
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error('Error fetching response:', error);
      setAnswer('Failed to get response. Is the backend server running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>LawPal AI</h1>
      <p className="subtitle">Your AI-Powered Legal Assistant</p>
      
      <form onSubmit={handleSubmit} className="query-form">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a legal question..."
          rows="3"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Getting Answer...' : 'Ask'}
        </button>
      </form>

      {answer && (
        <div className="answer-container">
          <h2>Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;