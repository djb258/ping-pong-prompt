import React, { useState } from 'react';
import { PingPongEngine, AgentType } from '../core/pingPongEngine';

/**
 * Props for PingPongPromptUI
 * @param engine - An instance of PingPongEngine (manages all logic/state)
 */
interface PingPongPromptUIProps {
  engine: PingPongEngine;
}

export const PingPongPromptUI: React.FC<PingPongPromptUIProps> = ({ engine }) => {
  // Local state for editable prompt
  const [prompt, setPrompt] = useState(engine.getCurrentPrompt());
  const [_, setRerender] = useState(0); // Forcing rerender on engine updates

  // Helper to force rerender
  const forceUpdate = () => setRerender((n) => n + 1);

  // Handlers
  function handleAgentRefine(agent: AgentType) {
    engine.refine(agent);
    setPrompt(engine.getCurrentPrompt());
    forceUpdate();
  }
  function handleApplyEdit() {
    engine.applyManualEdit(prompt);
    setPrompt(engine.getCurrentPrompt());
    forceUpdate();
  }
  function handleJump(version: string) {
    const p = engine.jumpToVersion(version);
    if (p) setPrompt(p);
    forceUpdate();
  }
  function handleGo() {
    engine.triggerGo();
    forceUpdate();
  }

  // Render
  const history = engine.getHistory();
  const currentVersion = engine.getCurrentVersion().version;
  const agentTurn = engine.getAgentTurn();
  const goTriggered = engine.isGoTriggered();
  const currentVersionObj = engine.getCurrentVersion();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-900">
      {/* Sidebar: Version History */}
      <aside className="w-full md:w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-2">Version History</h2>
        <ul className="space-y-2">
          {history.map((v) => (
            <li
              key={v.version}
              className={`p-2 rounded border ${v.version === currentVersion ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-mono text-xs">{v.version}</span> <span className="text-xs">({v.agent})</span>
                </div>
                <button
                  className="text-xs text-blue-600 underline ml-2"
                  onClick={() => handleJump(v.version)}
                  disabled={v.version === currentVersion}
                >
                  Load
                </button>
              </div>
              <div className="text-xs text-gray-500 truncate">{v.source}</div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-2">Ping-Pong Prompt Refinement</h1>
        <label className="block font-semibold mb-1">Current Working Prompt:</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-2 font-mono text-sm bg-white"
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={goTriggered}
        />
        <div className="flex space-x-2 mb-2">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
            onClick={() => handleAgentRefine('A')}
            disabled={goTriggered || agentTurn !== 'A'}
          >
            Agent A Refine
          </button>
          <button
            className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
            onClick={() => handleAgentRefine('B')}
            disabled={goTriggered || agentTurn !== 'B'}
          >
            Agent B Refine
          </button>
          <button
            className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
            onClick={handleApplyEdit}
            disabled={goTriggered}
          >
            Apply Manual Edit
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
            onClick={handleGo}
            disabled={goTriggered}
          >
            GO (Final Research)
          </button>
        </div>
        <div className="text-xs text-gray-500">
          <span>Current Version: </span>
          <span className="font-mono">{currentVersion}</span>
          <span className="ml-2">Agent Turn: <b>{agentTurn}</b></span>
          {goTriggered && <span className="ml-2 text-red-600 font-bold">GO Triggered - Locked for research</span>}
        </div>
        {/* JSON Debug Area */}
        <div className="mt-4">
          <label className="block font-semibold mb-1">STAMPED/SPVPET/STACKED JSON (Current Version):</label>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto border border-gray-200">
            {JSON.stringify(currentVersionObj.json, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
};

