const fs = require('fs');

const path = './note.json';

const yargs = require('yargs')
  .usage('$0 <cmd> [args]')
  .command(
    'add [title] [body]',
    'Add new unique note with the [title] and the [body]',
    {},
    function add (argv) {
      let file = readFile();
      checkTitle(file, argv.title);
      file = addNote(file, argv.title, argv.body);
      writeToFile(file);
      console.clear();
      console.log('Note added successfully.');
    })
  .command(
    'list',
    'List all notes',
    {},
    function list () {
      let file = readFile();
      showAllNotes(file);
    })
  .command(
    'read [title]',
    'Read one note by it\'s [title]',
    {},
    function read (argv) {
      const file = readFile();
      showNote(file, argv.title);
    })
  .command(
    'remove [title]',
    'Remove one note by it\'s title [title]',
    {},
    function remove (argv) {
      const file = readFile();
      const modifiedFile = removeNote(file, argv.title);
      writeToFile(modifiedFile);
      console.clear();
      console.log('Note deleted successfully.');
    })
  .demandCommand(1, 'You need at least one command before moving on. Type "task --help" for help')
  .help()
  .argv;

function readFile () {
  if (!fs.existsSync(path)) {
    throw new Error(`File "${path}" not found`);
  }
  return require(path);
}

function addNote (object, title, body) {
  if (!title || !body) {
    throw new Error('[Title] or [body] cannot be empty');
  }
  object.push({ title: title, body: body });
  return object;
}

function writeToFile (object) {
  fs.writeFileSync(path, JSON.stringify(object, null, ' '));
}

function checkTitle (object, title) {
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
  console.log('Note:\n- - -');
  object.forEach(element => {
    if (element.title.toLowerCase() === title.toLowerCase()) {
      Object.keys(element).forEach(key => {
        console.log(key + ': ' + element[key]);
      });
    }
  });
  console.log('- - -');
}

function removeNote (object, title) {
  console.clear();
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
