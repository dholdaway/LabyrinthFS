const { app, BrowserWindow, ipcMain, dialog } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Adjust for Electron security recommendations
      enableRemoteModule: true // For Electron 9 or later
    }
  });

  win.loadFile('index.html');
}

app.on('ready', createWindow);

// Listen for an open-dialog event from the renderer process
ipcMain.on('open-dialog', (event) => {
  dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  }).then(result => {
    if (!result.canceled) {
      event.sender.send('selected-directory', result.filePaths[0]);
    }
  }).catch(err => {
    console.log(err);
  });
});
