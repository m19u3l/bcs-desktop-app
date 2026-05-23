const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: (name) => ipcRenderer.invoke('get-app-path', name),
  runCommand: (text) => ipcRenderer.invoke('run-command', text),
  saveAudio: (buffer) => ipcRenderer.invoke('save-audio-blob', buffer),
  transcribeAudio: (path) => ipcRenderer.invoke('transcribe-audio', path),

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  openDevTools: () => ipcRenderer.invoke('open-dev-tools'),

  // Platform information
  platform: process.platform,

  // Environment check
  isElectron: true
});

// Security: Remove any Node.js globals that might have leaked
delete window.require;
delete window.exports;
delete window.module;
