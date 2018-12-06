const fs = require('fs');

const writeToFile = function (allNotes, path) {
  fs.writeFileSync(path, JSON.stringify(allNotes, null, ' '));
};

const readFile = function (path) {
  if (!fs.existsSync(path)) {
    console.log(`File "${path}" not found. New File was created`);
    fs.writeFileSync(path, '[\r\n]', 'utf-8');
  }
  return require(path);
};

exports.writeToFile = writeToFile;
exports.readFile = readFile;
