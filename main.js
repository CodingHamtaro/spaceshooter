const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const Inert = require('inert');

let win;

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 1903, host: 'localhost' });

server.register(Inert, () => {});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: './app',
            listing: true
        }
    }
});

createWindow = () => {
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log(`Server running at: ${server.info.uri}`);
    });

    win = new BrowserWindow({
        minWidth: 960,
        minHeight: 750,
        width: 960,
        height: 750,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.setMenu(null);
    win.loadURL(url.format({
        pathname: '0.0.0.0:1903',
        protocol: 'http',
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
        server.stop()
        app.quit();
    }
})