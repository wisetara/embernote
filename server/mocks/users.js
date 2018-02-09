/* eslint-env node */
'use strict';

module.exports = function(app) {
  const express = require('express');
  let usersRouter = express.Router();

  app.use('/api/users', require('body-parser').json());

  var nedb = require('nedb');
  var userDB = new nedb({ filename : 'users', autoload: true});

  usersRouter.get('/', function(req, res) {
    userDB.find(req.query).exec(function(error, users) {
      res.send({
        'users': users
      });
    });
  });

  usersRouter.post('/', function(req, res) {
    // Look for the most recently created record and use it to set the id field of our
    // incoming record, which is required by Ember Data
    userDB.find({}).sort({id : -1}).limit(1).exec(function(err,users) {
      if(users.length != 0)
        req.body.user.id = users[0].id + 1;
      else
        req.body.user.id = 1;

      // Insert the new record into our datastore, and return the newly created record
      // to Ember Data
      userDB.insert(req.body.user, function(err,newUser) {
        res.status(201);
        res.send(
          JSON.stringify(
          {
            user : newUser
          }));
      });
    })
  });

  usersRouter.get('/:id', function(req, res) {
    res.send({
      'users': {
        id: req.params.id
      }
    });
  });

  usersRouter.put('/:id', function(req, res) {
    res.send({
      'users': {
        id: req.params.id
      }
    });
  });

  usersRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  app.use('/api/users', usersRouter);
};
