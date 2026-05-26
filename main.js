const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
const { spawn } = require('child_process');
const { handleUserCommand } = require('./src/actionHandler');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#1a1a1a',
    show: false // Don't show until ready
  });

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the renderer
  // Always try dev server first, fallback to built files
  mainWindow.loadURL('http://localhost:5173').catch(() => {
    console.log('Dev server not running, loading from dist...');
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'dist', 'index.html'));
  });

  // Open DevTools in development
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startBackendServer() {
  const serverPath = path.join(__dirname, 'backend', 'server.mjs');

  backendProcess = spawn('node', [serverPath], {
    cwd: path.join(__dirname, 'backend'),
    env: { ...process.env },
    stdio: 'inherit',
    detached: false,
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend server:', err);
  });

  backendProcess.on('exit', (code, signal) => {
    console.log(`Backend server exited with code ${code} signal ${signal}`);
    // Auto-restart if it crashes unexpectedly (not killed by us)
    if (code !== null && code !== 0 && !app.isQuitting) {
      console.log('Restarting backend server in 2s...');
      setTimeout(startBackendServer, 2000);
    }
  });
}

function waitForBackend(maxWait = 15000) {
  const http = require('http');
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      http.get('http://localhost:3000/health', (res) => {
        if (res.statusCode === 200) { resolve(true); return; }
        retry();
      }).on('error', retry);
    };
    const retry = () => {
      if (Date.now() - start > maxWait) { resolve(false); return; }
      setTimeout(check, 400);
    };
    check();
  });
}

function stopBackendServer() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

// App lifecycle events
app.whenReady().then(async () => {
  app.isQuitting = false;
  startBackendServer();

  console.log('Waiting for backend to be ready...');
  const ready = await waitForBackend(15000);
  console.log(ready ? 'Backend ready — opening window.' : 'Backend timeout — opening anyway.');

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  stopBackendServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
  stopBackendServer();
});

const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');

// --- WHISPER & AUDIO IPC ---
ipcMain.handle('transcribe-audio', async (event, audioPath) => {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, 'src', 'whisper_transcribe.py');
    const pythonPath = '/opt/homebrew/bin/python3'; // Absolute path for stability
    
    exec(`"${pythonPath}" "${scriptPath}" "${audioPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Whisper Exec Error: ${error.message}`);
        return resolve({ error: error.message });
      }
      
      if (stderr && !stderr.includes('numba')) {
        console.warn(`⚠️ Whisper Stderr: ${stderr}`);
      }

      try {
        // Find the last line that looks like JSON in case of chatter
        const lines = stdout.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        const result = JSON.parse(lastLine);
        resolve(result);
      } catch (e) {
        console.error(`❌ Failed to parse Whisper output: "${stdout}"`);
        resolve({ error: "Failed to parse Whisper output" });
      }
    });
  });
});

ipcMain.handle('save-audio-blob', async (event, buffer) => {
  const tempPath = path.join(os.tmpdir(), `bcs_audio_${Date.now()}.webm`);
  fs.writeFileSync(tempPath, Buffer.from(buffer));
  return tempPath;
});

// IPC handlers for renderer process communication
ipcMain.handle('run-command', async (event, text) => {
  return await handleUserCommand(text);
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-path', (event, name) => {
  return app.getPath(name);
});

ipcMain.handle('open-dev-tools', () => {
  if (mainWindow) {
    mainWindow.webContents.openDevTools();
  }
});

ipcMain.handle('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
