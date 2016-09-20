const download = require('download');
const fs = require('fs');
const mv = require('mv');
const os = require('os');
const rimraf = require('rimraf');

let ipcEvent;

function moveConfig(path) {
  const configDest = `${path}ElvUI_Config`;
  rimraf(configDest, { disableGlob: true }, (rmErr) => {
    if (rmErr) ipcEvent.sender.send('error', rmErr.message);
    mv('./elvui.git/ElvUI_Config', configDest, { clobber: true }, (err) => {
      if (err) if (err) ipcEvent.sender.send('error', err.message);
      try {
        const files = fs.readdirSync('./elvui.git');
        if (files !== null && files.length === 0) {
          fs.rmdirSync('./elvui.git');
        }
        ipcEvent.sender.send('update-done');
      } catch (error) {
        throw error;
      }
    });
  });
}

function moveMain(path) {
  const mainDest = `${path}ElvUI`;
  rimraf(mainDest, { disableGlob: true }, (rmErr) => {
    if (rmErr) ipcEvent.sender.send('error', rmErr.message);
    mv('./elvui.git/ElvUI', mainDest, { clobber: true }, (err) => {
      if (err) ipcEvent.sender.send('error', err.message);
      moveConfig(path);
    });
  });
}

function getPackage(event) {
  ipcEvent = event;
  const darwinPath = '/Applications/World of Warcraft/Interface/AddOns/';
  const win32Path = 'C:\\Program Files (x86)\\World of Warcraft\\Interface\\AddOns\\';

  download('http://git.tukui.org/Elv/elvui/repository/archive.zip?reg=master', './', { extract: true }).then(() => {
    if (os.platform() === 'darwin') {
      moveMain(darwinPath);
    } else if (os.platform() === 'win32') {
      moveMain(win32Path);
    }
  });
}


module.exports = { getPackage };
