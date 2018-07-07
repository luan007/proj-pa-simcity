const { app, BrowserWindow } = require('electron')

var win;
var win2;
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600, transparent: true })
    // and load the index.html of the app.
    win.loadFile('index.html');
    // win.setSimpleFullScreen(true)
    // win.setAlwaysOnTop(true);
    // win.setFullScreen(true);

    setTimeout(() => {
        win2 = new BrowserWindow({ width: 800, height: 600, transparent: true })
        // and load the index.html of the app.
        win2.loadFile('shell.html')
        // win2.setSimpleFullScreen(true)
        // win2.setAlwaysOnTop(true);
        // win2.setOpacity(0);
        // win2.setFullScreen(true);
    }, 3000);
}

app.on('ready', createWindow)