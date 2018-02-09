/* eslint-env node */
'use strict';

module.exports = function(app) {
  const express = require('express');
  let notebooksRouter = express.Router();
  let bodyParser = require('body-parser');
  app.use(bodyParser.json());
  const nedb = require('nedb');
  let notebookDB = new nedb({ filename: 'notebooks', autoload: true });

  notebooksRouter.get('/', function(req, res) {
    notebookDB.find(req.query).exec(function(error, notebooks){
      res.send({
        'notebooks': notebooks
      });
    });
  });

  notebooksRouter.post('/', function(req, res) {
    notebookDB.find({}).sort({ id: -1 }).limit(1).exec(
      function(err, notebooks) {
        if(notebooks.length != 0)
          req.body.notebook.id = notebooks[0].id + 1;
        else
          req.body.notebook.id = 1;
        notebookDB.insert(req.body.notebook,function(err, newNotebook) {
          res.status(201).end();
          res.send(
            JSON.stringify(
            {
              notebook: newNotebook
            }));
          });
      })
  });

  notebooksRouter.get('/:id', function(req, res) {
    res.send({
      'notebooks': {
        id: req.params.id
      }
    });
  });

  notebooksRouter.put('/:id', function(req, res) {
    res.send({
      'notebooks': {
        id: req.params.id
      }
    });
  });

  notebooksRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/notebooks', require('body-parser').json());
  app.use('/api/notebooks', notebooksRouter);
};
