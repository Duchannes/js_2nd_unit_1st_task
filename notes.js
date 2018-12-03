const fs = require('fs');
const xlsx = require('xlsx');
const pathLib = require('path');

const removeNote = function (allNotes, title) {
  const updatedNotes = allNotes.filter(element => {
    if (element.title.toLowerCase() !== title.toLowerCase()) {
      return element;
    }
  });
  if (allNotes.length === updatedNotes.length) {
    throw new Error(`Note with the "${title}" title don't exists`);
  }
  return updatedNotes;
};

const showNote = function (allNotes, title) {
  console.clear();
  const note = allNotes.filter(element => {
    if (element.title.toLowerCase() === title.toLowerCase()) {
      console.log('Note:');
      Object.keys(element).forEach(key => {
        console.log(key + ': ' + element[key]);
      });
      return element;
    }
  });
  if (!note.length) { throw new Error(`Note with the title "${title}" wasn't found`); }
};

const showAllNotes = function (allNotes) {
  console.clear();
  console.log('List of all notes:');
  allNotes.forEach(note => {
    console.log('- - -');
    Object.keys(note).forEach(key => {
      console.log(key + ': ' + note[key]);
    });
  });
  console.log('- - -');
};

const writeToFile = function (allNotes, path) {
  fs.writeFileSync(path, JSON.stringify(allNotes, null, ' '));
};

const checkTitleExistence = function (allNotes, title) {
  allNotes.forEach(note => {
    if (note.title === title) throw new Error(`Note with the "${title}" title already exists`);
  });
};

const updateNote = function (allNotes, title, newTitle, newBody) {
  let someChange = false;
  const notes = allNotes.map(element => {
    if (element.title.toLowerCase() === title.toLowerCase()) {
      element.title = newTitle || element.title;
      element.body = newBody || element.body;
      someChange = true;
    };
    return element;
  });
  if (!someChange) { throw new Error(`Note with the title "${title}" wasn't found`); }
  return notes;
};

const toJson = function (allNotes, path) {
  const workbook = xlsx.readFile(path);
  const sheetNameList = workbook.SheetNames;
  let xlsxData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
  xlsxData = checkData(xlsxData, allNotes);
  return allNotes.concat(xlsxData);
};

const checkData = function (xlsxData, allNotes) {
  let titles = allNotes.map(note => {
    return note.title;
  });
  console.log(titles);
  const correctData = xlsxData.filter(note => {
    if (note.body && note.title) {
      if (!titles.includes(note.title)) {
        titles.push(note.title);
        return note;
      } else { console.log(`Note with the title ${note.title} already exists. This note will skipped.`); }
    } else { console.log(`Note without title or body was found. This note will skipped.`); }
  });
  return correctData;
};

const toXlsx = function (allNotes, path, outPath) {
  const ws = xlsx.utils.json_to_sheet(allNotes);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Notes');
  let pathToFile = outPath ? `${outPath}/${pathLib.basename(path).replace('.json', '.xlsx')}` : path.replace('.json', '.xlsx');
  xlsx.writeFile(wb, pathToFile);
  console.log(`XLSX file - ${pathToFile} was succesfully created.`);
};

const readFile = function (path) {
  if (!fs.existsSync(path)) { throw new Error(`File "${path}" not found`); }
  return require(path);
};

const getDateString = function () {
  const date = new Date();
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${new Date().toLocaleTimeString()}`;
};

const addNote = function (allNotes, title, body) {
  allNotes.push({ title: title, body: body, date: getDateString() });
  return allNotes;
};

const sort = function (allNotes, type, order) {
  switch (order) {
    case 'desc':
      order = -1;
      break;
    case 'asc':
      order = 1;
      break;
    default:
      throw new Error('Wrong sorting order. Use:\ndesc - descending\nasc - ascending');
  }
  switch (type) {
    case 'date':
      allNotes.sort(function (a, b) {
        if (!a.date && !b.date) { return 0; }
        if (!a.date) { return -1 * order; }
        if (!b.date) { return 1 * order; }
        if (a.date > b.date) { return order; }
        if (a.name < b.name) { return (-1) * order; }
        return 0;
      });
      break;
    case 'titleLength':
      allNotes.sort(function (a, b) {
        if (a.title.length > b.title.length) { return order; }
        if (a.title.length < b.title.length) { return (-1) * order; }
        return 0;
      });
      break;
    case 'noteLength':
      allNotes.sort(function (a, b) {
        if (a.body.length > b.body.length) { return order; }
        if (a.body.length < b.body.length) { return (-1) * order; }
        return 0;
      });
      break;
    case 'title':
      allNotes.sort(function (a, b) {
        return a.title.localeCompare(b.title) * order;
      });
      break;
    default:
      throw new Error('Wrong sorting type. Use:\ndate - by date\ntitleLength - by title length\nnoteLength - by noteLength\ntitle - by title');
  }
  return allNotes;
};

exports.removeNote = removeNote;
exports.showNote = showNote;
exports.showAllNotes = showAllNotes;
exports.writeToFile = writeToFile;
exports.checkTitleExistence = checkTitleExistence;
exports.updateNote = updateNote;
exports.toJson = toJson;
exports.toXlsx = toXlsx;
exports.readFile = readFile;
exports.addNote = addNote;
exports.sort = sort;
