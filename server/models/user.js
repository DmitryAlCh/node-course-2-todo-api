const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');
const validator = require('validator');

var UserSchema = new mongoose.Schema({
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
    }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  // console.log('generateAuthToken called:',{access, token});
  user.tokens.push({access, token});

  return user.save().then(()=>{
    // console.log(token);
    return token;

  })
};
UserSchema.methods.removeToken = function (token){
  var user = this;
  return user.update({
    $pull: {
      tokens: {
        token:token
      }
    }
  });
}

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try{
      decoded = jwt.verify(token, 'abc123');
  } catch(e){
    return Promise.reject();
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function(email, password){
  var User = this;

  return User.findOne({email}).then((user) =>{
    if (!user){
      return Promise.reject();
    }
    return new Promise((resolve, reject) =>{
      bcrypt.compare(password, user.password, (err, boolResult) =>{
        if(!err){
          if (boolResult){
            resolve(user);
            return;
          }
        }
        reject();
      });
    });
  })
};

UserSchema.pre('save', function(next){
  var user = this;
  if (user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) =>{
      bcrypt.hash(user.password, salt, (err, hash)=>{
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});
var User = mongoose.model('Users', UserSchema);

module.exports={
  User: User
}
