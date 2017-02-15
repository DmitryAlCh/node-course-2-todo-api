var mongoose  = require ('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

var newTodo = new Todo({
  text: 'Cook dinner'
});

// newTodo.save().then((doc)=>{
//   console.log('Save todo ', doc);
// },(e)=>{
//   console.log('Unable to save todo');
// });

var secondTodo = new Todo({
  text: 'Eat dinner',
  completed: false,
  completedAt: 11
});

secondTodo.save().then((doc)=>{
  console.log('Saved new todo ', doc);
},(e)=>{
  console.log('Unable to save new todo ', e);
});
