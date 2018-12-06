const removeNote = function (allNotes, title) {
  const updatedNotes = allNotes.filter(element => {
    if (element.title.toString().toLowerCase() !== title.toString().toLowerCase()) {
      return element;
    }
  });
  if (allNotes.length === updatedNotes.length) {
    throw new Error(`Note with the "${title}" title don't exists`);
  }
  return updatedNotes;
};

const showNote = function (allNotes, title) {
  const note = allNotes.filter(element => {
    if (element.title.toString().toLowerCase() === title.toString().toLowerCase()) {
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
  console.log('List of all notes:');
  allNotes.forEach(note => {
    console.log('- - -');
    Object.keys(note).forEach(key => {
      console.log(key + ': ' + note[key]);
    });
  });
  console.log('- - -');
};

const checkTitleExistence = function (allNotes, title) {
  allNotes.forEach(note => {
    if (note.title === title) throw new Error(`Note with the "${title}" title already exists`);
  });
};

const updateNote = function (allNotes, title, newTitle, newBody) {
  let someChange = false;
  const notes = allNotes.map(element => {
    if (element.title.toString().toLowerCase() === title.toString().toLowerCase()) {
      element.title = newTitle || element.title;
      element.body = newBody || element.body;
      someChange = true;
    };
    return element;
  });
  if (!someChange) { throw new Error(`Note with the title "${title}" wasn't found`); }
  return notes;
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
exports.checkTitleExistence = checkTitleExistence;
exports.updateNote = updateNote;
exports.addNote = addNote;
exports.sort = sort;
