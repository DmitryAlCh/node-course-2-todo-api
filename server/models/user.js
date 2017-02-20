const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('Users', {
  email: {
    required: true,
    type: String,
    trim: true,
    minlength: 3,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
      type: String,
      require: true,
      minlength: 6
    },
  tokens: [{
      access: {
        type: String,
        require: true,
      },
      token:{
        type: String,
        require: true,
      }
    }],
});

module.exports={
  User: User
}
