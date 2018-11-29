// Автоввод даты?
const fs = require('fs');
const xlsx = require('xlsx');

const yargs = require('yargs')
  .usage('$0 <cmd> [args]')
  .option('path', {
    alias: 'p',
    describe: 'path to .json file with notes',
    default: './notes.json'
  });

// eslint-disable-next-line no-unused-expressions
yargs
  .command(
    'add <title> <body>',
    'Add new unique note with the <title> and the <body>',
    {},
    function add (argv) {
      let jsonObject = readFile();
      checkTitleExistence(jsonObject, argv.title);
      jsonObject.push({ title: argv.title, body: argv.body, date: getDateString() });
      writeToFile(jsonObject);
      console.clear();
      console.log('Logger:\tNote added successfully.');
    })
  .command(
    'list',
    'List all notes',
    {},
    function list () {
      const jsonObject = readFile();
      showAllNotes(jsonObject);
    })
  .command(
    'read <title>',
    'Read one note by it\'s <title>',
    {},
    function read (argv) {
      const jsonObject = readFile();
      showNote(jsonObject, argv.title);
    })
  .command(
    'remove <title>',
    'Remove one note by it\'s <title>',
    {},
    function remove (argv) {
      let jsonObject = readFile();
      jsonObject = removeNote(jsonObject, argv.title);
      writeToFile(jsonObject);
      console.clear();
      console.log('Note deleted successfully.');
    })
  .command(
    'update <title> [newTitle] [newBody]',
    'Changes a title or body to [newTitle] and [newBody] in a note with a specific <title>. Leave the values blank if you do not want to change them.',
    {},
    function update (argv) {
      const jsonObject = readFile();
      const updatedNotes = updateNote(jsonObject, argv.title, argv.newTitle, argv.newBody);
      writeToFile(updatedNotes);
    })
  .command(
    'toxlsx',
    'Export notes to xlsx file',
    {},
    function toxlsx (argv) {
      const jsonObject = readFile();
      toXlsx(jsonObject);
    })
  .command(
    'tojson [xlsx]',
    'Import notes from xlsx file',
    {},
    function tojson (argv) {
      const jsonObject = readFile();
      const importedData = toJson(jsonObject, argv.xlsx);
      writeToFile(importedData);
    })
  .demandCommand(1, 'You need at least one command before moving on. Type "task --help" for help')
  .help()
  .argv;

function readFile () {
  if (!fs.existsSync(yargs.argv.path)) { throw new Error(`File "${yargs.argv.path}" not found`); }
  return require(yargs.argv.path);
}

function toXlsx (object) {
  const ws = xlsx.utils.json_to_sheet(object);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Notes');
  xlsx.writeFile(wb, yargs.argv.path.replace('.json', '.xlsx'));
  console.log(`XLSX file - \n\t ${yargs.argv.path.replace('.json', '.xlsx')}\nwas succesfully created.\n------------------------`);
}

function toJson (object, path) {
  const workbook = xlsx.readFile(path);
  const sheetNameList = workbook.SheetNames;
  let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
  data = checkData(data, object);
  return object.concat(data);
}

function checkData (data, object) {
  const filtered = data.filter(note => {
    if (note.body && note.title) {
      if (!object.filter(element => {
        if (element.title === note.title) {
          console.log(`Note with the title ${note.title} already exists. This note will skipped.`);
          return true;
        }
      }).length) {
        return note;
      };
    } else {
      console.log(`Note without title or body was found. This note will skipped.`);
    }
  });
  return filtered;
}

function updateNote (object, title, newTitle, newBody) {
  let changes = 0;
  const notes = object.map(element => {
    if (element.title.toLowerCase() === title.toLowerCase()) {
      element.title = newTitle || element.title;
      element.body = newBody || element.body;
      changes++;
    };
    return element;
  });
  if (!changes) { throw new Error(`Note with the title "${title}" wasn't found`); }
  return notes;
}

function writeToFile (object) {
  fs.writeFileSync(yargs.argv.path, JSON.stringify(object, null, ' '));
}

function checkTitleExistence (object, title) {
  object.forEach(element => {
    if (element.title === title) throw new Error(`Note with the "${title}" title already exists`);
  });
}

function showAllNotes (object) {
  console.clear();
  console.log('List of all notes:');
  object.forEach(element => {
    console.log('- - -');
    Object.keys(element).forEach(key => {
      console.log(key + ': ' + element[key]);
    });
  });
  console.log('- - -');
}

function getDateString () {
  const date = new Date();
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${new Date().toLocaleTimeString()}`;
}

function showNote (object, title) {
  console.clear();
  const note = object.filter(element => {
    if (element.title.toLowerCase() === title.toLowerCase()) {
      console.log('Note:');
      Object.keys(element).forEach(key => {
        console.log(key + ': ' + element[key]);
      });
      return element;
    }
  });
  if (!note.length) { throw new Error(`Note with the title "${title}" wasn't found`); }
}

function removeNote (object, title) {
  const newObject = object.filter(element => {
    if (element.title.toLowerCase() !== title.toLowerCase()) {
      return element;
    }
  });
  if (object.length === newObject.length) {
    throw new Error(`Note with the "${title}" title don't exists`);
  }
  return newObject;
}
