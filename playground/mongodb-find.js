// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find({_id: new ObjectID("58a1c43ddfcad50e508120ea")}).toArray().then((success)=>{
  //   console.log('Todos:');
  //   console.log(JSON.stringify(success, undefined, 2));
  // },(err)=>{
  //   console.log('Unable to fetch todos ', err);
  // });

  // db.collection('Todos').find().count().then((success)=>{
  //   console.log(`Todos count: ${success}`);
  //   },(err)=>{
  //   console.log('Unable to fetch todos ', err);
  // });

  db.collection('Users').find({name: "Dmitry"}).toArray().then((succesMessage) =>{
    console.log("All users with provided name:");
    console.log(JSON.stringify(succesMessage, undefined, 2));
  },(err) =>{
    console.log('Unable to fetch users with provided name ', err);
  });

  // db.close();
});
