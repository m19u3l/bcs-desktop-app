import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Wifi, WifiOff, Send, Trash2, Download, Copy } from 'lucide-react';

const TerminalBridgeView = () => {
  const [connected, setConnected] = useState(false);
  const [output, setOutput] = useState([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const ws = useRef(null);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  // Quick commands
  const quickCommands = [
    { label: 'Help', cmd: 'help' },
    { label: 'DNS Lookup', cmd: 'dns ' },
    { label: 'Port Scan', cmd: 'portscan ' },
    { label: 'Headers', cmd: 'headers ' },
    { label: 'SSL Check', cmd: 'ssl-cert ' },
    { label: 'Cookies', cmd: 'cookies' },
    { label: 'Links', cmd: 'links ' },
    { label: 'Vuln Scan', cmd: 'vuln-scan ' },
    { label: 'Netstat', cmd: 'netstat' },
    { label: 'Gateway', cmd: 'gateway' },
  ];

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const connectWebSocket = () => {
    addOutput('system', 'Connecting to ws://localhost:8765...');

    ws.current = new WebSocket('ws://localhost:8765');

    ws.current.onopen = () => {
      setConnected(true);
      addOutput('system', 'Connected to BCS Terminal Bridge');
    };

    ws.current.onclose = () => {
      setConnected(false);
      addOutput('error', 'Disconnected from server');
      // Auto-reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };

    ws.current.onerror = () => {
      addOutput('error', 'Connection error');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'system') {
          addOutput('system', data.message);
        } else if (data.type === 'result') {
          // Check if it's a browser command
          try {
            const parsed = JSON.parse(data.output);
            if (parsed.type === 'browser_command') {
              const result = eval(parsed.code);
              addOutput('result', `Browser: ${result}`);
            } else if (parsed.type === 'browser_inject') {
              eval(parsed.code);
              addOutput('result', 'Code injected successfully');
            } else {
              addOutput('result', data.output);
            }
          } catch {
            addOutput('result', data.output);
          }
        } else if (data.type === 'error') {
          addOutput('error', data.message);
        }
      } catch {
        addOutput('result', event.data);
      }
    };
  };

  const addOutput = (type, content) => {
    const timestamp = new Date().toLocaleTimeString();
    setOutput(prev => [...prev, { type, content, timestamp }]);
  };

  const sendCommand = () => {
    if (!input.trim() || !connected) return;

    const cmd = input.trim();
    addOutput('command', `$ ${cmd}`);

    ws.current.send(JSON.stringify({ command: cmd }));

    // Add to history
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const copyOutput = () => {
    const text = output.map(o => o.content).join('\n');
    navigator.clipboard.writeText(text);
  };

  const exportOutput = () => {
    const text = output.map(o => `[${o.timestamp}] ${o.content}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-output-${Date.now()}.txt`;
    a.click();
  };

  const handleQuickCommand = (cmd) => {
    setInput(cmd);
    inputRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-green-400 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          <span className="font-bold">BCS Terminal Bridge</span>
          {connected ? (
            <span className="flex items-center gap-1 text-green-500 text-sm">
              <Wifi className="w-4 h-4" /> Connected
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-500 text-sm">
              <WifiOff className="w-4 h-4" /> Disconnected
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyOutput}
            className="p-1 hover:bg-gray-700 rounded"
            title="Copy output"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={exportOutput}
            className="p-1 hover:bg-gray-700 rounded"
            title="Export output"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={clearOutput}
            className="p-1 hover:bg-gray-700 rounded"
            title="Clear output"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-800 border-b border-gray-700">
        {quickCommands.map((qc, i) => (
          <button
            key={i}
            onClick={() => handleQuickCommand(qc.cmd)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            {qc.label}
          </button>
        ))}
      </div>

      {/* Output Area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-3 space-y-1"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {output.map((item, index) => (
          <div key={index} className={`
            ${item.type === 'command' ? 'text-yellow-400' : ''}
            ${item.type === 'error' ? 'text-red-400' : ''}
            ${item.type === 'system' ? 'text-blue-400' : ''}
            ${item.type === 'result' ? 'text-green-400' : ''}
            whitespace-pre-wrap break-all text-sm
          `}>
            {item.content}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 p-3 bg-gray-800 border-t border-gray-700">
        <span className="text-yellow-400">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={connected ? "Enter command..." : "Connecting..."}
          disabled={!connected}
          className="flex-1 bg-transparent outline-none text-green-400 placeholder-gray-500"
          autoFocus
        />
        <button
          onClick={sendCommand}
          disabled={!connected || !input.trim()}
          className="p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default TerminalBridgeView;
