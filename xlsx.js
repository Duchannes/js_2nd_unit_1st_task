const xlsx = require('xlsx');
const pathLib = require('path');

const toJson = function (allNotes, path) {
  const workbook = xlsx.readFile(path);
  const sheetNameList = workbook.SheetNames;
  let xlsxData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
  xlsxData = checkData(xlsxData, allNotes);
  return allNotes.concat(xlsxData);
};

function checkData (xlsxData, allNotes) {
  let titles = allNotes.map(note => {
    return note.title;
  });
  const correctData = xlsxData.filter(note => {
    if (note.body && note.title) {
      if (!titles.includes(note.title)) {
        console.log(`Note "${JSON.stringify(note)}" was imported`);
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

exports.toJson = toJson;
exports.toXlsx = toXlsx;
