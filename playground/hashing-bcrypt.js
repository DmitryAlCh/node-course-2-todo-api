const bcrypt = require('bcryptjs');


var password = '123abc!';


// bcrypt.genSalt(10, (err, salt)=>{
//   bcrypt.hash(password, salt, (err, hash)=>{
//     console.log(hash);
//   });
// });

var hashedPassw = '$2a$10$xdvLwS2m0II8j4k1luLQKOlD2Km.HO4CSZqn7uQbC..dIydJ7tN1m';

bcrypt.compare(password, hashedPassw, (err, boolResult)=>{
  console.log(boolResult);
});
