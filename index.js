const electron = require('electron');
const fs = require('fs');
const Icon = require('./icon');

const { app, BrowserWindow, ipcMain, screen } = electron;

let mainWindow;
let tray;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width:300,
        height: 500,
        resizable: false,
        frame: false,
        show: false,
        webPreferences: {
            backgroundThrottling: false,
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);
    tray = new Icon('./saturn.png', mainWindow);
    mainWindow.on('show', (ev, d) => {
        displayTime();
    })
});

ipcMain.on('mark', (event, data) => {
    fs.readdir(__dirname, (err, files) => {
        if (err) returnMarked('Erro');
        else {
            if (!files.includes('ponto.csv')) {
                fs.writeFileSync(`${__dirname}/ponto.csv`, `Data\n${new Date}`, {encoding:'utf-8'});
                returnMarked('recorded');
            }
            else {
                fs.readFile(`${__dirname}/ponto.csv`, (errFile, data) => {
                    if (errFile) returnMarked('Erro');
                    else {
                        data = data + `\n${new Date}`;
                        fs.writeFileSync(`${__dirname}/ponto.csv`, data, {encoding:'utf-8'});
                        returnMarked('recorded');
                    }
                });
            }
        }
    });
})

ipcMain.on('oi', (ev, data) => {
    console.log(data);
});

function displayTime() {
    let gmt = new Date();
    let time = `${gmt.getHours()}:${gmt.getMinutes() < 10 ? '0'+gmt.getMinutes():gmt.getMinutes()}`
    mainWindow.webContents.send('time', time);
}

function returnMarked(status) {
    mainWindow.webContents.send(status);
}