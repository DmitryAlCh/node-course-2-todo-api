const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');


// var id = '58a59cc77a16a83ef8f3ff5d';
//
// if (!ObjectID.isValid(id)){
//   console.log("ID not valid");
// }


// Todo.find({
//   _id: id
// }).then((todos)=>{
//   console.log("Todos:", todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo)=>{
//   console.log("Todo:", todo);
// });

// Todo.findById(id).then((todo)=>{
//   if (!todo){
//     return console.log('Id not found');
//   }
//   console.log("Todo By Id:", todo);
// }).catch((e)=>console.log(e));

// Challenge User.finById, 1. user not found 2. user found print it 3. ID invalid
var userId='58a42a9073d8be30e895a56d';

User.findById(userId).then((user)=>{
  if (!user){
    return console.log("User not found");
  }
  console.log("User found:", user);
}).catch((e)=>{
  console.log(e);
});
