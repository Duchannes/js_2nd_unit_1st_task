const fs = require('fs');

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
      jsonObject.push({ title: argv.title, body: argv.body });
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
  .demandCommand(1, 'You need at least one command before moving on. Type "task --help" for help')
  .help()
  .argv;

function readFile () {
  if (!fs.existsSync(yargs.argv.path)) { throw new Error(`File "${yargs.argv.path}" not found`); }
  return require(yargs.argv.path);
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
