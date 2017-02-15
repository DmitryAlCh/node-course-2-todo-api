var mongoose  = require ('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true //removes all whitespaces befor and after text
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
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
  text: '  Edit code '
});

// secondTodo.save().then((doc)=>{
//   console.log('Saved new todo ', doc);
// },(e)=>{
//   console.log('Unable to save new todo ', e);
// });

// User
// email - require it - trim it, set type, set min lenght.

var User = mongoose.model('Users', {
  email: {
    required: true,
    type: String,
    trim: true,
    minlength: 3,
  }
});

var firstUser = new User({
  email: 'dmitry@mail.com'
});

firstUser.save().then(
  (succesMessage)=>{
    console.log('User added');
    console.log(JSON.stringify(succesMessage, undefined, 2));
  },
  (errorMessage)=>{
    consoe.log('Unable to add user: ', errorMessage);
  }
);
