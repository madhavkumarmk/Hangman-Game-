import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, Server, Globe, Terminal, Shield, RefreshCw } from 'lucide-react';
import { sound } from '../utils/audio';

import { ThemeMode } from '../types';

interface ApiExplorerTabProps {
  theme?: ThemeMode;
}

export const ApiExplorerTab: React.FC<ApiExplorerTabProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [healthStatus, setHealthStatus] = useState<{ status: string; activeSessions: number; version: string } | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<'new' | 'guess' | 'words' | 'docs'>('new');
  
  // Playground state
  const [activeGameId, setActiveGameId] = useState<string>('');
  const [guessLetter, setGuessLetter] = useState<string>('p');
  const [difficultyInput, setDifficultyInput] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [categoryInput, setCategoryInput] = useState<string>('codealpha-task');

  // Response state
  const [responseCode, setResponseCode] = useState<number | null>(null);
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [responsePayload, setResponsePayload] = useState<unknown>(null);
  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Check health on mount
  const checkHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealthStatus(data);
      }
    } catch {
      // offline or dev error
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleExecuteRequest = async () => {
    sound.playKey();
    setRequestLoading(true);
    const start = performance.now();

    try {
      let url = '/api/game/new';
      let options: RequestInit = {};

      if (selectedEndpoint === 'new') {
        url = '/api/game/new';
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ difficulty: difficultyInput, category: categoryInput })
        };
      } else if (selectedEndpoint === 'guess') {
        url = '/api/game/guess';
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId: activeGameId || 'sample_id', letter: guessLetter })
        };
      } else if (selectedEndpoint === 'words') {
        url = `/api/words?category=${encodeURIComponent(categoryInput)}&difficulty=${encodeURIComponent(difficultyInput)}`;
        options = { method: 'GET' };
      } else if (selectedEndpoint === 'docs') {
        url = '/api/docs';
        options = { method: 'GET' };
      }

      const res = await fetch(url, options);
      const latency = Math.round(performance.now() - start);
      setResponseCode(res.status);
      setResponseLatency(latency);

      const json = await res.json();
      setResponsePayload(json);

      if (selectedEndpoint === 'new' && json.gameId) {
        setActiveGameId(json.gameId);
      }
    } catch (err: unknown) {
      setResponseCode(500);
      setResponsePayload({ error: err instanceof Error ? err.message : 'Request failed' });
    } finally {
      setRequestLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    sound.playKey();
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // Code generation for python requests
  const getPythonSnippet = () => {
    if (selectedEndpoint === 'new') {
      return `import requests

url = "http://localhost:3000/api/game/new"
payload = {
    "difficulty": "${difficultyInput}",
    "category": "${categoryInput}"
}

response = requests.post(url, json=payload)
data = response.json()
print("Game ID:", data["gameId"])
print("Masked Word:", data["maskedWord"])
print("Mistakes Left:", data["mistakesRemaining"])`;
    }

    if (selectedEndpoint === 'guess') {
      return `import requests

url = "http://localhost:3000/api/game/guess"
payload = {
    "gameId": "${activeGameId || 'YOUR_GAME_ID'}",
    "letter": "${guessLetter}"
}

response = requests.post(url, json=payload)
data = response.json()
print("Result:", data["message"])
print("Word Status:", data["maskedWord"])
print("Mistakes Left:", data["mistakesRemaining"])`;
    }

    return `import requests

response = requests.get("http://localhost:3000/api/words")
print(response.json())`;
  };

  const getCurlSnippet = () => {
    if (selectedEndpoint === 'new') {
      return `curl -X POST http://localhost:3000/api/game/new \\
  -H "Content-Type: application/json" \\
  -d '{"difficulty":"${difficultyInput}","category":"${categoryInput}"}'`;
    }
    if (selectedEndpoint === 'guess') {
      return `curl -X POST http://localhost:3000/api/game/guess \\
  -H "Content-Type: application/json" \\
  -d '{"gameId":"${activeGameId || 'GAME_ID'}","letter":"${guessLetter}"}'`;
    }
    return `curl -X GET http://localhost:3000/api/words`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Top Banner */}
      <div
        className={`rounded-2xl border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div>
          <div className={`flex items-center gap-2 text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Hangman Web API</span>
            <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-400'}>·</span>
            <span>RESTful Web Service</span>
          </div>
          <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span>Backend API &amp; Web Services</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </h2>
          <p className={`text-xs mt-1 max-w-xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Full-stack Express backend mounted with live session management, input validation, and difficulty parameters.
          </p>
        </div>

        {/* Live Service Status */}
        <div
          className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex flex-col text-right">
            <span className="text-[11px] text-slate-500 font-mono">Service Status</span>
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <Server className="w-3.5 h-3.5" />
              <span>{healthStatus?.status === 'ok' ? 'Online · 200 OK' : 'Ready'}</span>
            </span>
          </div>
          <button
            onClick={checkHealth}
            disabled={healthLoading}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Ping API health"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Interactive API Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Request Configuration */}
        <div
          className={`lg:col-span-6 rounded-2xl border p-5 flex flex-col gap-4 transition-colors ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Interactive Request Builder
            </span>
            <span className="text-[11px] font-mono text-slate-500">HTTP REST</span>
          </div>

          {/* Endpoint Selector */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl border text-xs font-mono transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => setSelectedEndpoint('new')}
              className={`p-2 rounded-lg text-left transition-all cursor-pointer ${
                selectedEndpoint === 'new'
                  ? isDark
                    ? 'bg-slate-800 text-emerald-400 font-bold shadow-sm'
                    : 'bg-white text-emerald-700 font-bold shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="text-[10px] text-emerald-500">POST</div>
              <div className="truncate">/game/new</div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('guess')}
              className={`p-2 rounded-lg text-left transition-all cursor-pointer ${
                selectedEndpoint === 'guess'
                  ? isDark
                    ? 'bg-slate-800 text-emerald-400 font-bold shadow-sm'
                    : 'bg-white text-emerald-700 font-bold shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="text-[10px] text-emerald-500">POST</div>
              <div className="truncate">/game/guess</div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('words')}
              className={`p-2 rounded-lg text-left transition-all cursor-pointer ${
                selectedEndpoint === 'words'
                  ? isDark
                    ? 'bg-slate-800 text-sky-400 font-bold shadow-sm'
                    : 'bg-white text-sky-700 font-bold shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="text-[10px] text-sky-500">GET</div>
              <div className="truncate">/words</div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('docs')}
              className={`p-2 rounded-lg text-left transition-all cursor-pointer ${
                selectedEndpoint === 'docs'
                  ? isDark
                    ? 'bg-slate-800 text-sky-400 font-bold shadow-sm'
                    : 'bg-white text-sky-700 font-bold shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="text-[10px] text-sky-500">GET</div>
              <div className="truncate">/docs</div>
            </button>
          </div>

          {/* Dynamic Form Parameters */}
          <div className="flex flex-col gap-3 text-xs">
            {selectedEndpoint === 'new' && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-medium">Difficulty Level</label>
                  <select
                    value={difficultyInput}
                    onChange={(e) => setDifficultyInput(e.target.value as 'easy' | 'medium' | 'hard')}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="easy">Easy (8 tries limit · Simple words)</option>
                    <option value="medium">Medium (6 tries limit · CodeAlpha Standard)</option>
                    <option value="hard">Hard (4 tries limit · Advanced words)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-medium">Category</label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="codealpha-task">codealpha-task</option>
                    <option value="python-core">python-core</option>
                    <option value="software-eng">software-eng</option>
                  </select>
                </div>
              </>
            )}

            {selectedEndpoint === 'guess' && (
              <>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-400 font-medium">Active Game ID</label>
                    {!activeGameId && (
                      <span className="text-[10px] text-amber-400">Click &quot;POST /game/new&quot; first</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={activeGameId}
                    onChange={(e) => setActiveGameId(e.target.value)}
                    placeholder="e.g. game_abc123"
                    className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-medium">Letter Guess</label>
                  <input
                    type="text"
                    maxLength={1}
                    value={guessLetter}
                    onChange={(e) => setGuessLetter(e.target.value.toLowerCase())}
                    placeholder="a-z"
                    className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono font-bold text-center w-16 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            {(selectedEndpoint === 'words' || selectedEndpoint === 'docs') && (
              <p className="text-slate-400 leading-relaxed py-2">
                This endpoint does not require a request body. It retrieves database word entries or schema documentation directly from Express.
              </p>
            )}
          </div>

          {/* Execute Button */}
          <button
            onClick={handleExecuteRequest}
            disabled={requestLoading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer mt-1"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${requestLoading ? 'animate-pulse' : ''}`} />
            <span>Send Request</span>
          </button>
        </div>

        {/* Right: Live Response Viewer */}
        <div className="lg:col-span-6 bg-[#0b101b] rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300 font-semibold">Response Payload</span>
            {responseCode !== null && (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    responseCode >= 200 && responseCode < 300
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {responseCode}
                </span>
                <span className="text-slate-500">{responseLatency}ms</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#060a12] min-h-[300px] max-h-[400px] overflow-y-auto terminal-scroll font-mono text-xs text-slate-300">
            {responsePayload ? (
              <pre className="text-emerald-300 leading-relaxed">
                <code>{JSON.stringify(responsePayload, null, 2)}</code>
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 py-16">
                <Globe className="w-8 h-8 opacity-40" />
                <span>Click &quot;Send Request&quot; to test the live API</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ready-to-use Client Code Snippets */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Integrate in Python or Terminal
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              CodeAlpha interns can submit this Python script to prove backend API consumption!
            </p>
          </div>

          <button
            onClick={() => handleCopy(getPythonSnippet(), 'python')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedSnippet === 'python' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Python Code</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-[#070b14] rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
          <pre>
            <code>{getPythonSnippet()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
