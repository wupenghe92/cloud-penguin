const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
* Hint: Why is bcrypt required here?
*/
// const SALT_WORK_FACTOR = 10;
// const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username:     {type: String, required: true, unique: true},
  password:     {type: String, required: true},
  created:      {type: Date,   default: Date.now},
  friendliness: {type: Number, default: 0}
});


// userSchema.pre('save', function(next) {
//   const user = this;
//   const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
//   const hashedPassword = bcrypt.hashSync(user.password, salt);
//   user.password = hashedPassword;
//   next();
// });

// userSchema.methods.comparePassword = function(plainPassword) {
//   return bcrypt.compareSync(plainPassword, this.password);
// }

module.exports = mongoose.model('User', userSchema);
