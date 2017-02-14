// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // findOneAndUpdate

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('58a2fd3093c0ce1b408ca44b')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //     returnOriginal: false
  //   }).then( (res)=>{
  //   console.log(res);
  // });

  // challenge Update a User name in Users collectien

  // db.collection("Users").findOneAndUpdate({_id: new ObjectID('58a1c648abdba53d28c2e404')},
  //   {
  //     $set:{
  //     name: "Albert"
  //     }
  //   }, {
  //     returnOriginal: false
  //   }).then((res) =>{
  //     console.log(res);
  //   });

  // Challenge increment Users age in Users collection

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('58a1c648abdba53d28c2e404')
  },{
    $inc: {
      age: 1
    }
  },{
    returnOriginal:false
  }).then(
    (success) => {
      console.log('User age incremented');
      console.log(JSON.stringify(success, undefined, 2));
    },
    (error) => {
      console.log('Unable to increment user age');
      console.log(error);
    }
  );



  // db.close();
});
