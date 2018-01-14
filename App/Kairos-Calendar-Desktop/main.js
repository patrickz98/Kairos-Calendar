const {app, BrowserWindow} = require('electron');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow(
    {
        height: 700,
        width: 1100
    });

    // mainWindow.loadURL('http://patrickz.ddns.net/Calendar/?userId=patrick');
    // mainWindow.loadURL('http://patrick-macbook.local/Calendar/?userId=patrick');
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    // mainWindow.loadURL('file://' + __dirname + '/app.js');
    // Main.main();
});
