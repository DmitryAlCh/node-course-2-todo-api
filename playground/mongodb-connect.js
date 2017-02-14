// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');


// var user = {name:"Dmitry", age:33};
// var {name} = user;
// console.log(name);

// object destructuring, takes any property out of an object
// var {needed property name} = objectName;

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
// db is avaliable in case of successful connection
  db.collection('Todos').insertOne({
    text: 'eat breakfast',
    completed: false
  }, (err, result)=>{
    if (err){
      return console.log('Unable to insert Todo', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });
//always close connection

// insert new doc into Users (name,age,location)
  // db.collection('Users').insertOne({
  //   name: "Dmitry",
  //   age: 33,
  //   location: "Latvia"
  // },(err, success)=>{
  //   if (err){
  //     return console.log('Unable to add user', err);
  //   }
  //   console.log(JSON.stringify(success.ops[0]._id.getTimestamp(), undefined, 2));
  // });
  db.close();
});
