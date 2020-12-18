// Modules to control application life and create native browser window
const {app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  })
  // and load the index.html of the app.
  mainWindow.loadFile('app/index.html')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
global.startData = "data";
// This will catch clicks on links such as <a href="foobar://abc=1">open in foobar</a>
app.on('open-url', function (event, data) {
  event.preventDefault();
  global.startData = data;
});

app.setAsDefaultProtocolClient('zoomrxRecorder');

// Export so you can access it from the renderer thread
