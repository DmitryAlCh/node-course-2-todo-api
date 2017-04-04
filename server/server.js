require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then(
    (success)=>{
      res.send(success);
    },
    (e)=>{
      res.status(400).send(e);
    }
  );
});

app.get('/todos', (req, res) => {
  Todo.find().then((success) =>{
    res.send({todos:success});
  }, (err) =>{
    res.status(400).send(err);
  });
});

//  GET /todos/123344
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  // validate Id and respond 404 if id not valid.
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  // find By Id
    // success
      // if todo = send it back
      // if no todo = 404 with empty body
  Todo.findById(id).then((success) => {
    if(!success){
      return res.status(404).send();
    }
    res.status(200).send({todo:success});

  }, (error) => {
    // error
      // 400 - nothing
      res.status(400).send();
  });

});

app.delete('/todos/:id', (req, res) => {
  // get the ID
  var id = req.params.id;
  // Validate the ID  (404)
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  // remove by ID
  Todo.findByIdAndRemove(id).then((success_doc) => {
    if (!success_doc){
      return res.status(404).send();
    }
    res.status(200).send({todo:success_doc});
  }, (error) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text','completed']);
  // .pick({object_to_pick_FROM}, [Array of propertys we take from object]);
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
    Todo.findByIdAndUpdate(id, {$set:body}, {new: true}).then( (todo) =>{
      if (!todo){
        return res.status(404).send();
      }
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    })

});

// POST /Users

app.post('/users', (req, res) => {
  var pickedParts = _.pick(req.body, ['email', 'password']);
  var user = new User({
    email: pickedParts.email,
    password: pickedParts.password
  });

  user.save().then(() =>{
    return user.generateAuthToken();
  }).then((token) => {
    console.log('token val inside res.header', token);
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  })
});

// Post /users/login {email, password}
app.post('/users/login', (req,res) => {
  var body = _.pick(req.body, ['email','password']);

  User.findByCredentials(body.email, body.password).then(
    (user) => {
      user.generateAuthToken().then((token) =>{
        res.header('x-auth', token).send(user);
      })
    }
  ).catch((e) => {
      res.status(400).send();
  });
});


app.get('/users/me', authenticate, (req, res)=>{
  res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res)=>{
  req.user.removeToken(req.token).then(() =>{
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, ()=>{
  console.log(`Sarter up at port ${port}`);
});

module.exports = {
  app:app
}
