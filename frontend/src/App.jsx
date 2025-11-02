import "./App.css";
import { useState, useEffect } from "react";
import { analyzeText, logout, getMe, registerUser } from "./services/api";
import Header from "./pages/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState(() => {
    // sayfa yenilenince kalsın
    const saved = localStorage.getItem("analysis_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const me = await getMe();
        const normalized = me?.user ? me.user : me;
        setUser(normalized);
      } catch (err) {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  // open LOGIN modal
  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  // open REGISTER modal
  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const closeLogin = () => setShowLogin(false);
  const closeRegister = () => setShowRegister(false);

  // ÖNEMLİ: login component'i başarılı olunca BURAYI çağıracak
  const handleLoggedIn = async () => {
    try {
      const me = await getMe();
      const normalized = me?.user ? me.user : me;
      setUser(normalized); // 👉 artık Header user'ı görecek
      setShowLogin(false);
      setShowRegister(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Header logout
  const handleLogout = () => {
    logout();
    setUser(null);
  };
  const handleAnalyze = () => {
    try {
      setLoading(true);
      const data = analyzeText(prompt);
      setResult(data.response || "No result");
    } catch (err) {
      console.error(err);
      setResult("Error fetching analysis.");
    } finally {
      setLoading(false);
    }
  };
/*
  const handleAnalyze = () => {
    try {
       setLoading(true);
      const data = analyzeText(prompt);
      setUser()
      setResult(data.response || "No result");
      // add history
      setHistory((prev) => [
        {
          id: Date.now(),
          prompt,
          response: data.response || "",
        },
        ...prev.slice(0, 9), // KEEP LAST 10 
      ]);
    } finally {
      setLoading(false);
    }
  };
  */
  const fillPrompt = (text) => {
    setPrompt(text);
  };
  return (
    <div className="app-shell">
      <Header
        logingForm={openLogin}
        registerForm={openRegister}
        closeLoginForm={closeLogin}
        closeRegisterForm={closeRegister}
        onLogout={handleLogout}
        user={user}
      />
         {showRegister && (
        <Register
          onSuccess={handleLoggedIn}
          onClose={closeRegister}
        />
      )}
      {showLogin && (
        <Login
          onSuccess={handleLoggedIn}
          onClose={closeLogin}
        />
      )}
      <h1>Welcome to FinSight AI</h1>
      <div className="page-grid">
        {/* LEFT BOX */}
        <aside className="side-panel">
          <h2>What can I ask?</h2>
          <ul>
            <li
              onClick={() => fillPrompt("Summarize Tesla's 2024 performance")}
            >
              Summarize Tesla's 2024 performance
            </li>
            <li
              onClick={() =>
                fillPrompt("Compare Apple vs. Microsoft financial metrics")
              }
            >
              Compare Apple vs. Microsoft
            </li>
            <li onClick={() => fillPrompt("Explain this 10-K in simple terms")}>
              Explain 10-K in simple terms
            </li>
          </ul>
        </aside>

        {/* RIGHT BOX */}
        <aside className="history-panel">
          <h2>Recent analyses</h2>
          {history.length === 0 ? (
            <p className="muted">No analyses yet</p>
          ) : (
            <ul>
              {history.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    setPrompt(item.prompt);
                    setResult(item.response);
                  }}
                >
                  <div className="history-prompt">
                    {item.prompt.slice(0, 50)}...
                  </div>
                  <div className="history-small">view</div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
      <main className="main-panel">
        <h2>Enter any financial text or question and click Analyze.</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="main-textarea"
          placeholder="e.g. Summarize Tesla's 2024 performance"
        />
        <button
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
        {result && (
          <div className="result-box">
            <h2>Result</h2>
            <p>{result}</p>
          </div>
        )}
      </main>
      <footer className="footer">FinSight AI · React + FastAPI · Demo</footer>
      {loading && <div className="loading-overlay">Analyzing…</div>}
    </div>
  );
}

export default App;
