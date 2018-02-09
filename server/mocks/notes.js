/* eslint-env node */
'use strict';

module.exports = function(app) {
  const express = require('express');
  let notesRouter = express.Router();
  let bodyParser = require('body-parser');
  app.use(bodyParser.json());
  const nedb = require('nedb');
  let noteDB = new nedb({ filename: 'notes', autoload: true });

  notesRouter.get('/', function(req, res) {
    noteDB.find(req.query).exec(function(error, notes) {
      res.send({
        'notes': notes
      });
    });
  });

  notesRouter.post('/', function(req, res) {
    userDB.find({}).sort({id : -1}).limit(1).exec(function(err,notes) {
      if(notes.length != 0)
        req.body.note.id = notes[0].id + 1;
      else
        req.body.note.id = 1;
      // Insert the new record into our datastore, and return the newly created record
      // to Ember Data
      noteDB.insert(req.body.note, function(err,newNote) {
        res.status(201);
        res.send(
          JSON.stringify(
          {
            note : newNote
          }
        ));
      });
    })
  });

  notesRouter.get('/:id', function(req, res) {
    res.send({
      'notes': {
        id: req.params.id
      }
    });
  });

  notesRouter.put('/:id', function(req, res) {
    let id = parseInt(req.params.id);
    noteDB.update({ id: id }, { $set: req.body.note },
      function(err, numReplaced, newNotes) {
        res.send({
          'notes': {
            id: id
          }
        });
      }
    );
  });

  notesRouter.delete('/:id', function(req, res) {
    let id = parseInt(req.params.id);
    noteDB.remove({ id: id }, function(err, numRemoved) {
      res.status(204).end();
    });
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/notes', require('body-parser').json());
  app.use('/api/notes', notesRouter);
};
