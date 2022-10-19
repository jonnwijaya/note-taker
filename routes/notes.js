const notes = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) =>
    readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)))
);

// POST Route for submitting notes
notes.post('/', (req, res) => {
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNotes = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNotes, './db/notes.json');

        const response = {
            status: 'success',
            body: newNotes,
        };

        res.json(response);
    } else {
        res.json('Error in posting notes');
    }
});

notes.delete("/:id", (req, res) => {

    console.info(`${req.method}`);

    const notesId = req.params.id.toString();
    const file = JSON.parse(fs.readFileSync("./db/notes.json", "utf8"));
    const newNotes = file.filter(notes =>
        notes.id.toString() !== notesId
    );

    fs.writeFileSync('./db/notes.json', JSON.stringify(newNotes));
    res.json(newNotes);

    console.log(`${req.method}`);
});

module.exports = notes;
