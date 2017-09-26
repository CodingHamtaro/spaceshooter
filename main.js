const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let win;

createWindow = () => {
    win = new BrowserWindow({
        minWidth: 960,
        minHeight: 750,
        width: 960,
        height: 750,
        resizable: false,
        useContentSize: true,
        center: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.setMenu(null);
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/app/index.html'),
        protocol: 'file',
        slashes: true
    }));
    win.webContents.openDevTools();
    win.on('closed', () => {
        win = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})