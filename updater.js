const download = require('download');
const fs = require('fs');
const mv = require('mv');
const os = require('os');
const rimraf = require('rimraf');

const src = './elvui.git';
let ipcEvent;

function moveConfig(path) {
  process.stdout.write('Moving config folder...\n');
  const configDest = `${path}ElvUI_Config`;
  rimraf(configDest, { disableGlob: true }, (rmErr) => {
    if (rmErr) throw rmErr;
    mv(`${src}/ElvUI_Config`, configDest, { clobber: true }, (err) => {
      if (err) throw err;
      process.stdout.write('ElvUI successfully updated!\n');
      try {
        process.stdout.write('Cleaning up...\n');
        const files = fs.readdirSync(src);
        if (files !== null && files.length === 0) {
          fs.rmdirSync(src);
        }
        process.stdout.write('Done!');
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
    if (rmErr) throw rmErr;
    mv(`${src}/ElvUI`, mainDest, { clobber: true }, (err) => {
      if (err) throw err;
      moveConfig(path);
    });
  });
}

function getPackage(event) {
  ipcEvent = event;
  const darwinPath = '/Applications/World of Warcraft/Interface/AddOns/';
  const win32Path = 'C:\\Program\ Files\ (x86)\\World\ of\ Warcraft\\Interface\\AddOns\\';
  download('http://git.tukui.org/Elv/elvui/repository/archive.zip?reg=master', './', { extract: true }).then(() => {
    process.stdout.write('Download succeeded...\n');

    if (os.platform() === 'darwin') {
      process.stdout.write('Moving main folder...\n');
      moveMain(darwinPath);
    } else if (os.platform() === 'win32') {
      moveMain(win32Path);
    }
  });
}


module.exports = { getPackage };
