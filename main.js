const { app, BrowserWindow, ipcMain } = require('electron');
const storage = require('electron-json-storage');
const updater = require('./updater');

let win;

function createWindow() {
  // Create the browser window
  win = new BrowserWindow({
    width: 800,
    height: 164,
    useContentSize: true,
    resizable: false,
    fullscreenable: false,
    maximizable: false,
  });

  // Load the index.html of the app
  win.loadURL(`file://${__dirname}/index.html`);

  // Open dev tools
  win.webContents.openDevTools();

  // Emmited when the window is closed
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('version', (event) => {
  storage.get('version.json', (err, data) => {
    if (err) throw err;
    if (typeof data.version === 'number') {
      event.sender.send('version-reply', data.version);
    } else {
      storage.set('version', { version: 0 }, (error) => {
        if (error) throw error;
      });
    }
  });
});

ipcMain.on('update', (event) => {
  updater.getPackage(event);
});

ipcMain.on('set-latest-version', (event, version) => {
  storage.set('version', { version }, (error) => {
    if (error) throw error;
  });
});
