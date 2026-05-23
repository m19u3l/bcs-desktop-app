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
  // Start the Express backend server
  const serverPath = path.join(__dirname, 'backend', 'server.mjs');

  backendProcess = spawn('node', [serverPath], {
    cwd: path.join(__dirname, 'backend'),
    env: { ...process.env },
    stdio: 'inherit'
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend server:', err);
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend server exited with code ${code}`);
  });
}

function stopBackendServer() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

// App lifecycle events
app.whenReady().then(() => {
  // Start backend server
  startBackendServer();

  // Wait a bit for server to start before creating window
  setTimeout(() => {
    createWindow();
  }, 1500);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  stopBackendServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
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
