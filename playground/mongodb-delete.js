// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // deleteMany

  // db.collection('Todos').deleteMany({text:"eat breakfast"}).then((success)=>{
  //   console.log(success);
  // }, (err)=>{
  //   console.log('Unable to delete Todo ', err);
  // });

  // deleteOne

  // db.collection('Todos').deleteOne({text: "eat breakfast"}).then((success)=>{
  //   console.log(success);
  // }, (err)=>{
  //   console.log(err);
  // });

  // findOneAndDelete

  // db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
  //   console.log(result);
  // });

  // chalenge deleteMany

  // db.collection('Users').deleteMany({name: "Dmitry"}).then((res) => {
  //   console.log("Users deleted");
  //   console.log(res);
  // }, (err) => {
  //   console.log("unable to delete users with provided name ", err);
  // });

  // chalenge delete by id 58a2cd263f469e04184ac960

  db.collection('Users').findOneAndDelete({_id: new ObjectID('58a2cd263f469e04184ac960')}).then((res)=>{
    console.log("Found and deleted:");
    console.log(res);
  },(err)=>{
    console.log('Unable to find user with provided id ', err);
  });


  // db.close();
});
