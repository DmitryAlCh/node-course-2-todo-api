var mongoose = require ('mongoose');

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

module.exports = {
  Todo: Todo
}
