const {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


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
    res.status(200).send(success_doc);
  }, (error) => {
    res.status(400).send();
  });
});


app.listen(port, ()=>{
  console.log(`Sarter up at port ${port}`);
});

module.exports = {
  app:app
}
