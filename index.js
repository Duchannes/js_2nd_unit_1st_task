const notes = require('./notes');
const xlsx = require('./xlsx');
const readWrite = require('./read-write');

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
      let allNotes = readWrite.readFile(yargs.argv.path);
      notes.checkTitleExistence(allNotes, argv.title);
      allNotes = notes.addNote(allNotes, argv.title, argv.body);
      readWrite.writeToFile(allNotes, yargs.argv.path);
      console.log('Note was successfully added.');
    })
  .command(
    'list',
    'List all notes',
    {},
    function list () {
      const allNotes = readWrite.readFile(yargs.argv.path);
      notes.showAllNotes(allNotes);
    })
  .command(
    'read <title>',
    'Read one note by it\'s <title>',
    {},
    function read (argv) {
      const allNotes = readWrite.readFile(yargs.argv.path);
      notes.showNote(allNotes, argv.title);
    })
  .command(
    'remove <title>',
    'Remove one note by it\'s <title>',
    {},
    function remove (argv) {
      let allNotes = readWrite.readFile(yargs.argv.path);
      allNotes = notes.removeNote(allNotes, argv.title);
      readWrite.writeToFile(allNotes, yargs.argv.path);
      console.log('Note was successfully deleted.');
    })
  .command(
    'update <title> [newTitle] [newBody]',
    'Changes note with a specific <title>',
    {},
    function update (argv) {
      let allNotes = readWrite.readFile(yargs.argv.path);
      if (argv.newTitle) { notes.checkTitleExistence(allNotes, argv.newTitle); }
      allNotes = notes.updateNote(allNotes, argv.title, argv.newTitle, argv.newBody);
      readWrite.writeToFile(allNotes, yargs.argv.path);
      console.log('Note was successfully updated.');
    })
  .command(
    'toxlsx [jsonPath]',
    'Export notes to xlsx file',
    {},
    function toxlsx (argv) {
      const allNotes = readWrite.readFile(yargs.argv.path);
      xlsx.toXlsx(allNotes, yargs.argv.path, argv.jsonPath);
    })
  .command(
    'tojson <xlsxPath>',
    'Import notes from xlsx file',
    {},
    function tojson (argv) {
      const allNotes = readWrite.readFile(yargs.argv.path);
      const importedData = xlsx.toJson(allNotes, argv.xlsxPath);
      readWrite.writeToFile(importedData, yargs.argv.path);
    })
  .command(
    'sort <order> <type>',
    'Sort notes by <type> in a certain <order> ',
    {},
    function sort (argv) {
      let allNotes = readWrite.readFile(yargs.argv.path);
      allNotes = notes.sort(allNotes, argv.type, argv.order);
      notes.showAllNotes(allNotes);
      readWrite.writeToFile(allNotes, yargs.argv.path);
    })
  .demandCommand(1, 'You need at least one command before moving on. Type "task --help" for help')
  .help()
  .argv;
