const electron = require('electron');
// require('../app');

const path = require('path');
const isDev = require('electron-is-dev');
const ffmpeg = require('fluent-ffmpeg');
const pathToFfmpeg = require('ffmpeg-static');
const pathToFfprobe = require('ffprobe-static').path;

const { app, BrowserWindow, ipcMain, shell } = electron;

let mainWindow;
ffmpeg.setFfmpegPath(pathToFfmpeg);
ffmpeg.setFfprobePath(pathToFfprobe);


function getFileName(path) {
  const separator = process.platform === 'win32' ? '\\' : '/';
  return path.substring(path.lastIndexOf(separator) + 1);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    // preload: path.join(app.getAppPath(), 'preload.js')
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
    },
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.resolve(__dirname, '..', 'build', 'index.html')}`,
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('videos:added', (event, videos) => {

  const promises = videos.map(video => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(video.path, (err, metadata) => {
        resolve({
          ...video,
          duration: metadata.format.duration,
          format: 'avi',
          metadata
        });
      })
    })
  });

  Promise.all(promises).then((results) => {
    // console.log('electron.js@metadata:complete', results)
    mainWindow.webContents.send('metadata:complete', results);
  });
});

ipcMain.on('conversion:start', (event, videos) => {

  videos.forEach((video) => {

    const outputDirectory = video.path.split(video.name)[0];
    const outputName = video.name.split('.')[0];
    const outputPath = `${outputDirectory}${outputName}_converted.${video.format}`;



    try {
      ffmpeg(video.path)
        .output(outputPath)
        .on('progress', ({ timemark }) =>
          mainWindow.webContents.send('conversion:progress', { video, timemark })
        )
        .on('end', () =>
          mainWindow.webContents.send('conversion:end', { video, outputPath })
        )
        .run();
    } catch (error) {
      console.log(error);
    }
  });
});

ipcMain.on('folder:open', (event, outputPath) => {
  shell.showItemInFolder(outputPath);
});

