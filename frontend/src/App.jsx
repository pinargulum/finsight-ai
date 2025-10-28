import "./App.css";
import { useState } from "react";
import { analyzeText } from "./services/api";
import Header from "./pages/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const logingForm = () => {
    setShowForm(true);
  };
  const registerForm = () => {
    setShowRegisterForm(true);
  };
  const closeLoginForm = () => {
    setShowForm(false);
  };
  const closeRegisterForm = () => {
    setShowRegisterForm(false);
  };
  const handleAnalyze = async () => {
    try {
      setLoading(true);
      const data = await analyzeText(prompt);
      setResult(data.response || "No result");
    } catch (err) {
      console.error(err);
      setResult("Error fetching analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <Header
        logingForm={logingForm}
        registerForm={registerForm}
      />
       <Register
        onClose={closeRegisterForm}
        showRegisterForm={showRegisterForm}
      />
      <Login
        showForm={showForm}
        onClose={closeLoginForm}
      />
      <div className="main-container">
        <h1 className="main-title">Welcome to FinSight AI</h1>

        <p className="main-helper">
          Enter any financial text or question and click Analyze.
        </p>
        <textarea
          className="main-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Summarize Tesla's 2024 performance"
        />
        <div>
          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
        {result && (
          <div className="result">
            <strong>Result:</strong>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
