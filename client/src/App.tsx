import { useState, useEffect } from 'react';
import './App.css';
import { checkHealth } from './services/api';
import type { HealthResponse } from './types';

function App() {
  const [serverHealth, setServerHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    checkHealth()
      .then((data) => {
        if (!ignore) {
          setServerHealth(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to connect to backend server');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkHealth();
      setServerHealth(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to connect to backend server');
      setServerHealth(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="badge">AadhaarLens Platform</div>
        <h1>AadhaarLens</h1>
        <p className="subtitle">
          Identity Verification &amp; Document Intelligence Stack
        </p>
      </header>

      <main className="status-grid">
        <section className="card">
          <h2>Client Status</h2>
          <div className="status-pill status-online">
            <span className="dot"></span> Online (Vite + React + TypeScript)
          </div>
          <p className="description">
            Client app initialized with structured components, hooks, services, and types.
          </p>
        </section>

        <section className="card">
          <h2>Server Status</h2>
          {loading && <div className="status-pill status-loading">Checking server...</div>}
          {!loading && serverHealth && (
            <div className="status-pill status-online">
              <span className="dot"></span> Connected ({serverHealth.service})
            </div>
          )}
          {!loading && error && (
            <div className="status-pill status-offline">
              <span className="dot"></span> Disconnected
            </div>
          )}

          <p className="description">
            {serverHealth ? (
              <>
                <strong>Status:</strong> {serverHealth.status} <br />
                <strong>Uptime:</strong> {serverHealth.uptime.toFixed(1)}s <br />
                <strong>Timestamp:</strong> {new Date(serverHealth.timestamp).toLocaleTimeString()}
              </>
            ) : (
              <span>
                Backend server is unreachable. Run <code>pnpm run dev:server</code> to start it.
              </span>
            )}
          </p>

          <button type="button" className="retry-btn" onClick={handleRefresh}>
            Refresh Status
          </button>
        </section>
      </main>

      <footer className="app-footer">
        <p>AadhaarLens &bull; Workspace initialized with Client &amp; Server architecture</p>
      </footer>
    </div>
  );
}

export default App;
