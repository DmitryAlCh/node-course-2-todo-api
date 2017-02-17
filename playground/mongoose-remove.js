const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// Todo.remove({}).then((result) =>{
//   console.log(result);
// });


// Tood.findOneAndRemove()
// Todo.finByIdAndRemove()



Todo.findByIdAndRemove('58a702f7c3e2647f8421221b').then((todo)=>{
  console.log(`todo removed ${todo}`);
});
