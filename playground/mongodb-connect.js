const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
//db is avaliable in case of successful connection
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result)=>{
  //   if (err){
  //     return console.log('Unable to insert Todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
//always close connection

// insert new doc into Users (name,age,location)
  db.collection('Users').insertOne({
    name: "Dmitry",
    age: 33,
    location: "Latvia"
  },(err, success)=>{
    if (err){
      return console.log('Unable to add user', err);
    }
    console.log(JSON.stringify(success.ops, undefined, 2));
  });
  db.close();
});
